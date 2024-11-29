importScripts(`${self.location.origin}/projects/biomes/1/services.js`);
const MineSystemId = BiomesYeomen.SYSTEMS.MineSystemId;
const MoveSystemId = BiomesYeomen.SYSTEMS.MoveSystemId;
const BuildSystemId = BiomesYeomen.SYSTEMS.BuildSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;
const DropSystemId = BiomesYeomen.SYSTEMS.DropSystemId;

const mineObjectTypes = formFields['mineObjectTypes'];
const mineObjectTypeIds = mineObjectTypes.map((objectType) => BiomesYeomen.ObjectTypes[objectType] || 0);

const dropObjects = formFields['dropObjects'];

let radius = 10;

const MAX_MINE_DEPTH = formFields['maxMineDepth'];

const WORLD_BORDERS = BiomesYeomen.WORLD_BORDERS;
const FORCE_FIELD_SHARD_DIM = 32;

const MINING_RANGE = 10;



const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');

            let stats = {
                burrow: 0,
                mine: 0,
                move: 0,
                jumpBuild: 0,
                startTime: new Date().getTime(),
                endTime: new Date().getTime(),
                objectTypes: { 88: 0, 89: 0, 91: 0, 93: 0, 95: 0 }
            };
            await displayStats();

            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

            YeomenAI.statusMessage('Fetching player and position');
            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            if (!playerRecord || playerRecord?.entityId == '0x0000000000000000000000000000000000000000000000000000000000000000') {
                YeomenAI.statusMessage('Player not found. Please ensure the delegator is set for session signing and verify that the address is correct.', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = await getPlayerCurrentPostion();


            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            YeomenAI.registerShutdown(async () => {

                console.log('start registerShutdown callback')
                let currentPositionCoord = await getPlayerCurrentPostion();
                //await YeomenAI.delay(10);

                let mineCoords = { x: currentPositionCoord.x, y: currentPositionCoord.y + 1, z: currentPositionCoord.z };
                try {

                    await YeomenAI.estimateContractGas('mine', [mineCoords], MineSystemId);
                    try {
                        YeomenAI.statusMessage(`Start mining`);
                        await YeomenAI.sendTransaction('mine', [mineCoords], MineSystemId);
                        YeomenAI.statusMessage(`Successfully mined`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        await YeomenAI.delay(2);
                        await BiomesYeomen.syncTerrains([[mineCoords.x, mineCoords.y, mineCoords.z]]);
                        await BiomesYeomen.syncPlayer(playerAddress);
                        await YeomenAI.delay(2);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to mine: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    console.log(JSON.stringify(err))
                }

                console.log('end registerShutdown callback')
            });

            //Login player
            try {

                await YeomenAI.estimateContractGas('loginPlayer', [currentPositionCoord], PlayerLoginSystemId);
                try {
                    YeomenAI.statusMessage(`Start loginPlayer`);
                    await YeomenAI.sendTransaction('loginPlayer', [currentPositionCoord], PlayerLoginSystemId);
                    YeomenAI.statusMessage(`Successfully loginPlayer`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to loginPlayer: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            } catch (err) {
                //YeomenAI.statusMessage('Player not loggedin', YeomenAI.MESSAGE_TYPES.ERROR);
                //YeomenAI.exit(1);
                //return;
            }

            YeomenAI.statusMessage('Check if area is protected by a forcefield');
            const shardCoord = BiomesYeomen.coordToShardCoord(currentPositionCoord, FORCE_FIELD_SHARD_DIM);
            console.log('shardCoord', shardCoord)


            const shardField = await BiomesYeomen.getShardField(shardCoord.x, shardCoord.y, shardCoord.z);
            console.log('shardField', shardField)

            const forcefieldEntityId = shardField ? shardField.force_field_entity_id.replace(/\\x/g, '0x') : null;
            console.log(forcefieldEntityId)
            const experienceChipAttachmentRecord = forcefieldEntityId ? await BiomesYeomen.getExperienceChipAttachmentRecord(forcefieldEntityId) : null;
            console.log(experienceChipAttachmentRecord)

            if (experienceChipAttachmentRecord && experienceChipAttachmentRecord.attacher.toLowerCase() !== playerAddress.toLowerCase()) {
                YeomenAI.statusMessage('This area is protected by a forcefield, you dont have permission to build or mine.', YeomenAI.MESSAGE_TYPES.ERROR);
                //YeomenAI.exit(1);
                //return;

                await movePlayerToNewPostion();

            } else {


                YeomenAI.statusMessage(`Searching for ores within radius ${radius}`);
                let allOresBlocks = [];
                let rangeStartCoord = { x: currentPositionCoord.x - radius, y: currentPositionCoord.y + 1000, z: currentPositionCoord.z - radius };
                let rangeEndCoord = { x: currentPositionCoord.x + radius, y: currentPositionCoord.y + 1000, z: currentPositionCoord.z + radius };
                let rangeBlocks = await BiomesYeomen.generateRangeBlocks(rangeStartCoord, rangeEndCoord, 0);
                //console.log(rangeBlocks);

                for (let x = rangeStartCoord.x; x <= rangeEndCoord.x; x++) {
                    for (let z = rangeStartCoord.z; z <= rangeEndCoord.z; z++) {
                        let coord = { x, y: rangeStartCoord.y, z };
                        console.log(`Checking coordinates: ${JSON.stringify(coord)}`);
                        const blocks = await BiomesYeomen.getBlocksV2(coord.x, coord.y, coord.z, rangeBlocks);
                        //console.log(blocks)

                        // Check if any block in the current coordinate matches the ores types
                        //let oresBlocks = blocks.filter(b => mineObjectTypeIds.includes(b.block));
                        let oresBlocks = [];
                        for (let block of blocks) {
                            //Check chain to make sure this is not mined
                            if (mineObjectTypeIds.includes(block.block)) {
                                let chainBlock = await BiomesYeomen.getChainBlock(block.x, block.y, block.z);
                                console.log(chainBlock, block);
                                //Confirm with live
                                if (chainBlock == 0) {
                                    oresBlocks.push(block);
                                }
                            }
                        }

                        for (let oreBlock of oresBlocks) {
                            const distance = Math.sqrt(
                                Math.pow(oreBlock.x - currentPositionCoord.x, 2) +
                                Math.pow(oreBlock.y - currentPositionCoord.y, 2) +
                                Math.pow(oreBlock.z - currentPositionCoord.z, 2)
                            );
                            oreBlock.distance = distance
                        }
                        //console.log(oresBlocks)
                        allOresBlocks = [...allOresBlocks, ...oresBlocks];
                    }
                }

                //Filter max depth allowed
                allOresBlocks = allOresBlocks.filter(block => {
                    return block.y >= MAX_MINE_DEPTH;
                })

                // Sort all ores by distance
                allOresBlocks.sort((a, b) => a.distance - b.distance);

                console.log('allOresBlocks', JSON.stringify(allOresBlocks));



                // Function to move the player towards the target ore block
                async function moveToOre(oreBlock) {
                    currentPositionCoord = await getPlayerCurrentPostion();
                    let miningPath = [];
                    let cursorPositionCoord = currentPositionCoord;

                    //Drop Gravel & Dirt
                    if (dropObjects) {
                        let dropObjectIds = [41, 37];//Gravel , Dirt 
                        let maxInventoryCount = 500;
                        for (let dropObjectId of dropObjectIds) {
                            const inventoryCountRecord = await BiomesYeomen.getInventoryCountRecord(playerEntityId, ethers.utils.hexZeroPad(dropObjectId, 32));

                            if (inventoryCountRecord && inventoryCountRecord.count > maxInventoryCount) {
                                let dropCount = inventoryCountRecord.count - maxInventoryCount;
                                let dropCoord = { x: currentPositionCoord.x, y: currentPositionCoord.y + 1, z: currentPositionCoord.z };
                                await drop(dropObjectId, dropCount, dropCoord);
                            }
                        }
                    }


                    // Move step by step towards the target ore block
                    while (
                        cursorPositionCoord.x !== oreBlock.x ||
                        cursorPositionCoord.y !== oreBlock.y ||
                        cursorPositionCoord.z !== oreBlock.z
                    ) {

                        let newPositionCoord;
                        if (cursorPositionCoord.x < oreBlock.x) {

                            try {
                                newPositionCoord = { x: cursorPositionCoord.x + 1, y: cursorPositionCoord.y, z: cursorPositionCoord.z };
                                //currentPositionCoord.x++; // Move right
                                YeomenAI.statusMessage('Mining right');
                                await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                                //await movePlayer([newPositionCoord]);
                                miningPath.push(newPositionCoord);
                                cursorPositionCoord = newPositionCoord;
                            } catch (err) {

                            }
                        } else if (cursorPositionCoord.x > oreBlock.x) {

                            try {
                                newPositionCoord = { x: cursorPositionCoord.x - 1, y: cursorPositionCoord.y, z: cursorPositionCoord.z };
                                //currentPositionCoord.x--; // Move left
                                YeomenAI.statusMessage('Mining left');
                                await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                                //await movePlayer([newPositionCoord]);
                                miningPath.push(newPositionCoord);
                                cursorPositionCoord = newPositionCoord;
                            } catch (err) {

                            }
                        } else if (cursorPositionCoord.y < oreBlock.y) {

                            try {
                                //newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y + 1, z: cursorPositionCoord.z };
                                //currentPositionCoord.y++; // Move upward


                                // Staircase up if z direction is towards ore
                                if (cursorPositionCoord.z !== oreBlock.z) {
                                    newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y + 1, z: cursorPositionCoord.z + (cursorPositionCoord.z < oreBlock.z ? 1 : -1) };
                                    YeomenAI.statusMessage('Mining staircase upward');

                                    await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                                    miningPath.push(newPositionCoord);
                                } else {
                                    //Move player to cursorPosition
                                    if (miningPath.length > 0) {
                                        await movePlayer(miningPath);
                                        miningPath = [];
                                        currentPositionCoord = await getPlayerCurrentPostion();
                                    }

                                    newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y + 1, z: cursorPositionCoord.z };
                                    YeomenAI.statusMessage('Mining upward');


                                    await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);

                                    let buildObjectIds = [43, 42, 41, 39, 37, 35];
                                    let inventoryCounts = [];
                                    for (let objectId of buildObjectIds) {

                                        let inventoryCountRecord = await BiomesYeomen.getInventoryCountRecord(
                                            playerEntityId,
                                            ethers.utils.hexZeroPad(objectId, 32)
                                        );
                                        if (inventoryCountRecord) {
                                            inventoryCounts.push({ objectTypeId: inventoryCountRecord.objectTypeId, count: inventoryCountRecord.count });
                                        }
                                    }

                                    let inventoryCount = inventoryCounts.find((inventoryCount) => inventoryCount.count > 0);
                                    if (!inventoryCount) {
                                        YeomenAI.statusMessage(`Insufficient inventory object to jumpBuild`);
                                        YeomenAI.exit(1);
                                    }

                                    let objectId = inventoryCount.objectTypeId;

                                    await jumpBuildBlock(objectId);
                                }

                                cursorPositionCoord = newPositionCoord;
                            } catch (err) {

                            }
                        } else if (cursorPositionCoord.y > oreBlock.y) {

                            try {
                                //newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y - 1, z: cursorPositionCoord.z };
                                //currentPositionCoord.y--; // Move downward

                                // Staircase down if z direction is towards ore
                                if (cursorPositionCoord.z !== oreBlock.z) {
                                    newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y - 1, z: cursorPositionCoord.z + (cursorPositionCoord.z < oreBlock.z ? 1 : -1) };
                                    YeomenAI.statusMessage('Mining staircase downward');
                                    await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                                    miningPath.push(newPositionCoord);
                                } else {
                                    //Move player to cursorPosition
                                    if (miningPath.length > 0) {
                                        await movePlayer(miningPath);
                                        miningPath = [];
                                        currentPositionCoord = await getPlayerCurrentPostion();
                                    }

                                    newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y - 1, z: cursorPositionCoord.z };
                                    YeomenAI.statusMessage('Mining downward');
                                    await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);

                                }

                                cursorPositionCoord = newPositionCoord;
                            } catch (err) {

                            }
                        } else if (cursorPositionCoord.z < oreBlock.z) {

                            try {
                                newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y, z: cursorPositionCoord.z + 1 };
                                //currentPositionCoord.z++; // Move forward
                                YeomenAI.statusMessage('Mining forward');
                                await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                                //await movePlayer([newPositionCoord]);
                                miningPath.push(newPositionCoord);
                                cursorPositionCoord = newPositionCoord;
                            } catch (err) {

                            }
                        } else if (cursorPositionCoord.z > oreBlock.z) {

                            try {
                                newPositionCoord = { x: cursorPositionCoord.x, y: cursorPositionCoord.y, z: cursorPositionCoord.z - 1 };
                                //currentPositionCoord.z--; // Move backward
                                YeomenAI.statusMessage('Mining backward');
                                await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                                //await movePlayer([newPositionCoord]);
                                miningPath.push(newPositionCoord);
                                cursorPositionCoord = newPositionCoord;
                            } catch (err) {

                            }
                        }

                        //Move player closer to mine more blocks
                        if (miningPath.length >= MINING_RANGE) {
                            await movePlayer(miningPath.splice(0, MINING_RANGE));
                            currentPositionCoord = await getPlayerCurrentPostion();
                        }

                        // After moving, mine at the new position
                        // mine();           
                        //currentPositionCoord = await getPlayerCurrentPostion();
                    }
                    YeomenAI.statusMessage('Completed mining ore');
                }


                if (allOresBlocks.length == 0) {
                    YeomenAI.statusMessage('No ores found matching.');
                    radius = radius + 10;
                    //YeomenAI.exit(0);
                }

                // Loop through all ores and move to each one
                for (const oreBlock of allOresBlocks) {
                    await moveToOre(oreBlock);
                    if (YeomenAI.shutdownRunning)
                        return await YeomenAI.resolveShutdown();
                }



            }

            async function getPlayerCurrentPostion() {
                let currentPositionCoord = null;
                const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
                console.log('positionRecord', positionRecord)
                if (positionRecord && (positionRecord.x !== 0 || positionRecord.y !== 0 || positionRecord.z !== 0)) {
                    currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
                }

                const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
                console.log('lastKnownPositionRecord', lastKnownPositionRecord)
                if (lastKnownPositionRecord && (lastKnownPositionRecord.x !== 0 || lastKnownPositionRecord.y !== 0 || lastKnownPositionRecord.z !== 0)) {
                    currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
                }

                return currentPositionCoord;
            }

            async function movePlayerToNewPostion() {
                YeomenAI.statusMessage('Check if player can be moved to new position');
                //Move player position       
                //const path = await BiomesYeomen.generatePath(currentPositionCoord, null, mineObjectTypeIds);
                //console.log(path)
                currentPositionCoord = await getPlayerCurrentPostion();

                //const radius = 10;
                let allOresBlocks = [];
                for (let x = currentPositionCoord.x - radius; x <= currentPositionCoord.x + radius; x++) {
                    for (let z = currentPositionCoord.z - radius; z <= currentPositionCoord.z + radius; z++) {
                        let coord = { x, y: currentPositionCoord.y + radius, z };//Extra radius buffer added to find pathPositionCoord
                        YeomenAI.statusMessage(`Checking coordinates: ${JSON.stringify(coord)}`);
                        const blocks = await BiomesYeomen.getBlocks(coord);
                        //console.log(blocks)
                        const pathPositionCoord = blocks.slice().reverse().find(block => block.block === 34);

                        // Check if any block in the current coordinate matches the ores types
                        //let oresBlocks = blocks.filter(b => mineObjectTypeIds.includes(b.block));

                        let oresBlocks = [];
                        for (let block of blocks) {
                            //Check chain to make sure this is not mined
                            if (mineObjectTypeIds.includes(block.block)) {
                                let chainBlock = await BiomesYeomen.getChainBlock(block.x, block.y, block.z);
                                console.log(chainBlock, block);
                                //Confirm with live
                                if (chainBlock == 0) {
                                    oresBlocks.push(block);
                                }
                            }
                        }

                        for (let oreBlock of oresBlocks) {
                            const distance = Math.sqrt(
                                Math.pow(oreBlock.x - currentPositionCoord.x, 2) +
                                Math.pow(oreBlock.y - currentPositionCoord.y, 2) +
                                Math.pow(oreBlock.z - currentPositionCoord.z, 2)
                            );
                            oreBlock.distance = distance;
                            oreBlock.pathPositionCoord = pathPositionCoord;
                        }

                        //console.log(oresBlocks)
                        allOresBlocks = [...allOresBlocks, ...oresBlocks];
                    }
                }

                allOresBlocks = allOresBlocks.filter(block => {
                    let pathPositionCoord = block.pathPositionCoord || null;
                    if (!pathPositionCoord) return false;

                    const depthDifference = Math.abs(pathPositionCoord.y - block.y);
                    return depthDifference <= MAX_MINE_DEPTH;
                });

                // Sort all ores by distance
                allOresBlocks.sort((a, b) => a.distance - b.distance);

                if (allOresBlocks.length == 0) {
                    YeomenAI.statusMessage('No ores within cut off depth near current surface location - Move to a lower height or change mining depth limit');
                    YeomenAI.exit(0);
                    return;
                }



                YeomenAI.statusMessage('Finding path to move');
                const pathPositionCoord = allOresBlocks[0].pathPositionCoord;
                let path = await BiomesYeomen.generatePath(currentPositionCoord, pathPositionCoord);
                // console.log('path',JSON.stringify(path));YeomenAI.exit(0);

                if (!path || path.length == 0) {
                    YeomenAI.statusMessage('No ores within cut off depth near current surface location - Move to a lower height or change mining depth limit');
                    YeomenAI.exit(0);
                    return;
                }
                try {
                    await YeomenAI.estimateContractGas('move', [path], MoveSystemId);
                    try {
                        YeomenAI.statusMessage(`Start moving to new loaction`);
                        await YeomenAI.sendTransaction('move', [path], MoveSystemId);
                        YeomenAI.statusMessage(`Successfully moved`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        await YeomenAI.delay(2);
                        await BiomesYeomen.syncPlayer(playerAddress);
                        await YeomenAI.delay(2);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to move: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    console.log(err)
                }
            }

            async function mineBlock(x, y, z, oreBlock) {
                try {
                    await YeomenAI.estimateContractGas('mine', [{ "x": x, "y": y, "z": z }], MineSystemId);
                } catch (err) {
                    console.log(JSON.stringify(err))
                    //throw err
                    return;
                }

                try {
                    if (x == oreBlock.x && y == oreBlock.y && z == oreBlock.z) {
                        YeomenAI.statusMessage(`Start mining block at ${JSON.stringify({ "x": x, "y": y, "z": z })} with target ${JSON.stringify(oreBlock)}`);
                    } else {
                        YeomenAI.statusMessage(`Start burrow block at ${JSON.stringify({ "x": x, "y": y, "z": z })} to target ${JSON.stringify(oreBlock)}`);
                    }

                    await YeomenAI.sendTransaction('mine', [{ "x": x, "y": y, "z": z }], MineSystemId);
                    if (x == oreBlock.x && y == oreBlock.y && z == oreBlock.z) {
                        stats.mine++;
                        stats.objectTypes[oreBlock.block] = (stats.objectTypes[oreBlock.block] || 0) + 1;
                        YeomenAI.statusMessage(`Successfully mined at ${JSON.stringify({ "x": x, "y": y, "z": z })} with target ${JSON.stringify(oreBlock)}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } else {
                        stats.burrow++;
                        YeomenAI.statusMessage(`Successfully burrowed at ${JSON.stringify({ "x": x, "y": y, "z": z })} to target ${JSON.stringify(oreBlock)}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    }
                    await displayStats();
                    await YeomenAI.delay(2);
                    await BiomesYeomen.syncTerrains([[x, y, z]]);
                    await BiomesYeomen.syncPlayer(playerAddress);
                    await YeomenAI.delay(2);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to mine: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    throw err;
                }

            }

            async function movePlayer(path) {
                try {
                    await YeomenAI.estimateContractGas('move', [path], MoveSystemId);
                } catch (err) {
                    console.log(err)
                    return;
                }
                try {
                    YeomenAI.statusMessage(`Start moving to new position`);
                    await YeomenAI.sendTransaction('move', [path], MoveSystemId);
                    stats.move++;
                    await displayStats();
                    YeomenAI.statusMessage(`Successfully moved`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    await YeomenAI.delay(2);
                    await BiomesYeomen.syncPlayer(playerAddress);
                    await YeomenAI.delay(2);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to move: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }

            }

            async function jumpBuildBlock(objectId) {
                //Build
                try {
                    await YeomenAI.estimateContractGas('jumpBuild', [objectId], BuildSystemId);
                } catch (err) {
                    console.log(JSON.stringify(err))
                    //throw err
                    return;
                }
                try {
                    YeomenAI.statusMessage(`Moved up one block with jumpBuild`);
                    currentPositionCoord = await getPlayerCurrentPostion();
                    await YeomenAI.sendTransaction('jumpBuild', [objectId], BuildSystemId);
                    stats.jumpBuild++;
                    await displayStats();
                    YeomenAI.statusMessage(`Moved up one block successfully with jumpBuild`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    await YeomenAI.delay(2);
                    await BiomesYeomen.syncTerrains([[currentPositionCoord.x, currentPositionCoord.y, currentPositionCoord.z]]);
                    await BiomesYeomen.syncPlayer(playerAddress);
                    await YeomenAI.delay(2);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to jumpBuild: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    throw err;
                }

            }

            async function drop(dropObjectId, numToDrop, coord) {

                try {
                    await YeomenAI.estimateContractGas('drop', [dropObjectId, numToDrop, coord], DropSystemId);
                } catch (err) {
                    console.log(JSON.stringify(err))
                    //throw err
                    return;
                }
                try {
                    YeomenAI.statusMessage(`Drop ${numToDrop} count of object ${dropObjectId} at x: ${coord.x}, y: ${coord.y}, z: ${coord.z}`);
                    currentPositionCoord = await getPlayerCurrentPostion();
                    await YeomenAI.sendTransaction('drop', [dropObjectId, numToDrop, coord], DropSystemId);
                    stats.jumpBuild++;
                    await displayStats();
                    YeomenAI.statusMessage(`Dropped ${numToDrop} count of object ${dropObjectId} at x: ${coord.x}, y: ${coord.y}, z: ${coord.z}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    await YeomenAI.delay(2);
                    await BiomesYeomen.syncTerrains([[currentPositionCoord.x, currentPositionCoord.y, currentPositionCoord.z]]);
                    await BiomesYeomen.syncPlayer(playerAddress);
                    await YeomenAI.delay(2);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to drop: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    //throw err;
                }

            }

            async function displayStats() {
                stats.endTime = new Date().getTime();
                console.log(stats)
                //await YeomenAI.markdown(null);

                let markdown = ``;
                markdown += `#### Ores Stats\n`;
                markdown += `| Ore Type            |       | Ores |\n`;
                markdown += `|---------------------|-------|-------|\n`;

                for (let [key, count] of Object.entries(stats.objectTypes)) {
                    const objectName = Object.keys(BiomesYeomen.ObjectTypes).find(name => BiomesYeomen.ObjectTypes[name] === parseInt(key));
                    markdown += `| ${objectName || key}          |       |   ${count}   |\n`;
                }

                markdown += `\n#### Overall Stats\n`;
                markdown += `|                     |       |       |\n`;
                markdown += `|---------------------|-------|-------|\n`;
                markdown += `| Total Burrows       |       |   ${stats.burrow}   |\n`;
                markdown += `| Total Mines         |       |   ${stats.mine}   |\n`;
                markdown += `| Total Moves         |       |   ${stats.move}   |\n`;
                markdown += `| Total Jump Builds   |       |   ${stats.jumpBuild}   |\n`;

                const totalTimeInSeconds = Math.floor((stats.endTime - stats.startTime) / 1000);
                markdown += `| Total Time (s)      |       |   ${totalTimeInSeconds}   |\n\n`;

                await YeomenAI.markdown(markdown);
            }


            YeomenAI.statusMessage('Completed one round of iteration.');
            await YeomenAI.delay(2);


        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   