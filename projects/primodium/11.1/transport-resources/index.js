const resourcePickupAsteroid = formFields['pickupAsteroidEntity'];
const resourceDropoffAsteroid = formFields['dropoffAsteroidEntity'];

const fleetEntity = formFields['fleetEntity'];

const asteroidEntities = [resourcePickupAsteroid, resourceDropoffAsteroid];

const FleetMoveSystemId = PrimodiumYeomen.SYSTEMS.FleetSendSystem;
const FleetTransferSystemId = PrimodiumYeomen.SYSTEMS.TransferSystem;

 //Load resources   
let maxResources = {
    [PrimodiumYeomen.RESOURCES.IRON.ID]: 20000,
    [PrimodiumYeomen.RESOURCES.COPPER.ID]: 20000,
    [PrimodiumYeomen.RESOURCES.LITHIUM.ID]: 20000,
    [PrimodiumYeomen.RESOURCES.IRON_PLATE.ID]: 20000,
    [PrimodiumYeomen.RESOURCES.ALLOY.ID]: 20000,
    [PrimodiumYeomen.RESOURCES.PV_CELL.ID]: 20000
};

let fleetMovement;
let sourceAsteroidEntity;
let destinationAsteroidEntity;

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');

            if (resourcePickupAsteroid == resourceDropoffAsteroid) {
                YeomenAI.statusMessage(`Pickup and Dropoff Asteroids should be different`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            //Get Fleet's Current Position and details
            //const fleetMovement = await PrimodiumYeomen.getFleetMovement(fleetEntity);
            fleetMovement = await PrimodiumYeomen.getFleetMovementRecord(fleetEntity);
            if (!fleetMovement) {
                YeomenAI.statusMessage(`No fleet found with entity ${fleetEntity}`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }


            sourceAsteroidEntity = fleetMovement.destination.replace(/\\x/g, '0x');
            destinationAsteroidEntity = asteroidEntities.find((asteroidEntity) => asteroidEntity !== sourceAsteroidEntity);

            //wait for fleet to reach origin and start orbiting   
            YeomenAI.statusMessage(`Check for fleet orbiting asteroid`);
            await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, sourceAsteroidEntity);


            if (resourcePickupAsteroid === sourceAsteroidEntity) {
                const loadResources = await PrimodiumYeomen.getAsteroidToFleetLoadResources(resourcePickupAsteroid, fleetEntity, maxResources);
                console.log('loadResources', loadResources);
                try {
                    YeomenAI.statusMessage('Transfering resources from Asteroid To Fleet');
                    await YeomenAI.sendTransaction('transferResourcesFromAsteroidToFleet', [sourceAsteroidEntity, fleetEntity, loadResources], FleetTransferSystemId);
                    YeomenAI.statusMessage(`Successfully transferred resources from Asteroid To Fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to transfer resources from Asteroid To Fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            if (resourceDropoffAsteroid === sourceAsteroidEntity) {
                const unloadResources = await PrimodiumYeomen.getFleetToAsteroidUnloadResources(fleetEntity, resourceDropoffAsteroid, maxResources, []);
                console.log('unloadResources', unloadResources);
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
                continue;
            }

            //wait for fleet to reach destination and start orbiting   
            YeomenAI.statusMessage(`Waiting for fleet to reach ${resourceDropoffAsteroid === destinationAsteroidEntity ? 'dropoff asteroid' : 'pickup asteroid'}`);
            await PrimodiumYeomen.waitForFleetToReachTarget(fleetEntity, destinationAsteroidEntity);


            fleetMovement = await PrimodiumYeomen.getFleetMovementRecord(fleetEntity);
            destinationAsteroidEntity = fleetMovement.destination.replace(/\\x/g, '0x');
            sourceAsteroidEntity = asteroidEntities.find((asteroidEntity) => asteroidEntity !== destinationAsteroidEntity);


            if (resourceDropoffAsteroid === destinationAsteroidEntity) {
                const unloadResources = await PrimodiumYeomen.getFleetToAsteroidUnloadResources(fleetEntity, resourceDropoffAsteroid, maxResources, []);
                console.log('unloadResources', unloadResources);
                try {
                    YeomenAI.statusMessage('Transfering resources from Fleet TO Asteroid');
                    await YeomenAI.sendTransaction('transferResourcesFromFleetToAsteroid', [fleetEntity, destinationAsteroidEntity, unloadResources], FleetTransferSystemId);
                    YeomenAI.statusMessage(`Successfully transfered resources from Fleet TO Asteroid`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to transfer resources from Fleet TO Asteroid: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            if (resourcePickupAsteroid === destinationAsteroidEntity) {
                const loadResources = await PrimodiumYeomen.getAsteroidToFleetLoadResources(resourcePickupAsteroid, fleetEntity, maxResources);
                console.log('loadResources', loadResources);
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
                continue;
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