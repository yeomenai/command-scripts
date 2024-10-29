importScripts(`${self.location.origin}/projects/biomes/1/services.js`);
const MineSystemId = BiomesYeomen.SYSTEMS.MineSystemId;
const MoveSystemId = BiomesYeomen.SYSTEMS.MoveSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;

const endCoord = formFields['endCoord'];

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');


            YeomenAI.statusMessage('Fetching player and position');
            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = null;


            const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
            console.log('positionRecord', positionRecord)
            if (positionRecord && positionRecord.x != 0 && positionRecord.y != 0 && positionRecord.z != 0) {
                currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
            }

            const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
            console.log('lastKnownPositionRecord', lastKnownPositionRecord)
            if (lastKnownPositionRecord && lastKnownPositionRecord.x != 0 && lastKnownPositionRecord.y != 0 && lastKnownPositionRecord.z != 0) {
                currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
            }

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

            //Move to end cord specified        
            YeomenAI.statusMessage('Finding path to move');
            let path = await BiomesYeomen.generatePath(currentPositionCoord, { x: parseInt(endCoord.x), y: parseInt(endCoord.y), z: parseInt(endCoord.z) });
            console.log(path)
            if (!path || path.length == 0) {
                YeomenAI.statusMessage('Move path not found');
                YeomenAI.exit(0);
                return;
            }
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
            }

            YeomenAI.statusMessage('Running code script completed');
            YeomenAI.exit(0);

        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();   