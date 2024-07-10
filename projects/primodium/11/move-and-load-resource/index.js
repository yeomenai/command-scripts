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
                YeomenAI.statusMessage('No fleet found with entity ' + fleetEntity);
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
                YeomenAI.statusMessage('Transfering resources from Asteroid To Fleet');
                await YeomenAI.sendTransaction('transferResourcesFromAsteroidToFleet', [sourceAsteroidEntity, fleetEntity, loadResources], FleetTransferSystemId);
            }

            if (resourceDropoffAsteroid === sourceAsteroidEntity) {
                YeomenAI.statusMessage('Transfering resources from Fleet TO Asteroid');
                await YeomenAI.sendTransaction('transferResourcesFromFleetToAsteroid', [fleetEntity, sourceAsteroidEntity, unloadResources], FleetTransferSystemId);
            }


            YeomenAI.statusMessage(`Moving fleet to ${resourceDropoffAsteroid === destinationAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await YeomenAI.sendTransaction('sendFleet', [fleetEntity, destinationAsteroidEntity], FleetMoveSystemId);

            //wait for fleet to reach destination and start orbiting   
            YeomenAI.statusMessage(`Waiting for fleet to reach ${resourceDropoffAsteroid === destinationAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, destinationAsteroidEntity);


            if (resourceDropoffAsteroid === destinationAsteroidEntity) {
                YeomenAI.statusMessage('Transfering resources from Fleet TO Asteroid');
                await YeomenAI.sendTransaction('transferResourcesFromFleetToAsteroid', [fleetEntity, destinationAsteroidEntity, unloadResources], FleetTransferSystemId);
            }

            if (resourcePickupAsteroid === destinationAsteroidEntity) {
                YeomenAI.statusMessage('Transfering resources from Asteroid To Fleet');
                await YeomenAI.sendTransaction('transferResourcesFromAsteroidToFleet', [destinationAsteroidEntity, fleetEntity, loadResources], FleetTransferSystemId);
            }

            YeomenAI.statusMessage(`Moving fleet back to ${resourceDropoffAsteroid === sourceAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await YeomenAI.sendTransaction('sendFleet', [fleetEntity, sourceAsteroidEntity], FleetMoveSystemId);

            //wait for fleet to reach origin and start orbiting   
            YeomenAI.statusMessage(`Waiting for fleet to reach ${resourceDropoffAsteroid === sourceAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, sourceAsteroidEntity);

            //await YeomenAI.telegramAlert('Fleet movement triggered');
            YeomenAI.exit(0);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed');
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   