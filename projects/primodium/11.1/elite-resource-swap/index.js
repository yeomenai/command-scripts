const asteroidEntity = formFields['asteroidEntity'];
const delay = formFields['delay'];

const MarketplaceSystemId = PrimodiumYeomen.SYSTEMS.MarketplaceSyste;

let swapResourcesPercentage = {
    [PrimodiumYeomen.RESOURCES.IRON.ID]: 10,
    [PrimodiumYeomen.RESOURCES.COPPER.ID]: 10
};

let eliteResources = [
    PrimodiumYeomen.RESOURCES.TITANIUM.ID,
    PrimodiumYeomen.RESOURCES.PLATINUM.ID,
    PrimodiumYeomen.RESOURCES.IRIDIUM.ID,
    PrimodiumYeomen.RESOURCES.KIMBERLITE.ID
]

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');

            //gets markets
            const marketEntities = [];
            const asteroidOwnedEntities = await PrimodiumYeomen.getOwnedEntities(asteroidEntity);
            for (const asteroidOwnedEntity of asteroidOwnedEntities) {
                const buldingEntity = asteroidOwnedEntity.entity.replace(/\\x/g, '0x');
                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buldingEntity);
                if (!buildingTypeRecord)
                    continue;

                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                console.log(buildingType)
                if (buildingType != 'Market')
                    continue;

                marketEntities.push(buldingEntity);
            }

            if (marketEntities.length == 0) {
                YeomenAI.statusMessage(`Market not exists to swap`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(0);
            }


            const asteroidResourcesCount = await PrimodiumYeomen.getAvailableResources(asteroidEntity);
            console.log(asteroidResourcesCount)

            for (const asteroidResourceCount of asteroidResourcesCount) {
                const resource = asteroidResourceCount.resource;
                if (!swapResourcesPercentage[resource])
                    continue;

                const swapResourceId = resource;
                const swapResource = Object.keys(PrimodiumYeomen.RESOURCES).find(key => PrimodiumYeomen.RESOURCES[key].ID == swapResourceId);				

                const asteroidMaxResourceCount = await PrimodiumYeomen.getMaxResourceCount(asteroidEntity, resource);
                console.log(asteroidResourceCount, asteroidMaxResourceCount)

                const availableResource = asteroidResourceCount.value;
                const maxResource = asteroidMaxResourceCount.value;
                //check if its reached max else skip
                if (availableResource < maxResource) {
                    YeomenAI.statusMessage(`Swap Resource ${swapResource} not reached capacity`, YeomenAI.MESSAGE_TYPES.WARNING);
                    continue;
                }


                const marketEntity = marketEntities[Math.floor(Math.random() * marketEntities.length)];
                const swapResourcePercentage = swapResourcesPercentage[resource];
                const swapResourceAmount = (availableResource * swapResourcePercentage) / 100;


                const eliteResourceId = eliteResources[Math.floor(Math.random() * eliteResources.length)];
                const eliteResource = Object.keys(PrimodiumYeomen.RESOURCES).find(key => PrimodiumYeomen.RESOURCES[key].ID === eliteResourceId);				

                console.log(swapResource, eliteResource, swapResourceAmount)

                const reserves = await PrimodiumYeomen.getReserves();

                const amountIn = BigInt(swapResourceAmount);
                const resourceIn = swapResourceId;
                const resourceOut = eliteResourceId;

                // Function to find the reserve pair
                const findReserve = (reserves, resourceA, resourceB) => {
                    return reserves.find(reserve => (reserve.resource_a === resourceA && reserve.resource_b === resourceB) ||
                                (reserve.resource_a === resourceB && reserve.resource_b === resourceA));
                };

                // Function to calculate the amount out
                const calculateAmountOut = (reserves, amountIn, resourceIn, resourceOut) => {
                    let amount = amountIn;
                    let currentResource = resourceIn;
                    const path = [resourceIn];

                    while (currentResource !== resourceOut) {
                        let reserve = findReserve(reserves, currentResource, resourceOut);
                        if (!reserve) {
                            reserve = findReserve(reserves, currentResource, 6); // Try to swap with resource 6 as an intermediate step
                            if (!reserve) {
                                throw new Error(`No conversion path found from resource ${currentResource} to ${resourceOut}`);
                            }
                        }

                        const isDirectSwap = reserve.resource_b === resourceOut || reserve.resource_a === resourceOut;
                        const resourceA = isDirectSwap ? currentResource : reserve.resource_a;
                        const resourceB = isDirectSwap ? resourceOut : reserve.resource_b;

                        const amountA = BigInt(reserve.amount_a);
                        const amountB = BigInt(reserve.amount_b);

                        if (resourceA === currentResource) {
                            amount = (amount * amountB) / amountA;
                        } else {
                            amount = (amount * amountA) / amountB;
                        }

                        currentResource = resourceB;
                        path.push(currentResource);
                    }

                    return {amountOut: amount, path};
                };


                const {amountOut, path} = calculateAmountOut(reserves, amountIn, resourceIn, resourceOut);
                try {
                    YeomenAI.statusMessage(`Swap Resource ${swapResource} with ${eliteResource}`);
                    await YeomenAI.sendTransaction('swap', [
                        marketEntity,
                        path,
                        parseInt(amountIn),
                        0
                    ], MarketplaceSystemId);
                    YeomenAI.statusMessage(`Swapped resource ${swapResource} with ${eliteResource}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to swap resource: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }

            }

            await YeomenAI.delay(delay);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   