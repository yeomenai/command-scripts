importScripts(`${self.location.origin}/projects/biomes/1/services.js`);

const MineSystemId = BiomesYeomen.SYSTEMS.MineSystemId;
const BuildSystemId = BiomesYeomen.SYSTEMS.BuildSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;

const surfaceCoord = formFields['surfaceCoord'];


const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');
            

            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;
            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            const playerEntityId = playerRecord.entityId;

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


            let currentPositionCoord = await getPlayerCurrentPosition();

            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }


            if (surfaceCoord.y < currentPositionCoord.y) {
                YeomenAI.statusMessage("Surface Y is not higher than current Y. No movement needed.");
                YeomenAI.exit(0);
            }

            await displayStats();

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


            while (currentPositionCoord.y < surfaceCoord.y) {
                console.log(`Current Y level: ${currentPositionCoord.y}`);

                //Mine if up above is block
                try {
                    let mineUpPositionCoord = { "x": currentPositionCoord.x, "y": currentPositionCoord.y + 1, "z": currentPositionCoord.z }
                    await YeomenAI.estimateContractGas('mine', [mineUpPositionCoord], MineSystemId);
                    try {
                        YeomenAI.statusMessage(`Start Mine block up`);
                        await YeomenAI.sendTransaction('mine', [mineUpPositionCoord], MineSystemId);
                        YeomenAI.statusMessage(`Successfully mined`, YeomenAI.MESSAGE_TYPES.SUCCESS);
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
                }

                //Jump build block
                try {
                    let inventoryCount = inventoryCounts.find((inventoryCount) => inventoryCount.count > 0);
                    if (!inventoryCount) {
                        YeomenAI.statusMessage(`Insufficient inventory object to jumpBuild`);
                        YeomenAI.exit(1);
                    }

                    let objectId = inventoryCount.objectTypeId;
                    await YeomenAI.estimateContractGas('jumpBuild', [objectId], BuildSystemId);
                    try {
                        YeomenAI.statusMessage(`Returning to the surface with jumpBuild`);
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
                }


                // Update currentPositionCoord without re-declaring it
                currentPositionCoord = await getPlayerCurrentPosition();
                await displayStats();
            }

            async function displayStats() {
                let markdown = ``;

                // Use a fallback to ensure currentPositionCoord and surfaceCoord are defined
                const targetDepthY = surfaceCoord?.y || 0;
                const currentDepthY = currentPositionCoord?.y || 0;
                const elevationRemaining = Math.abs(targetDepthY - currentDepthY);

                markdown += `\n#### Overall Stats\n`;
                markdown += `|                        |       |       |\n`;
                markdown += `|------------------------|-------|-------|\n`;
                markdown += `| Target depth (y)       |       |   ${targetDepthY}   |\n`;
                markdown += `| Current depth (y)      |       |   ${currentDepthY}   |\n`;
                markdown += `| Elevation remaining    |       |   ${elevationRemaining}   |\n`;

                await YeomenAI.markdown(markdown);
            }


            YeomenAI.statusMessage('Running code script completed', YeomenAI.MESSAGE_TYPES.SUCCESS);
            YeomenAI.exit(0);
        } catch (err) {
            console.log(err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();
