const asteroidEntity = formFields['asteroidEntity'];
const trainUnits = formFields['trainUnits'];
const delay = formFields['delay'];

const UpgradeBuildingSystemId = PrimodiumYeomen.SYSTEMS.UpgradeBuildingS;
const TrainUnitsSystemId = PrimodiumYeomen.SYSTEMS.TrainUnitsSystem;

const buildingTypes = ['DroneFactory', 'Workshop', 'Hangar'];
const units = ['AegisDrone', 'AnvilDrone', 'StingerDrone', 'HammerDrone', 'MinutemanMarine', 'TridentMarine', 'LightningCraft', 'ColonyShip', 'Droid'];
const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(asteroidEntity);
            console.log(asteroidOwnedEntities)

            let mainBaseEntity;
            //Find out total building types
            let totalBuildingTypes = {};
            for (const asteroidOwnedEntity of asteroidOwnedEntities) {
                const buildingEntity = asteroidOwnedEntity.entity.replace(/\\x/g, '0x');
                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buildingEntity);
                if (!buildingTypeRecord) {
                    continue;
                }
                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                const buildingTypeHex = buildingTypeRecord.value;
                if (buildingType == 'MainBase') {
                    mainBaseEntity = buildingEntity;
                }

                totalBuildingTypes[buildingType] = (totalBuildingTypes[buildingType] || 0) + 1;
            }

            //Upgrade and train            
            for (const asteroidOwnedEntity of asteroidOwnedEntities) {
                const buildingEntity = asteroidOwnedEntity.entity.replace(/\\x/g, '0x');
                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buildingEntity);
                if (!buildingTypeRecord) {
                    continue;
                }
                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                const buildingTypeHex = buildingTypeRecord.value;
                if (buildingType == 'MainBase') {
                    mainBaseEntity = buildingEntity;
                }
                if (!buildingTypes.includes(buildingType))
                    continue;

                const buildingLevelRecord = await PrimodiumYeomen.getLevel(buildingEntity);
                const buildingLevel = buildingLevelRecord.value;

                const buildingMaxLevelRecord = await PrimodiumYeomen.getMaxLevel(buildingTypeHex);
                const buildingMaxLevel = buildingMaxLevelRecord.value;

                //Train units
                if (['DroneFactory', 'Workshop'].includes(buildingType)) {
                    let buildingUnits = [];
                    if (buildingType == 'DroneFactory')
                        buildingUnits = ['AegisDrone', 'AnvilDrone', 'HammerDrone', 'StingerDrone'];
                    if (buildingType == 'Workshop')
                        buildingUnits = ['MinutemanMarine', 'TridentMarine'];

                    const trainUnitsSelected = buildingUnits.filter(unit => trainUnits.includes(unit));

                    for (const trainUnit of trainUnitsSelected) {
                        const unitEntity = WorkerUtils.utf8ToEntity(trainUnit);
                        const unitRef = units.indexOf(trainUnit) + 1;

//                    const requiredBaseLevelRecord = await PrimodiumYeomen.getRequiredBaseLevel(unitEntity, buildingLevel);
//                    const requiredBaseLevel = requiredBaseLevelRecord.value;
//
//                    const mainBaseLevelRecord = await PrimodiumYeomen.getLevel(mainBaseEntity);
//                    const mainBaseLevel = mainBaseLevelRecord.value;
//                    if (mainBaseLevel < requiredBaseLevel) {
//                        YeomenAI.logMessage(`MainBase Level ${requiredBaseLevel} required for train ${trainUnit}`);
//                        continue;
//                    }

                        const requiredUnitResourceRecord = await PrimodiumYeomen.getRequiredResource(unitEntity, buildingLevel);
                        console.log(requiredUnitResourceRecord)

                        const requiredUnitResources = requiredUnitResourceRecord.resources.map((resource, index) => ({
                                resource: resource,
                                amount: requiredUnitResourceRecord.amounts[index]
                            }));

//                    const asteroidResourcesCount = await PrimodiumYeomen.getResourcesCount(asteroidEntity);
//                    console.log(asteroidResourcesCount)
//
//                    const availableResources = asteroidResourcesCount.map((asteroidResource, index) => ({
//                            resource: asteroidResource.resource,
//                            amount: asteroidResource.value
//                        }));
                        const availableResources = await PrimodiumYeomen.getAvailableResources(asteroidEntity);

                        const trainUnitsPerResource = requiredUnitResources.map(requiredUnitResource => {
                            const availableResource = availableResources.find(availableResource => availableResource.resource === requiredUnitResource.resource);
                            if (!availableResource) {
                                return 0; // No available resource, cannot create any units
                            }
                            return Math.floor(availableResource.amount / requiredUnitResource.amount);
                        });

                        const maxTrainUnits = Math.min(...trainUnitsPerResource);
//                        const trainUnitsCount = maxTrainUnits && totalBuildingTypes[buildingType]
//                                ? Math.floor(maxTrainUnits / totalBuildingTypes[buildingType])
//                                : 0;
                        const trainUnitsCount = maxTrainUnits && totalBuildingTypes[buildingType]
                                ? (maxTrainUnits >= totalBuildingTypes[buildingType]
                                        ? Math.floor(maxTrainUnits / totalBuildingTypes[buildingType])
                                        : maxTrainUnits)
                                : 0;

                        if (trainUnitsCount) {
                            console.log(buildingType, buildingLevel, trainUnit, trainUnitsCount, 'ready to train')
                            try {
                                YeomenAI.statusMessage(`Train Units ${trainUnitsCount} ${trainUnit} in Level ${buildingLevel}`);
                                await YeomenAI.sendTransaction('trainUnits', [buildingEntity, unitRef, trainUnitsCount], TrainUnitsSystemId);
                                YeomenAI.statusMessage(`Successfully trained units ${trainUnitsCount} ${trainUnit} in Level ${buildingLevel}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            } catch (err) {
                                YeomenAI.statusMessage(`Failed to train units ${trainUnitsCount} ${trainUnit} in Level ${buildingLevel}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                            }
                        }

                        console.log(trainUnit, requiredUnitResources)
                    }

                }

                //Upgrade building
                if (buildingLevel < buildingMaxLevel) {
                    YeomenAI.statusMessage(`Checking requirements for upgrading ${buildingType}`);
                    const requiredLevel = parseInt(buildingLevel) + 1;

                    if (buildingType != 'MainBase') {
                        const requiredBaseLevelRecord = await PrimodiumYeomen.getRequiredBaseLevel(buildingTypeHex, requiredLevel);
                        const requiredBaseLevel = requiredBaseLevelRecord.value;

                        const mainBaseLevelRecord = await PrimodiumYeomen.getLevel(mainBaseEntity);
                        const mainBaseLevel = mainBaseLevelRecord.value;
                        if (mainBaseLevel < requiredBaseLevel) {
                            YeomenAI.logMessage(`MainBase Level ${requiredBaseLevel} required for upgrading ${buildingType}`);
                            continue;
                        }
                    }

                    const requiredResourceRecord = await PrimodiumYeomen.getRequiredResource(buildingTypeHex, requiredLevel);
                    console.log(requiredResourceRecord)

                    const requiredResources = requiredResourceRecord.resources.map((resource, index) => ({
                            resource: resource,
                            amount: requiredResourceRecord.amounts[index]
                        }));

//                const asteroidResourcesCount = await PrimodiumYeomen.getResourcesCount(asteroidEntity);
//                console.log(asteroidResourcesCount)
//
//                const availableResources = asteroidResourcesCount.map((asteroidResource, index) => ({
//                        resource: asteroidResource.resource,
//                        amount: asteroidResource.value
//                    }));

                    const availableResources = await PrimodiumYeomen.getAvailableResources(asteroidEntity);

                    const areResourcesSufficient = requiredResources.every(requiredResource => {
                        const availableResource = availableResources.find(availableResource => availableResource.resource === requiredResource.resource);
                        return availableResource && availableResource.amount >= requiredResource.amount;
                    });

                    if (areResourcesSufficient) {
                        console.log(buildingType, buildingLevel, requiredLevel, 'ready to upgrade')
                        try {
                            YeomenAI.statusMessage(`Upgrade Building ${buildingType} from Level ${buildingLevel} to Level ${requiredLevel}`);
                            await YeomenAI.sendTransaction('upgradeBuilding', [buildingEntity], UpgradeBuildingSystemId);
                            YeomenAI.statusMessage(`Successfully upgraded ${buildingType} to level ${requiredLevel}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to upgrade ${buildingType} to level ${requiredLevel}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    }
                }

                await YeomenAI.delay(delay);
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
