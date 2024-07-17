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
                
                //Claim objectives
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
                            await YeomenAI.sendTransaction('claimObjective', [asteroidEntity, enumToPrototype.id], ClaimObjectiveSystemId);
                            YeomenAI.statusMessage(`Successfully Claimed Objective ${enumToPrototypeValueText}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to Claim Objective: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } catch (err) {
                    }
                }



                YeomenAI.statusMessage(`Check if Claim Primodium is available`);
                const asteroid = await PrimodiumYeomen.getAsteroid(asteroidEntity);
                if (asteroid && asteroid.primodium > 0) {
                    //Claim Primodium
                    try {
                        YeomenAI.statusMessage(`Claim Primodium`);
                        await YeomenAI.sendTransaction('claimPrimodium', [asteroidEntity], ClaimPrimodiumSystemId);
                        YeomenAI.statusMessage(`Successfully Claimed Primodium`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to Claim Primodium: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                    await YeomenAI.delay(delay);
                }

                //Claim Resources
                try {
                    YeomenAI.statusMessage(`Claim Resources`);
                    await YeomenAI.sendTransaction('claimResources', [asteroidEntity], ClaimSystemId);
                    YeomenAI.statusMessage(`Successfully Claimed Resources`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to Claim Resources: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }

                await YeomenAI.delay(delay);

                //Claim Units
                try {
                    YeomenAI.statusMessage(`Claim Units`);
                    await YeomenAI.sendTransaction('claimUnits', [asteroidEntity], ClaimSystemId);
                    YeomenAI.statusMessage(`Successfully Claimed Units`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to Claim Units: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }

                await YeomenAI.delay(delay);

                YeomenAI.statusMessage(`Check if ShardAsteroid for claim`);
                const shardAsteroid = await PrimodiumYeomen.getShardAsteroid(asteroidEntity);
                if (shardAsteroid && shardAsteroid.is_shard_asteroid) {
                    //Claim ShardAsteroidPoints
                    try {
                        YeomenAI.statusMessage(`Claim ShardAsteroidPoints`);
                        await YeomenAI.sendTransaction('claimShardAsteroidPoints', [asteroidEntity], ClaimPrimodiumSystemId);
                        YeomenAI.statusMessage(`Successfully Claimed ShardAsteroidPoints`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to Claim ShardAsteroidPoints: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }

                    await YeomenAI.delay(delay);
                }

            }

            YeomenAI.statusMessage('Completed one iteration of the simulation');


        } catch (err) {
            console.error('Error in simulateGame:', err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }

    } while (true);
};

// Call the simulateGame function
simulateGame();
