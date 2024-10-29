importScripts(`${self.location.origin}/projects/biomes/1/services.js`);
const MineSystemId = BiomesYeomen.SYSTEMS.MineSystemId;
const MoveSystemId = BiomesYeomen.SYSTEMS.MoveSystemId;
const BuildSystemId = BiomesYeomen.SYSTEMS.BuildSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;

const mineObjectTypes = formFields['mineObjectTypes'];
const mineObjectTypeIds = mineObjectTypes.map((objectType) => BiomesYeomen.ObjectTypes[objectType] || 0);

const radius = 50;

const MAX_MINE_DEPTH = formFields['maxMineDepth'];

const WORLD_BORDERS = BiomesYeomen.WORLD_BORDERS;
const FORCE_FIELD_SHARD_DIM = 32;


const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');



            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

            YeomenAI.statusMessage('Fetching player and position');
            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = await getPlayerCurrentPostion();


            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

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



                // YeomenAI.statusMessage(`Searching for ores`);

                // let level = 0;
                // const maxRange = 10;
                // let allOresBlocks = [];


                // do {
                //     for (let dx = -level; dx <= level; dx++) {
                //         for (let dz = -level; dz <= level; dz++) {
                //             // Skip corners within the perimeter to avoid duplicates
                //             if (Math.abs(dx) !== level && Math.abs(dz) !== level) continue;

                //             let coord = { x: currentPositionCoord.x + dx, y: currentPositionCoord.y, z: currentPositionCoord.z + dz };

                //             console.log(`${level} - ${JSON.stringify(coord)}`)
                //             YeomenAI.statusMessage(`Checking coordinates: ${JSON.stringify(coord)}`);
                //             const blocks = await BiomesYeomen.getBlocks(coord);

                //             let oresBlocks = blocks.filter(b => mineObjectTypeIds.includes(b.block));
                //             for (let oreBlock of oresBlocks) {
                //                 const distance = Math.sqrt(
                //                     Math.pow(oreBlock.x - currentPositionCoord.x, 2) +
                //                     Math.pow(oreBlock.y - currentPositionCoord.y, 2) +
                //                     Math.pow(oreBlock.z - currentPositionCoord.z, 2)
                //                 );
                //                 oreBlock.distance = distance
                //             }
                //             allOresBlocks = [...allOresBlocks, ...oresBlocks];
                //         }
                //     }

                //     level++;
                // } while (allOresBlocks.length === 0 && level <= maxRange)


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

                //Filter max depath allowed
                allOresBlocks = allOresBlocks.filter(block => {
                    const depthDifference = Math.abs(currentPositionCoord.y - block.y);
                    return depthDifference <= MAX_MINE_DEPTH;
                })

                // Sort all ores by distance
                allOresBlocks.sort((a, b) => a.distance - b.distance);

                console.log('allOresBlocks', JSON.stringify(allOresBlocks));


                // Function to move the player towards the target ore block
                async function moveToOre(oreBlock) {
                    currentPositionCoord = await getPlayerCurrentPostion();
                    // Move step by step towards the target ore block
                    while (
                        currentPositionCoord.x !== oreBlock.x ||
                        currentPositionCoord.y !== oreBlock.y ||
                        currentPositionCoord.z !== oreBlock.z
                    ) {


                        let newPositionCoord;
                        if (currentPositionCoord.x < oreBlock.x) {
                            newPositionCoord = { x: currentPositionCoord.x + 1, y: currentPositionCoord.y, z: currentPositionCoord.z };
                            //currentPositionCoord.x++; // Move right
                            YeomenAI.statusMessage('Moving right');
                            await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                            await movePlayer([newPositionCoord]);
                        } else if (currentPositionCoord.x > oreBlock.x) {
                            newPositionCoord = { x: currentPositionCoord.x - 1, y: currentPositionCoord.y, z: currentPositionCoord.z };
                            //currentPositionCoord.x--; // Move left
                            YeomenAI.statusMessage('Moving left');
                            await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                            await movePlayer([newPositionCoord]);
                        } else if (currentPositionCoord.y < oreBlock.y) {
                            newPositionCoord = { x: currentPositionCoord.x, y: currentPositionCoord.y + 1, z: currentPositionCoord.z };
                            //currentPositionCoord.y++; // Move upward
                            YeomenAI.statusMessage('Moving upward');
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
                        } else if (currentPositionCoord.y > oreBlock.y) {
                            newPositionCoord = { x: currentPositionCoord.x, y: currentPositionCoord.y - 1, z: currentPositionCoord.z };
                            //currentPositionCoord.y--; // Move downward
                            YeomenAI.statusMessage('Moving downward');
                            await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                        } else if (currentPositionCoord.z < oreBlock.z) {
                            newPositionCoord = { x: currentPositionCoord.x, y: currentPositionCoord.y, z: currentPositionCoord.z + 1 };
                            //currentPositionCoord.z++; // Move forward
                            YeomenAI.statusMessage('Moving forward');
                            await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                            await movePlayer([newPositionCoord]);
                        } else if (currentPositionCoord.z > oreBlock.z) {
                            newPositionCoord = { x: currentPositionCoord.x, y: currentPositionCoord.y, z: currentPositionCoord.z - 1 };
                            //currentPositionCoord.z--; // Move backward
                            YeomenAI.statusMessage('Moving backward');
                            await mineBlock(newPositionCoord.x, newPositionCoord.y, newPositionCoord.z, oreBlock);
                            await movePlayer([newPositionCoord]);
                        }

                        // After moving, mine at the new position
                        // mine();           
                        currentPositionCoord = await getPlayerCurrentPostion();                        
                    }
                    YeomenAI.statusMessage('Completed mining ore');
                }

                // Loop through all ores and move to each one
                // for (const oreBlock of allOresBlocks) {
                //     await moveToOre(oreBlock);
                // }
                let oreBlock = allOresBlocks[0] || null;
                if (!oreBlock) {
                    YeomenAI.statusMessage('No ores found matching.');
                    YeomenAI.exit(0);
                }


                await moveToOre(oreBlock);



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

                const radius = 10;
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
                    try {
                        if (x == oreBlock.x && y == oreBlock.y && z == oreBlock.z) {
                            YeomenAI.statusMessage(`Start mining block at ${JSON.stringify({ "x": x, "y": y, "z": z })} with target ${JSON.stringify(oreBlock)}`);
                        } else {
                            YeomenAI.statusMessage(`Start burrow block at ${JSON.stringify({ "x": x, "y": y, "z": z })} to target ${JSON.stringify(oreBlock)}`);
                        }

                        await YeomenAI.sendTransaction('mine', [{ "x": x, "y": y, "z": z }], MineSystemId);
                        if (x == oreBlock.x && y == oreBlock.y && z == oreBlock.z) {
                            YeomenAI.statusMessage(`Successfully mined at ${JSON.stringify({ "x": x, "y": y, "z": z })} with target ${JSON.stringify(oreBlock)}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } else {
                            YeomenAI.statusMessage(`Successfully burrowed at ${JSON.stringify({ "x": x, "y": y, "z": z })} to target ${JSON.stringify(oreBlock)}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        }
                        await YeomenAI.delay(2);
                        await BiomesYeomen.syncTerrains([[x, y, z]]);
                        await BiomesYeomen.syncPlayer(playerAddress);
                        await YeomenAI.delay(2);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to mine: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        throw err;
                    }
                } catch (err) {
                    console.log(JSON.stringify(err))
                    //throw err
                }
            }

            async function movePlayer(path) {
                try {
                    await YeomenAI.estimateContractGas('move', [path], MoveSystemId);
                    try {
                        YeomenAI.statusMessage(`Start moving to new position`);
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

            async function jumpBuildBlock(objectId) {
                //Build
                try {
                    await YeomenAI.estimateContractGas('jumpBuild', [objectId], BuildSystemId);
                    try {
                        YeomenAI.statusMessage(`Moved up one block with jumpBuild`);
                        currentPositionCoord = await getPlayerCurrentPostion();
                        await YeomenAI.sendTransaction('jumpBuild', [objectId], BuildSystemId);
                        YeomenAI.statusMessage(`Moved up one block successfully with jumpBuild`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        await YeomenAI.delay(2);
                        await BiomesYeomen.syncTerrains([[currentPositionCoord.x, currentPositionCoord.y, currentPositionCoord.z]]);
                        await BiomesYeomen.syncPlayer(playerAddress);
                        await YeomenAI.delay(2);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to jumpBuild: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        throw err;
                    }
                } catch (err) {
                    console.log(JSON.stringify(err))
                    //throw err
                }
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