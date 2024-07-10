const asteroidEntity = formFields['asteroidEntity'];
const delay = formFields['delay'];

const UpgradeBuildingSystemId = PrimodiumYeomen.SYSTEMS.UpgradeBuildingS;

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            if (!asteroidEntity) {
                YeomenAI.statusMessage('Asteroid entity required', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
            }

            if (!delay) {
                YeomenAI.statusMessage('Delay is not set', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
            }

            const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(asteroidEntity);
            //YeomenAI.statusMessage(`Retrieved owned entities: ${asteroidOwnedEntities.length} found`);

            let mainBaseEntity;
            for (const asteroidOwnedEntity of asteroidOwnedEntities) {
                const buldingEntity = asteroidOwnedEntity.entity.replace(/\\x/g, '0x');
                //YeomenAI.statusMessage(`Processing building entity: ${buldingEntity}`);

                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buldingEntity);
                if (!buildingTypeRecord) {
                    continue;
                }
                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                const buildingTypeHex = buildingTypeRecord.value;
                //YeomenAI.statusMessage(`Building type: ${buildingType}`);    
                if (buildingType == 'MainBase') {
                    mainBaseEntity = buldingEntity;
                }

                const buildingLevelRecord = await PrimodiumYeomen.getLevel(buldingEntity);
                const buildingLevel = buildingLevelRecord.value;
                //YeomenAI.statusMessage(`Current building level: ${buildingLevel}`);                


                const buildingMaxLevelRecord = await PrimodiumYeomen.getMaxLevel(buildingTypeHex);
                const buildingMaxLevel = buildingMaxLevelRecord.value;
                //YeomenAI.statusMessage(`Max level for ${buildingType}: ${buildingMaxLevel}`);

                // Upgrade building
                if (buildingLevel < buildingMaxLevel) {
                    YeomenAI.statusMessage(`Checking requirements for upgrading ${buildingType}`);
                    const requiredLevel = parseInt(buildingLevel) + 1;

                    if (buildingType != 'MainBase') {
                        const requiredBaseLevelRecord = await PrimodiumYeomen.getRequiredBaseLevel(buildingTypeHex, requiredLevel);
                        const requiredBaseLevel = requiredBaseLevelRecord.value;
                        
                        const mainBaseLevelRecord = await PrimodiumYeomen.getLevel(mainBaseEntity);
                        const mainBaseLevel = mainBaseLevelRecord.value;
                        if(mainBaseLevel < requiredBaseLevel){
                            YeomenAI.logMessage(`MainBase Level ${requiredBaseLevel} required for upgrading ${buildingType}`);
                            continue;
                        }
                    }

                    const requiredResourceRecord = await PrimodiumYeomen.getRequiredResource(buildingTypeHex, requiredLevel);
                    //YeomenAI.statusMessage(`Required resources for level ${requiredLevel} retrieved`);

                    const requiredResources = requiredResourceRecord.resources.map((resource, index) => ({
                            resource: resource,
                            amount: requiredResourceRecord.amounts[index]
                        }));

//                    const asteroidResourcesCount = await PrimodiumYeomen.getResourcesCount(asteroidEntity);
//                    //YeomenAI.statusMessage(`Asteroid resources count retrieved`);
//
//                    const availableResources = asteroidResourcesCount.map((asteroidResource, index) => ({
//                            resource: asteroidResource.resource,
//                            amount: asteroidResource.value
//                        }));

                    const availableResources = await PrimodiumYeomen.getAvailableResources(asteroidEntity);

                    const areResourcesSufficient = requiredResources.every(requiredResource => {
                        const availableResource = availableResources.find(availableResource => availableResource.resource === requiredResource.resource);
                        return availableResource && availableResource.amount >= requiredResource.amount;
                    });

                    if (areResourcesSufficient) {
                        YeomenAI.statusMessage(`Sufficient resources available for upgrading ${buildingType} to level ${requiredLevel}`);
                        try {
                            await YeomenAI.sendTransaction('upgradeBuilding', [buldingEntity], UpgradeBuildingSystemId);
                            YeomenAI.statusMessage(`Successfully upgraded ${buildingType} to level ${requiredLevel}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to upgrade ${buildingType} to level ${requiredLevel}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } else {
                        YeomenAI.logMessage(`Insufficient resources for upgrading ${buildingType} to level ${requiredLevel}`, YeomenAI.MESSAGE_TYPES.WARNING);
                    }
                } else {
                    YeomenAI.logMessage(`Building ${buildingType} has already reached its max level ${buildingMaxLevel}`, YeomenAI.MESSAGE_TYPES.INFO);
                }

                await YeomenAI.delay(delay);
            }

            YeomenAI.statusMessage('Completed one iteration of the simulation');
        } catch (err) {
            console.log(err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        }


    } while (true);
};

// Call the simulateGame function
simulateGame();
