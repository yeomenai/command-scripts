importScripts(`${self.location.origin}/projects/biomes/1/services.js`);


const MoveSystemId = BiomesYeomen.SYSTEMS.MoveSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;
const ChipSystemId = BiomesYeomen.SYSTEMS.ChipSystemId;

const TIME_BEFORE_DECREASE_BATTERY_LEVEL = 1 * 60;

const powerChipThreshold = parseInt(formFields['powerChipThreshold']);

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            //YeomenAI.ACCOUNT.delegator = '0xa32ec0cc74fbdd0a7c2b7b654ca6b886000e2b65';
            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;
            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = await getPlayerCurrentPosition();

            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }


            await loginPlayer();


            const experienceChipAttachments = await BiomesYeomen.getExperienceChipAttachments(playerAddress);
            console.log(experienceChipAttachments)
            //Temp code start
            if (experienceChipAttachments.length == 0) {
                const experienceChipAttachmentRecord = await BiomesYeomen.getExperienceChipAttachmentRecord('0x00000000000000000000000000000000000000000000000000000000001382e8');
                experienceChipAttachmentRecord.entity_id = experienceChipAttachmentRecord.entityId;
                experienceChipAttachments.push(experienceChipAttachmentRecord);
            }
            console.log(experienceChipAttachments)
            //Temp code end


            for (let experienceChipAttachment of experienceChipAttachments) {
                const forcefieldEntityId = experienceChipAttachment.entity_id.replace(/\\x/g, '0x');
                const objectTypeRecord = await BiomesYeomen.getObjectTypeRecord(forcefieldEntityId);
                if (objectTypeRecord.objectTypeId != BiomesYeomen.ObjectTypes.FORCE_FIELD)
                    continue;

                const forceFieldEntityPositionRecord = await BiomesYeomen.getPositionRecord(forcefieldEntityId);
                const forceFieldEntityMetadataRecord = await BiomesYeomen.getExperienceFFMetadataRecord(forcefieldEntityId);
                const chipRecord = await BiomesYeomen.getChipRecord(forcefieldEntityId);

                const chipBatteryInventoryCountRecord = await BiomesYeomen.getInventoryCountRecord(playerEntityId, ethers.utils.hexZeroPad(BiomesYeomen.ObjectTypes.CHIP_BATTERY, 32));

                let blockNumber = await YeomenAI.getBlockNumber();
                let block = await YeomenAI.getBlock(blockNumber);

                if (chipRecord.batteryLevel > 0) {
                    // Calculate how much time has passed since last update
                    const timeSinceLastUpdate = block.timestamp - chipRecord.lastUpdatedTime;
                    if (timeSinceLastUpdate <= TIME_BEFORE_DECREASE_BATTERY_LEVEL) {
                        //Nothing to do
                    } else {

                        let newBatteryLevel = chipRecord.batteryLevel > timeSinceLastUpdate
                            ? chipRecord.batteryLevel - timeSinceLastUpdate
                            : 0;
                        chipRecord.batteryLevel = newBatteryLevel;
                    }
                }

                //check if powerup not required, greater than x seconds
                if (chipRecord.batteryLevel > powerChipThreshold) {
                    continue;
                }


                if (chipBatteryInventoryCountRecord.count == 0) {
                    YeomenAI.statusMessage(`Chip Battery not available to powerup`, YeomenAI.MESSAGE_TYPES.ERROR);
                    YeomenAI.exit(1);
                }



                YeomenAI.statusMessage(`Generating path for moving player to Force field`);
                const path = await BiomesYeomen.generatePath(currentPositionCoord, forceFieldEntityPositionRecord);
                if (!path || path.length == 0) {
                    YeomenAI.statusMessage(`Path not found`);
                    continue;
                }
                console.log(path)

                console.log(experienceChipAttachment, forceFieldEntityPositionRecord, objectTypeRecord, forceFieldEntityMetadataRecord, chipRecord, chipBatteryInventoryCountRecord);

                await move(path);

                await powerChip(forcefieldEntityId, 1);
            }



            async function getPlayerCurrentPosition() {
                let currentPositionCoord = null;
                const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
                console.log('positionRecord', positionRecord);
                if (positionRecord && (positionRecord.x !== 0 || positionRecord.y !== 0 || positionRecord.z !== 0)) {
                    currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
                }

                const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
                console.log('lastKnownPositionRecord', lastKnownPositionRecord);
                if (lastKnownPositionRecord && (lastKnownPositionRecord.x !== 0 || lastKnownPositionRecord.y !== 0 || lastKnownPositionRecord.z !== 0)) {
                    currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
                }

                return currentPositionCoord;
            }


            async function loginPlayer() {
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
            }

            async function powerChip(entityId, numBattery) {
                try {

                    await YeomenAI.estimateContractGas('powerChip', [entityId, numBattery], ChipSystemId);
                    try {
                        YeomenAI.statusMessage(`Start powerChip`);
                        await YeomenAI.sendTransaction('powerChip', [entityId, numBattery], ChipSystemId);
                        YeomenAI.statusMessage(`Successfully powerChip`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to powerChip: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to powerChip: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    throw err;
                }
            }


            async function move(path) {

                try {
                    await YeomenAI.estimateContractGas('move', [path], MoveSystemId);
                    try {
                        YeomenAI.statusMessage(`Start moving`);
                        await YeomenAI.sendTransaction('move', [path], MoveSystemId);
                        YeomenAI.statusMessage(`Successfully moved`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        await BiomesYeomen.syncPlayer(playerAddress);
                        await YeomenAI.delay(2);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to move: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    console.log(err)
                    throw err;
                }
            }


            let delaySeconds = 30 * 60;
            YeomenAI.statusMessage(`Completed one round of iteration. waiting for ${delaySeconds} seconds`);
            await YeomenAI.delay(delaySeconds);

        } catch (err) {
            console.log(err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();
