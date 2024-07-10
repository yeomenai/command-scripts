const asteroidEntity = formFields['asteroidEntity'];
const UpgradeBuildingSystemId = PrimodiumYeomen.SYSTEMS.UpgradeBuildingS;
const UpgradeRangeSystemId = PrimodiumYeomen.SYSTEMS.UpgradeRangeSyst;

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');


            const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(asteroidEntity);
            console.log(asteroidOwnedEntities)

            for (const asteroidOwnedEntity of asteroidOwnedEntities) {
                const buldingEntity = asteroidOwnedEntity.entity.replace(/\\x/g, '0x');
                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buldingEntity);
                if (!buildingTypeRecord)
                    continue;
                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                const buildingTypeHex = buildingTypeRecord.value;

                if (buildingType !== 'MainBase')
                    continue;

                console.log(buildingType)
                YeomenAI.statusMessage(`Checking asteroid resources and level`);

                const buildingLevelRecord = await PrimodiumYeomen.getLevel(buldingEntity);
                const buildingLevel = buildingLevelRecord.value;


                const buildingMaxLevelRecord = await PrimodiumYeomen.getMaxLevel(buildingTypeHex);
                const buildingMaxLevel = buildingMaxLevelRecord.value;

                const asteroidResourcesCount = await PrimodiumYeomen.getResourcesCount(asteroidEntity);
                console.log(asteroidResourcesCount)

                const availableResources = asteroidResourcesCount.map((asteroidResource, index) => ({
                        resource: asteroidResource.resource,
                        amount: asteroidResource.value
                    }));

                //Upgrade Base

                if (buildingLevel < buildingMaxLevel) {
                    const requiredLevel = parseInt(buildingLevel) + 1;

                    YeomenAI.statusMessage(`Asteroid can be upgraded to ${requiredLevel}`);

                    const requiredResourceRecord = await PrimodiumYeomen.getRequiredResource(buildingTypeHex, requiredLevel);
                    console.log(requiredResourceRecord)

                    const requiredResources = requiredResourceRecord.resources.map((resource, index) => ({
                            resource: resource,
                            amount: requiredResourceRecord.amounts[index]
                        }));

                    const areResourcesSufficient = requiredResources.every(requiredResource => {
                        const availableResource = availableResources.find(availableResource => availableResource.resource === requiredResource.resource);
                        return availableResource && availableResource.amount >= requiredResource.amount;
                    });

                    if (areResourcesSufficient) {
                        console.log(buildingType, buildingLevel, requiredLevel, 'ready to upgrade')
                        YeomenAI.statusMessage(`Upgrade Building ${buildingType} from Level ${buildingLevel} to Level ${requiredLevel}`);
                        await YeomenAI.sendTransaction('upgradeBuilding', [buldingEntity], UpgradeBuildingSystemId);
                    } else {
                        YeomenAI.statusMessage(`Not enough resources to upgrade`);
                    }
                } else {
                    YeomenAI.statusMessage(`Asteroid has reached max upgrade level ${buildingMaxLevel}`);
                }


                YeomenAI.statusMessage(`Checking asteroid expansion requirements`);
                //Expansion Base
                const expansionEntity = '0x457870616e73696f6e0000000000000000000000000000000000000000000000';
                const baseExpansionLevelRecord = await PrimodiumYeomen.getRequiredBaseLevel(expansionEntity, buildingLevel);
                console.log(baseExpansionLevelRecord)
                const baseExpansionRequiredLevel = baseExpansionLevelRecord.value;

                if (buildingLevel == baseExpansionRequiredLevel) {
                    YeomenAI.statusMessage(`Checking asteroid resources for expansion`);
                    const requiredUpgradeRecord = await PrimodiumYeomen.getRequiredUpgrade(expansionEntity, buildingLevel);

                    const requiredExpansionResources = requiredUpgradeRecord.resources.map((resource, index) => ({
                            resource: resource,
                            amount: requiredUpgradeRecord.amounts[index]
                        }));

                    const areExpansionResourcesSufficient = requiredExpansionResources.every(requiredExpansionResource => {
                        const availableResource = availableResources.find(availableResource => availableResource.resource === requiredExpansionResource.resource);
                        return availableResource && availableResource.amount >= requiredExpansionResource.amount;
                    });

                    if (areExpansionResourcesSufficient) {
                        console.log(buildingType, buildingLevel, baseExpansionRequiredLevel, 'ready for expansion')
                        YeomenAI.statusMessage(`Expand ${buildingType}`);
                        await YeomenAI.sendTransaction('upgradeRange', [asteroidEntity], UpgradeRangeSystemId);
                    } else {
                        YeomenAI.statusMessage(`Not enough resources to expand`);
                    }

                } else {
                    YeomenAI.statusMessage(`Asteroid not available to expand`);
                }

                //console.log(requiredResources, availableResources)

                //console.log(buildingType, buildingLevel)
            }

           
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed');
            
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   