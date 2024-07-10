const attackAsteroidEntity = formFields['attackAsteroidEntity'];
const baseOwnerAddress = formFields['baseOwnerAddress'];

const FleetMoveSystemId = PrimodiumYeomen.SYSTEMS.FleetSendSystem;
const FleetCombatSystemId = PrimodiumYeomen.SYSTEMS.CombatSystem;

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');

            const ownerEntity =  WorkerUtils.addressToEntity(baseOwnerAddress);

            const ownedAsteroids = await PrimodiumYeomen.getOwnedEntities(ownerEntity);

           
            const fleetEntities = [];
            for(const ownedAsteroid of ownedAsteroids){
                const asteroidEntity = ownedAsteroid.entity.replace(/\\x/g, '0x');
                const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(asteroidEntity);
                // console.log(asteroidOwnedEntities)
                 for(const asteroidOwnedEntityRecord of asteroidOwnedEntities){
                    const asteroidOwnedEntity = asteroidOwnedEntityRecord.entity.replace(/\\x/g, '0x');

                    const isFleetRecord = await PrimodiumYeomen.getIsFleet(asteroidOwnedEntity);
                    if(isFleetRecord && isFleetRecord.value == true){
                        fleetEntities.push(asteroidOwnedEntity)
                    }
                  //  console.log(isFleetRecord)
                 }
            }
           
            console.log('fleets',fleetEntities)

            const moveAndAttack = async (fleetEntity, attackAsteroidEntity) => {
                try {
                    YeomenAI.statusMessage(`Moving fleet ${fleetEntity} to asteroid ${attackAsteroidEntity} for attack`);
                    await YeomenAI.sendTransaction('sendFleet', [fleetEntity, attackAsteroidEntity], FleetMoveSystemId);

                    YeomenAI.statusMessage('Waiting for fleet cooldown');
                    await PrimodiumYeomen.waitForFleetCooldownEnd(fleetEntity);

                    YeomenAI.statusMessage('Start attacking asteroid');
                    await YeomenAI.sendTransaction('attack', [fleetEntity, attackAsteroidEntity], FleetCombatSystemId);

                    YeomenAI.statusMessage(`Fleet ${fleetEntity} successfully moved and attacked asteroid ${attackAsteroidEntity}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    return Promise.resolve();   
                    // return Promise.resolve(`Fleet ${fleetEntity} successfully moved and attacked asteroid ${attackAsteroidEntity}`);
                } catch (err) {
                    //return Promise.reject(err);
                     YeomenAI.statusMessage(`Fleet ${fleetEntity} failed move and attack asteroid ${attackAsteroidEntity}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    return Promise.resolve();   
                }
            };

            const executeParallelMoveAndAttack = async (fleetEntities, attackAsteroidEntity) => {
                try {
                    YeomenAI.statusMessage('Parallel fleet operations started');
                    
                    const promises = fleetEntities.map(fleetEntity => moveAndAttack(fleetEntity, attackAsteroidEntity));
                    
                    await Promise.all(promises);
                    
                    YeomenAI.statusMessage('All fleet operations completed');
                    //YeomenAI.exit(0);
                } catch (err) {
                    console.error(err);
                    YeomenAI.statusMessage('Parallel fleet operations failed');
                    //YeomenAI.exit(1);
                }
            };

            await executeParallelMoveAndAttack(fleetEntities, attackAsteroidEntity);

            YeomenAI.statusMessage('Running code script completed', YeomenAI.MESSAGE_TYPES.SUCCESS);
            //YeomenAI.exit(0);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();   