const ownerAddress = formFields['ownerAddress'];
const FleetMoveSystemId = PrimodiumYeomen.SYSTEMS.FleetSendSystem;

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');

        const ownerEntity = WorkerUtils.addressToEntity(ownerAddress);
        const ownedAsteroids = await PrimodiumYeomen.getOwnedEntities(ownerEntity);

        for (const ownedAsteroid of ownedAsteroids) {
            const asteroidEntity = ownedAsteroid.entity.replace(/\\x/g, '0x');
            console.log(asteroidEntity);

            PrimodiumYeomen.getAsteroidBattleResultSubscription(asteroidEntity, async (error, result) => {
                if (error) {
                    console.error('Subscription error:', error);
                    return;
                }
                console.log('Subscription result:', result);
                const timestamp = result && result[0] && result[0].timestamp || null;
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const isLatestAttack = timestamp && (currentTime - timestamp) <= 2 * 60;

                if (isLatestAttack) {
                    try {
                        await sendDefenceFleet(asteroidEntity);
                    } catch (err) {
                        console.error('Error sending defence fleet:', err);
                    }
                }
            });
        }

        const findNearestDefenceFleet = async (asteroidEntity) => {
            try {
                YeomenAI.statusMessage('Finding nearest defence fleet');
                const asteroids = [];
                for (const ownedAsteroid of ownedAsteroids) {
                    const ownedAsteroidEntity = ownedAsteroid.entity.replace(/\\x/g, '0x');
                    const position = await PrimodiumYeomen.getPosition(ownedAsteroidEntity);
                    let asteroid = {entity: ownedAsteroidEntity, position, distance: 0, fleets: [], isTarget: false};

                    if (ownedAsteroidEntity === asteroidEntity) {
                        asteroid.isTarget = true;
                        asteroids.push(asteroid);
                        continue;
                    }

                    const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(ownedAsteroidEntity);
                    for (const asteroidOwnedEntityRecord of asteroidOwnedEntities) {
                        const asteroidOwnedEntity = asteroidOwnedEntityRecord.entity.replace(/\\x/g, '0x');
                        const isFleetRecord = await PrimodiumYeomen.getIsFleet(asteroidOwnedEntity);

                        if (isFleetRecord && isFleetRecord.value === true) {
                            asteroid.fleets.push({entity: asteroidOwnedEntity});
                        }
                    }
                    asteroids.push(asteroid);
                }

                const targetAsteroid = asteroids.find(asteroid => asteroid.isTarget);
                asteroids.forEach(asteroid => {
                    if (!asteroid.isTarget) {
                        const distance = Math.sqrt(Math.pow(asteroid.position.x - targetAsteroid.position.x, 2) + Math.pow(asteroid.position.y - targetAsteroid.position.y, 2));
                        asteroid.distance = distance;
                    }
                });

                asteroids.sort((a, b) => a.distance - b.distance);
                const nearestAsteroid = asteroids.find(asteroid => !asteroid.isTarget && asteroid.fleets.length > 0);
                const nearestDefenceFleet = nearestAsteroid && nearestAsteroid.fleets[0] || null;

                console.log(asteroids);
                return nearestDefenceFleet;
            } catch (err) {
                YeomenAI.statusMessage('Error finding nearest defence fleet', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                console.error('Error finding nearest defence fleet:', err);
                throw err;
            }
        };

        const sendDefenceFleet = async (asteroidEntity) => {
            try {
                console.log('send defence fleet to', asteroidEntity);
                const nearestDefenceFleet = await findNearestDefenceFleet(asteroidEntity);
                console.log(nearestDefenceFleet);

                if (nearestDefenceFleet) {
                    const fleetEntity = nearestDefenceFleet.entity;
                    try {
                        YeomenAI.statusMessage(`Moving fleet ${fleetEntity} to asteroid ${asteroidEntity} for defence`);
                        await YeomenAI.sendTransaction('sendFleet', [fleetEntity, asteroidEntity], FleetMoveSystemId);
                        YeomenAI.statusMessage(`Successfully moved fleet`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to move fleet: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                }
            } catch (err) {
                YeomenAI.statusMessage('Error sending defence fleet', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                console.error('Error sending defence fleet:', err);
                throw err;
            }
        };

    } catch (err) {
        console.error('Error in simulateGame:', err);
        YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
