const resourcePickupAsteroid = formFields['pickupAsteroidEntity'];
const resourceDropoffAsteroid = formFields['dropoffAsteroidEntity'];

const fleetEntity = formFields['fleetEntity'];

const asteroidEntities = [resourcePickupAsteroid, resourceDropoffAsteroid];

const FleetMoveSystemId = PrimodiumYeomen.SYSTEMS.FleetSendSystem;
const FleetTransferSystemId = PrimodiumYeomen.SYSTEMS.TransferSystem;

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');
            //Get Fleet's Current Position and details
            const fleetMovement = await PrimodiumYeomen.getFleetMovement(fleetEntity);
            if (!fleetMovement) {
                YeomenAI.statusMessage(`No fleet found with entity ${fleetEntity}`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            const sourceAsteroidEntity = fleetMovement.destination.replace(/\\x/g, '0x');
            const destinationAsteroidEntity = asteroidEntities.find((asteroidEntity) => asteroidEntity !== sourceAsteroidEntity);

            //Load resources   
            let maxResources = {
                [PrimodiumYeomen.RESOURCES.IRON]: 10,
                [PrimodiumYeomen.RESOURCES.COPPER]: 20,
                [PrimodiumYeomen.RESOURCES.LITHIUM]: 6
            };
            const loadResources = await PrimodiumYeomen.getAsteroidToFleetLoadResources(resourcePickupAsteroid, fleetEntity, maxResources);
            console.log('loadResources', loadResources);
            const unloadResources = await PrimodiumYeomen.getFleetToAsteroidUnloadResources(fleetEntity, resourceDropoffAsteroid, maxResources, loadResources);
            console.log('unloadResources', unloadResources);

            if (resourcePickupAsteroid === sourceAsteroidEntity) {
                try {
                    YeomenAI.statusMessage('Transfering resources from Asteroid To Fleet');
                    await YeomenAI.sendTransaction('transferResourcesFromAsteroidToFleet', [sourceAsteroidEntity, fleetEntity, loadResources], FleetTransferSystemId);
                    YeomenAI.statusMessage(`Successfully transferred resources from Asteroid To Fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to transfer resources from Asteroid To Fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            if (resourceDropoffAsteroid === sourceAsteroidEntity) {
                try {
                    YeomenAI.statusMessage('Transfering resources from Fleet TO Asteroid');
                    await YeomenAI.sendTransaction('transferResourcesFromFleetToAsteroid', [fleetEntity, sourceAsteroidEntity, unloadResources], FleetTransferSystemId);
                    YeomenAI.statusMessage(`Successfully transferred resources from Fleet TO Asteroid`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to transfer resources from Fleet TO Asteroid: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }


            try {
                YeomenAI.statusMessage(`Moving fleet to ${resourceDropoffAsteroid === destinationAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
                await YeomenAI.sendTransaction('sendFleet', [fleetEntity, destinationAsteroidEntity], FleetMoveSystemId);
                YeomenAI.statusMessage(`Successfully moved Fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Failed to move Fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            }

            //wait for fleet to reach destination and start orbiting   
            YeomenAI.statusMessage(`Waiting for fleet to reach ${resourceDropoffAsteroid === destinationAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, destinationAsteroidEntity);


            if (resourceDropoffAsteroid === destinationAsteroidEntity) {
                try {
                    YeomenAI.statusMessage('Transfering resources from Fleet TO Asteroid');
                    await YeomenAI.sendTransaction('transferResourcesFromFleetToAsteroid', [fleetEntity, destinationAsteroidEntity, unloadResources], FleetTransferSystemId);
                    YeomenAI.statusMessage(`Successfully transfered resources from Fleet TO Asteroid`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to transfer resources from Fleet TO Asteroid: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            if (resourcePickupAsteroid === destinationAsteroidEntity) {
                try {
                    YeomenAI.statusMessage('Transfering resources from Asteroid To Fleet');
                    await YeomenAI.sendTransaction('transferResourcesFromAsteroidToFleet', [destinationAsteroidEntity, fleetEntity, loadResources], FleetTransferSystemId);
                    YeomenAI.statusMessage(`Successfully transfered resources from Asteroid To Fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to transfer resources from Asteroid To Fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            try {
                YeomenAI.statusMessage(`Moving fleet back to ${resourceDropoffAsteroid === sourceAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
                await YeomenAI.sendTransaction('sendFleet', [fleetEntity, sourceAsteroidEntity], FleetMoveSystemId);
                YeomenAI.statusMessage(`Successfully moved fleet `, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Failed to move fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            }

            //wait for fleet to reach origin and start orbiting   
            YeomenAI.statusMessage(`Waiting for fleet to reach ${resourceDropoffAsteroid === sourceAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, sourceAsteroidEntity);

            YeomenAI.statusMessage('Completed one iteration of the simulation');
            //await YeomenAI.telegramAlert('Fleet movement triggered');
            //YeomenAI.exit(0);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   