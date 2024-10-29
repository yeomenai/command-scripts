importScripts(`${self.location.origin}/projects/biomes/1/services.js`);
const MineSystemId = BiomesYeomen.SYSTEMS.MineSystemId;
const MoveSystemId = BiomesYeomen.SYSTEMS.MoveSystemId;
const BuildSystemId = BiomesYeomen.SYSTEMS.BuildSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;

const mineObjectTypes = formFields['mineObjectTypes'];
const mineObjectTypeIds = mineObjectTypes.map((objectType) => BiomesYeomen.ObjectTypes[objectType] || 0);

const MAX_MINE_DEPTH = formFields['maxMineDepth'];

let waterCoord = formFields['waterCoord'];

const MAX_PLAYER_STAMINA = 120000;
const PERCENTAGE_LOW_STAMINA = 10;
const PERCENTAGE_RECOVER_STAMINA = 50;

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


            // const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
            // console.log('positionRecord', positionRecord)
            // if (positionRecord && positionRecord.x != 0 && positionRecord.y != 0 && positionRecord.z != 0) {
            //     currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
            // }

            // const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
            // console.log('lastKnownPositionRecord', lastKnownPositionRecord)
            // if (lastKnownPositionRecord && lastKnownPositionRecord.x != 0 && lastKnownPositionRecord.y != 0 && lastKnownPositionRecord.z != 0) {
            //     currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
            // }

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
                await checkStamina(playerEntityId);

                let minedBlocks = await YeomenAI.getStorageItem('minedBlocks') || [];


                YeomenAI.statusMessage('Scanning for selected ores on current position');
                const blocks = await BiomesYeomen.getBlocks(currentPositionCoord);
                console.log('blocks', blocks)
                //const targetBlocks = blocks.filter(b => mineObjectTypeIds.includes(b.block));
                let targetBlocks = [];
                for (let block of blocks) {
                    //Check chain to make sure this is not mined
                    if (mineObjectTypeIds.includes(block.block)) {
                        let chainBlock = await BiomesYeomen.getChainBlock(block.x, block.y, block.z);
                        console.log(chainBlock, block);
                        //Confirm with live
                        if (chainBlock == 0) {
                            targetBlocks.push(block);
                        }
                    }
                }
                console.log(targetBlocks);
                //let targetBlock = (targetBlocks.length > 0) ? targetBlocks[0] : null;
                //console.log(targetBlock)

                let mineTargetBlocks = targetBlocks.filter(block => {
                    const depthDifference = Math.abs(currentPositionCoord.y - block.y);
                    return depthDifference <= MAX_MINE_DEPTH;
                }).slice(0, 1);



                if (mineTargetBlocks.length == 0) {
                    YeomenAI.statusMessage('No ores within cut off depth near current surface location - Move to a lower height or change mining depth limit');
                }


                if (mineTargetBlocks.length > 0) {
                    YeomenAI.statusMessage(`Start mining to get Ores at positions ${JSON.stringify(mineTargetBlocks)}`);

                    while (currentPositionCoord.y > mineTargetBlocks[mineTargetBlocks.length - 1].y) {
                        try {
                            const mineCord = { x: currentPositionCoord.x, y: currentPositionCoord.y - 1, z: currentPositionCoord.z };
                            const block = await BiomesYeomen.getBlock(mineCord);
                            // Mine the block below the current position
                            await mineBlock(mineCord.x, mineCord.y, mineCord.z);

                            // Store the position of the mined block for building later
                            minedBlocks.push(block);
                            await YeomenAI.setStorageItem('minedBlocks', minedBlocks);


                            // Move down one block
                            //currentPositionCoord.y -= 1; // Update the current Y position after mining    
                            currentPositionCoord = await getPlayerCurrentPostion();
                        } catch (err) {
                            console.log(JSON.stringify(err))
                            YeomenAI.statusMessage(`Mining error, ${JSON.stringify(err)}`);
                            //throw err;
                        }
                    }
                }

                console.log("Mined blocks:", minedBlocks);

                if (minedBlocks.length > 0) {
                    // Reverse the mined blocks array
                    let reversedMinedBlocks = [...minedBlocks].reverse();
                    let jumpBuildIndex = 0; // Index to track the current block

                    // Build blocks back up in reverse order
                    YeomenAI.statusMessage(`Mining completed, returning player to surface`);
                    //for (let i = 0; i < reversedMinedBlocks.length; i++) {
                    while (jumpBuildIndex < reversedMinedBlocks.length) {
                        try {
                            const minedBlock = reversedMinedBlocks[jumpBuildIndex];

                            // Only rebuild if the mined block is not the mineTargetBlocks
                            if (!mineTargetBlocks.some(mineTargetBlock => minedBlock.y === mineTargetBlock.y)) {
                                //    await buildBlock(minedBlock.block, minedBlock.x, minedBlock.y, minedBlock.z); // Build the block back
                                await jumpBuildBlock(minedBlock.block);
                            }

                            // Remove the block from storage after building it back
                            //minedBlocks.splice(minedBlocks.length - 1 - jumpBuildIndex, 1); // Adjust index since we're reversing the array
                            minedBlocks.pop();
                            await YeomenAI.setStorageItem('minedBlocks', minedBlocks);

                            // Proceed to the next block
                            jumpBuildIndex++;

                        } catch (err) {
                            console.log(JSON.stringify(err))
                            YeomenAI.statusMessage(`Build error, ${JSON.stringify(err)}`);
                            //throw err;
                        }
                    }

                    let currentTime = new Date();
                    let delayCooldown = 5 * 60;
                    // Add 5 minutes to the current time (5 minutes * 60 seconds * 1000 milliseconds)
                    let futureTime = new Date(currentTime.getTime() + delayCooldown * 1000);

                    // Format the future time in HH:mm:ss
                    let formattedFutureTime = futureTime.toLocaleTimeString('en-US', { hour12: false });

                    // Now use this formatted time in your status message
                    YeomenAI.statusMessage(`Waiting on cooldown until: ${formattedFutureTime}`);
                    await YeomenAI.delay(delayCooldown);
                }




                //Check stamina

                async function checkStamina(playerEntityId) {
                    let staminaRecord = await BiomesYeomen.getStaminaRecord(playerEntityId);
                    let staminaPercentage = (staminaRecord.stamina / MAX_PLAYER_STAMINA) * 100;

                    YeomenAI.statusMessage('Stamina Percentage:', staminaPercentage.toFixed(2) + '%');

                    // Check if stamina is less than or equal to 10
                    if (staminaPercentage <= PERCENTAGE_LOW_STAMINA) {
                        YeomenAI.statusMessage('Stamina is very low! Taking action...');

                        // Do your action here, e.g., notify the player or stop movement
                        await performLowStaminaAction();

                        // Wait until staminaPercentage exceeds 50
                        await waitForStaminaToRecover(playerEntityId);

                        // Move player back to position
                        await movePlayerPostionBack(playerEntityId);
                    }
                }

                // Action to perform when stamina is low
                async function performLowStaminaAction() {
                    YeomenAI.statusMessage('Finding path for water source');
                    //Move to nearest water source   
                    let waterPositionCoord = { x: parseInt(waterCoord.x), y: parseInt(waterCoord.y), z: parseInt(waterCoord.z) }
                    let waterPath = await BiomesYeomen.generatePath(currentPositionCoord, waterPositionCoord);
                    console.log(waterPath)
                    if (!waterPath || waterPath.length == 0) {
                        YeomenAI.statusMessage('Water source path not found', YeomenAI.MESSAGE_TYPES.ERROR);
                        YeomenAI.exit(1);
                        return;
                    }

                    try {
                        await YeomenAI.estimateContractGas('move', [waterPath], MoveSystemId);
                        try {
                            YeomenAI.statusMessage(`Start moving to water source`);
                            await YeomenAI.sendTransaction('move', [waterPath], MoveSystemId);
                            YeomenAI.statusMessage(`Successfully moved to water source`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to move to water source: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }

                // Polling function to wait until stamina exceeds 50%
                async function waitForStaminaToRecover(playerEntityId) {
                    let staminaRecord;
                    let staminaPercentage;

                    // Poll every second to check if staminaPercentage exceeds 50
                    do {
                        staminaRecord = await BiomesYeomen.getStaminaRecord(playerEntityId);
                        staminaPercentage = (staminaRecord.stamina / MAX_PLAYER_STAMINA) * 100;
                        YeomenAI.statusMessage('Waiting for stamina to recover... Current:', staminaPercentage.toFixed(2) + '%');

                        if (staminaPercentage >= PERCENTAGE_RECOVER_STAMINA) {
                            YeomenAI.statusMessage(`Stamina has recovered above ${PERCENTAGE_RECOVER_STAMINA}%`);
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000)); // Wait for 1 minute before checking again
                        }
                    } while (staminaPercentage <= 50);
                }

                async function movePlayerPostionBack() {
                    YeomenAI.statusMessage('Move player position back');
                    let waterPositionCoord = { x: parseInt(waterCoord.x), y: parseInt(waterCoord.y), z: parseInt(waterCoord.z) }
                    //Move player back 
                    let playerPath = await BiomesYeomen.generatePath(waterPositionCoord, currentPositionCoord);
                    console.log(playerPath)
                    if (!playerPath || playerPath.length == 0) {
                        YeomenAI.statusMessage('Player path not found', YeomenAI.MESSAGE_TYPES.ERROR);
                        YeomenAI.exit(0);
                        return;
                    }

                    try {
                        await YeomenAI.estimateContractGas('move', [playerPath], MoveSystemId);
                        try {
                            YeomenAI.statusMessage(`Start moving back to player position`);
                            await YeomenAI.sendTransaction('move', [playerPath], MoveSystemId);
                            YeomenAI.statusMessage(`Successfully moved back to user position`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            await BiomesYeomen.syncPlayer(playerAddress);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to move back to user position: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }

                await checkStamina(playerEntityId);

                await movePlayerToNewPostion();

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

            async function mineBlock(x, y, z) {
                try {
                    await YeomenAI.estimateContractGas('mine', [{ "x": x, "y": y, "z": z }], MineSystemId);
                    try {
                        YeomenAI.statusMessage(`Start mining block at depth ${y}`);
                        await YeomenAI.sendTransaction('mine', [{ "x": x, "y": y, "z": z }], MineSystemId);
                        YeomenAI.statusMessage(`Successfully dug towards target at depth ${y}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
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
                    throw err
                }
            }

            async function jumpBuildBlock(objectId) {
                //Build
                try {
                    await YeomenAI.estimateContractGas('jumpBuild', [objectId], BuildSystemId);
                    try {
                        YeomenAI.statusMessage(`Returning to the surface with jumpBuild`);
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
                    throw err
                }
            }


            YeomenAI.statusMessage('Completed one round of iteration.');
            await YeomenAI.delay(10);

        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   