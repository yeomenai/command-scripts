const claim = formFields['claim'];
const delay = formFields['delay'];
const ClaimObjectiveSystemId = PrimodiumYeomen.SYSTEMS.ClaimObjectiveSy;
const ClaimPrimodiumSystemId = PrimodiumYeomen.SYSTEMS.ClaimPrimodiumSy;
const ClaimSystemId = PrimodiumYeomen.SYSTEMS.S_ClaimSystem;

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            if (!YeomenAI.ACCOUNT) {
                YeomenAI.statusMessage('Please reload command');
                YeomenAI.exit(0);
            }

            const ownerAddress = (YeomenAI.ACCOUNT.delegator ? YeomenAI.ACCOUNT.delegator : YeomenAI.ACCOUNT.address).toLowerCase();
            const ownerEntity = WorkerUtils.addressToEntity(ownerAddress);

            const ownedAsteroidEntities = await PrimodiumYeomen.getOwnedEntities(ownerEntity);

            for (const ownedAsteroidEntity of ownedAsteroidEntities) {
                const asteroidEntity = ownedAsteroidEntity.entity.replace(/\\x/g, '0x');
                //Claim Primodium
                if (claim.includes('Primodium')) {
                    YeomenAI.statusMessage(`Check if Claim Primodium is available`);
                    const asteroid = await PrimodiumYeomen.getAsteroid(asteroidEntity);
                    if (asteroid && asteroid.primodium > 0) {
                        try {
                            await YeomenAI.estimateContractGas('claimPrimodium', [asteroidEntity], ClaimPrimodiumSystemId);
                            try {
                                YeomenAI.statusMessage(`Claim Primodium`);
                                await YeomenAI.sendTransaction('claimPrimodium', [asteroidEntity], ClaimPrimodiumSystemId, `Claim Primodium`);
                                YeomenAI.statusMessage(`Successfully Claimed Primodium`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            } catch (err) {
                                YeomenAI.statusMessage(`Failed to Claim Primodium: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                            }
                            await YeomenAI.delay(delay);
                        } catch (err) {
                        }
                    }
                }


                //Claim objectives
                if (claim.includes('Objectives')) {
                    YeomenAI.statusMessage(`Check if Claim Objectives are available`);
                    const enumToPrototypes = await PrimodiumYeomen.getEnumToPrototypes();
                    for (const enumToPrototype of enumToPrototypes) {
                        const enumToPrototypeKeyText = WorkerUtils.hexToUtf8(enumToPrototype.key);
                        const enumToPrototypeValueText = WorkerUtils.hexToUtf8(enumToPrototype.value);
                        if (enumToPrototypeKeyText != 'Objectives')
                            continue;

                        try {
                            await YeomenAI.estimateContractGas('claimObjective', [asteroidEntity, enumToPrototype.id], ClaimObjectiveSystemId);
                            try {
                                YeomenAI.statusMessage(`Claim Objective ${enumToPrototypeValueText}`);
                                await YeomenAI.sendTransaction('claimObjective', [asteroidEntity, enumToPrototype.id], ClaimObjectiveSystemId, `Claim Objective ${enumToPrototypeValueText}`);
                                YeomenAI.statusMessage(`Successfully Claimed Objective ${enumToPrototypeValueText}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            } catch (err) {
                                YeomenAI.statusMessage(`Failed to Claim Objective: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                            }
                        } catch (err) {
                        }
                    }
                }



                //Claim Resources
                if (claim.includes('Resources')) {
                    try {
                        await YeomenAI.estimateContractGas('claimResources', [asteroidEntity], ClaimSystemId);
                        try {
                            YeomenAI.statusMessage(`Claim Resources`);
                            await YeomenAI.sendTransaction('claimResources', [asteroidEntity], ClaimSystemId, `Claim Resources`);
                            YeomenAI.statusMessage(`Successfully Claimed Resources`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to Claim Resources: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                        await YeomenAI.delay(delay);
                    } catch (err) {
                    }
                }

                //Claim Units
                if (claim.includes('Units')) {
                    try {
                        await YeomenAI.estimateContractGas('claimUnits', [asteroidEntity], ClaimSystemId);
                        try {
                            YeomenAI.statusMessage(`Claim Units`);
                            await YeomenAI.sendTransaction('claimUnits', [asteroidEntity], ClaimSystemId, `Claim Units`);
                            YeomenAI.statusMessage(`Successfully Claimed Units`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to Claim Units: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }

                        await YeomenAI.delay(delay);
                    } catch (err) {
                    }
                }

                //Claim ShardAsteroidPoints
                if (claim.includes('ShardAsteroidPoints')) {
                    YeomenAI.statusMessage(`Check if ShardAsteroidPoints for claim`);
                    const shardAsteroid = await PrimodiumYeomen.getShardAsteroid(asteroidEntity);
                    if (shardAsteroid && shardAsteroid.is_shard_asteroid) {
                        try {
                            await YeomenAI.estimateContractGas('claimShardAsteroidPoints', [asteroidEntity], ClaimPrimodiumSystemId);
                            try {
                                YeomenAI.statusMessage(`Claim ShardAsteroidPoints`);
                                await YeomenAI.sendTransaction('claimShardAsteroidPoints', [asteroidEntity], ClaimPrimodiumSystemId, `Claim ShardAsteroidPoints`);
                                YeomenAI.statusMessage(`Successfully Claimed ShardAsteroidPoints`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            } catch (err) {
                                YeomenAI.statusMessage(`Failed to Claim ShardAsteroidPoints: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                            }

                            await YeomenAI.delay(delay);
                        } catch (err) {
                        }
                    }
                }

            }

            YeomenAI.statusMessage('Completed one iteration of the simulation');
            await YeomenAI.delay(delay);

        } catch (err) {
            console.error('Error in simulateGame:', err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }

    } while (true);
};

// Call the simulateGame function
simulateGame();
