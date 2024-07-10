const asteroidEntity = formFields['asteroidEntity'];
const delay = formFields['delay'];

const UpgradeBuildingSystemId = PrimodiumYeomen.SYSTEMS.UpgradeBuildingS;
const UpgradeRangeSystemId = PrimodiumYeomen.SYSTEMS.UpgradeRangeSyst;

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            // Get owned entities on the asteroid
            const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(asteroidEntity);

            // Process each owned entity on the asteroid
            for (const asteroidOwnedEntity of asteroidOwnedEntities) {
                const buldingEntity = asteroidOwnedEntity.entity.replace(/\\x/g, '0x');
                // Get building type
                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buldingEntity);
                if (!buildingTypeRecord) {
                    continue;
                }
                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                const buildingTypeHex = buildingTypeRecord.value;

                // Check if building is MainBase
                if (buildingType !== 'MainBase') {
                    continue;
                }

                YeomenAI.statusMessage(`Checking resources and level for ${buildingType}`);

                // Get building level
                const buildingLevelRecord = await PrimodiumYeomen.getLevel(buldingEntity);
                const buildingLevel = buildingLevelRecord.value;

                // Get max level for the building type
                const buildingMaxLevelRecord = await PrimodiumYeomen.getMaxLevel(buildingTypeHex);
                const buildingMaxLevel = buildingMaxLevelRecord.value;

                // Get asteroid resources count
//                const asteroidResourcesCount = await PrimodiumYeomen.getResourcesCount(asteroidEntity);
//                console.log(asteroidResourcesCount);
//
//                const availableResources = asteroidResourcesCount.map((asteroidResource, index) => ({
//                        resource: asteroidResource.resource,
//                        amount: asteroidResource.value
//                    }));

                const availableResources = await PrimodiumYeomen.getAvailableResources(asteroidEntity);

                // Upgrade Base if possible
                if (buildingLevel < buildingMaxLevel) {
                    const requiredLevel = parseInt(buildingLevel) + 1;
                    YeomenAI.statusMessage(`${buildingType} can be upgraded to level ${requiredLevel}`);

                    // Get required resources for upgrade
                    const requiredResourceRecord = await PrimodiumYeomen.getRequiredResource(buildingTypeHex, requiredLevel);
                    console.log(requiredResourceRecord);

                    const requiredResources = requiredResourceRecord.resources.map((resource, index) => ({
                            resource: resource,
                            amount: requiredResourceRecord.amounts[index]
                        }));

                    // Check if resources are sufficient for upgrade
                    const areResourcesSufficient = requiredResources.every(requiredResource => {
                        const availableResource = availableResources.find(availableResource => availableResource.resource === requiredResource.resource);
                        return availableResource && availableResource.amount >= requiredResource.amount;
                    });

                    if (areResourcesSufficient) {
                        YeomenAI.statusMessage(`Upgrade ${buildingType} from Level ${buildingLevel} to Level ${requiredLevel}`);
                        try {
                            await YeomenAI.sendTransaction('upgradeBuilding', [buldingEntity], UpgradeBuildingSystemId);
                            YeomenAI.statusMessage(`Successfully upgraded ${buildingType} to level ${requiredLevel}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to upgrade ${buildingType} to level ${requiredLevel}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } else {
                        YeomenAI.statusMessage(`Not enough resources to upgrade ${buildingType}`, YeomenAI.MESSAGE_TYPES.WARNING);
                    }
                } else {
                    YeomenAI.statusMessage(`${buildingType} has reached max upgrade level ${buildingMaxLevel}`, YeomenAI.MESSAGE_TYPES.INFO);
                }

                // Check if base can be expanded
                YeomenAI.statusMessage(`Checking ${buildingType} expansion requirements`);
                const expansionEntity = '0x457870616e73696f6e0000000000000000000000000000000000000000000000';
                const baseExpansionLevelRecord = await PrimodiumYeomen.getRequiredBaseLevel(expansionEntity, buildingLevel);
                console.log(baseExpansionLevelRecord);
                const baseExpansionRequiredLevel = baseExpansionLevelRecord.value;

                if (buildingLevel == baseExpansionRequiredLevel) {
                    YeomenAI.statusMessage(`Checking ${buildingType} resources for expansion`);
                    const requiredUpgradeRecord = await PrimodiumYeomen.getRequiredUpgrade(expansionEntity, buildingLevel);

                    const requiredExpansionResources = requiredUpgradeRecord.resources.map((resource, index) => ({
                            resource: resource,
                            amount: requiredUpgradeRecord.amounts[index]
                        }));

                    // Check if resources are sufficient for expansion
                    const areExpansionResourcesSufficient = requiredExpansionResources.every(requiredExpansionResource => {
                        const availableResource = availableResources.find(availableResource => availableResource.resource === requiredExpansionResource.resource);
                        return availableResource && availableResource.amount >= requiredExpansionResource.amount;
                    });

                    if (areExpansionResourcesSufficient) {
                        YeomenAI.statusMessage(`Expanding ${buildingType}`);
                        try {
                            await YeomenAI.sendTransaction('upgradeRange', [asteroidEntity], UpgradeRangeSystemId);
                            YeomenAI.statusMessage(`Successfully expanded ${buildingType}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to expand ${buildingType}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } else {
                        YeomenAI.statusMessage(`Not enough resources to expand ${buildingType}`, YeomenAI.MESSAGE_TYPES.INFO);
                    }
                } else {
                    YeomenAI.statusMessage(`${buildingType} not available to expand`, YeomenAI.MESSAGE_TYPES.INFO);
                }
            }


            await YeomenAI.delay(delay);
        } catch (err) {
            console.log(err);
            YeomenAI.statusMessage('Running code script failed');
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();
