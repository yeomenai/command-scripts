const asteroidEntity = formFields['asteroidEntity'];
const fleetEntity = formFields['fleetEntity'];
const transferUnits = formFields['transferUnits'];

const FleetCombatSystemId = PrimodiumYeomen.SYSTEMS.CombatSystem;
const FleetMoveSystemId = PrimodiumYeomen.SYSTEMS.FleetSendSystem;
const FleetTransferSystemId = PrimodiumYeomen.SYSTEMS.TransferSystem;

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');


            YeomenAI.statusMessage('Get Fleet owner');
            const fleetOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetEntity);
            const fleetOwner = fleetOwnedBy.value;

            YeomenAI.statusMessage('Get Fleet Asteroid owner');
            const fleetAsteroidOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetOwner);
            const fleetAsteroidOwner = fleetAsteroidOwnedBy.value;

            YeomenAI.statusMessage('Check with Attacking Asteroid owner');
            const asteroidOwnedBy = await PrimodiumYeomen.getOwnedBy(asteroidEntity);
            const asteroidOwner = asteroidOwnedBy ? asteroidOwnedBy.value : null;
            console.log(fleetAsteroidOwner, asteroidOwner)

            if (fleetAsteroidOwner === asteroidOwner) {
                YeomenAI.statusMessage('Attack not allowed for asteroid which belongs to same owner', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            //Get Fleet's Current Position and details
            const fleetMovement = await PrimodiumYeomen.getFleetMovement(fleetEntity);
            if (!fleetMovement) {
                YeomenAI.statusMessage(`No fleet found with entity ${fleetEntity}`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            const destinationAsteroidEntity = fleetMovement.destination.replace(/\\x/g, '0x');

            if (asteroidEntity != destinationAsteroidEntity) {
                //YeomenAI.statusMessage('Fleet not in asteroid to attack', YeomenAI.MESSAGE_TYPES.ERROR);
                //YeomenAI.exit(1);
                //return;

                const fleetOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetEntity);
                const fleetAsteroid = fleetOwnedBy.value.replace(/\\x/g, '0x');

                const fleetAsteroidUnitsCount = await PrimodiumYeomen.getUnitsCount(fleetAsteroid);

                const loadUnits = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (const fleetAsteroidUnitCount of fleetAsteroidUnitsCount) {
                    const unitType = WorkerUtils.hexToUtf8(fleetAsteroidUnitCount.unit);
                    if (!transferUnits.includes(unitType))
                        continue;

                    const unitIndex = PrimodiumYeomen.UNITS[unitType].INDEX;
                    loadUnits[unitIndex] = fleetAsteroidUnitCount.value;
                }
                //console.log(loadUnits)
                
                if (loadUnits.some(value => value > 0)) {
                    try {
                        YeomenAI.statusMessage('Transfering units from Asteroid TO Fleet');
                        await YeomenAI.sendTransaction('transferUnitsFromAsteroidToFleet', [fleetAsteroid, fleetEntity, loadUnits], FleetTransferSystemId);
                        YeomenAI.statusMessage(`Successfully transfered units from Asteroid TO Fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to transfer units from Asteroid TO Fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                }

                try {
                    YeomenAI.statusMessage(`Moving fleet to attacking asteroid`);
                    await YeomenAI.sendTransaction('sendFleet', [fleetEntity, asteroidEntity], FleetMoveSystemId);
                    YeomenAI.statusMessage(`Successfully moved Fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to move Fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    continue;
                }

                //wait for fleet to reach destination and start orbiting   
                YeomenAI.statusMessage(`Waiting for fleet to reach destination asteroid`);
                await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, destinationAsteroidEntity);
            }


            //wait for fleet cooldown ends
            YeomenAI.statusMessage('Waiting for fleet cooldown');
            await PrimodiumYeomen.waitForFleetCooldownEnd(fleetEntity);

            try {
                YeomenAI.statusMessage('Start attacking asteroid');
                await YeomenAI.sendTransaction('attack', [fleetEntity, asteroidEntity], FleetCombatSystemId);
                YeomenAI.statusMessage(`Successfully attacked asteroid`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Failed to attack asteroid: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            }

            //YeomenAI.exit(0);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed');
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   