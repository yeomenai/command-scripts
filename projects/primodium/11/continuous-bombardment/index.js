const asteroidEntity = formFields['asteroidEntity'];
const fleetEntity = formFields['fleetEntity'];

const FleetCombatSystemId = PrimodiumYeomen.SYSTEMS.CombatSystem;

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

            const destinationAsteroidEntity = fleetMovement.destination.replace(/\\x/g, '0x');

            if (asteroidEntity != destinationAsteroidEntity) {
                YeomenAI.statusMessage('Fleet not in asteroid to attack');
                YeomenAI.exit(1);
                return;
            }

            YeomenAI.statusMessage('Get Fleet owner');
            const fleetOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetEntity);
            const fleetOwner = fleetOwnedBy.value;

            YeomenAI.statusMessage('Get Fleet Asteroid owner');
            const fleetAsteroidOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetOwner);
            const fleetAsteroidOwner = fleetAsteroidOwnedBy.value;

            YeomenAI.statusMessage('Check with Attacking Asteroid owner');
            const asteroidOwnedBy = await PrimodiumYeomen.getOwnedBy(asteroidEntity);
            const asteroidOwner = asteroidOwnedBy.value;
            console.log(fleetAsteroidOwner, asteroidOwner)

            if (fleetAsteroidOwner === asteroidOwner) {
                YeomenAI.statusMessage('Attack not allowed for asteroid which belongs to same owner');
                YeomenAI.exit(1);
                return;
            }

            //wait for fleet cooldown ends
            YeomenAI.statusMessage('Waiting for fleet cooldown');
            await PrimodiumYeomen.waitForFleetCooldownEnd(fleetEntity);

            YeomenAI.statusMessage('Start attacking asteroid');
            await YeomenAI.sendTransaction('attack', [fleetEntity, asteroidEntity], FleetCombatSystemId);


            YeomenAI.statusMessage('Running code script success');
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