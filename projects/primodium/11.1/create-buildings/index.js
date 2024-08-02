const asteroidEntity = formFields['asteroidEntity'];
const delay = formFields['delay'];

const BuildSystemId = PrimodiumYeomen.SYSTEMS.BuildSystem;

const MAX_BUILDINGS = {
    LithiumMine: 5,
    IronMine: 5,
    CopperMine: 5,
//    KimberliteMine: 0,
//    IridiumMine: 0,
//    TitaniumMine: 0,
//    PlatinumMine: 0,
    IronPlateFactory: 2,
    AlloyFactory: 2,
    PVCellFactory: 2,
    SolarPanel: 1,
    Hangar: 2,
    Garage: 1,
    StorageUnit: 2,
    Workshop: 2,
    DroneFactory: 2,
    Starmapper: 2,
    SAM: 1,
    ShieldGenerator: 1,
    Vault: 0,
    Market: 1,
    Shipyard: 1
};

const MainMap = {width: 37, height: 25};
function isPointInsideInnerBoundary(InnerMap, point) {

    // Calculate the center of the main map
    const centerX = Math.floor(MainMap.width / 2);
    const centerY = Math.floor(MainMap.height / 2);

    // Calculate the top-left corner of the inner boundary
    const bottomLeftX = centerX - Math.floor(InnerMap.width / 2);
    const bottomLeftY = centerY - Math.floor(InnerMap.height / 2);

    // Calculate the bottom-right corner of the inner boundary
    const topRightX = bottomLeftX + InnerMap.width - 1;
    const topRightY = bottomLeftY + InnerMap.height - 1;

    // Check if the point is within the inner boundary
    return point.x >= bottomLeftX && point.x <= topRightX && point.y >= bottomLeftY && point.y <= topRightY;
}

function isSpaceFree(buildings, x, y, width, height) {
    for (const building of buildings) {
        const buildingDef = PrimodiumYeomen.BUILDINGS[building.type] ? PrimodiumYeomen.BUILDINGS[building.type].SIZE : {WIDTH: 1, HEIGHT: 1};
        // Calculate the top-left corner of the inner boundary
        const bottomLeftX = building.x - buildingDef.WIDTH + 1;
        const bottomLeftY = building.y - buildingDef.HEIGHT + 1;

        // Calculate the bottom-right corner of the inner boundary
        const topRightX = building.x;
        const topRightY = building.y;


        const startX = x - width + 1;
        const startY = y - height + 1;

        const endX = x;
        const endY = y;

        //console.log(building.type, bottomLeftX, bottomLeftY, topRightX, topRightY, startX, startY, endX, endY)

        for (let currentX = startX; currentX <= endX; currentX++) {
            for (let currentY = startY; currentY <= endY; currentY++) {
                // Check your condition here
                if (currentX >= bottomLeftX && currentX <= topRightX && currentY >= bottomLeftY && currentY <= topRightY) {
                    return false;
                }
            }
        }

    }
    return true;
}

function placeBuilding(InnerMap, allocatedBuildings, reservedBuildings, buildingType) {
    const buildingSize = PrimodiumYeomen.BUILDINGS[buildingType].SIZE;
    const width = buildingSize.WIDTH;
    const height = buildingSize.HEIGHT;

    // Calculate the center of the main map
    const centerX = Math.floor(MainMap.width / 2);
    const centerY = Math.floor(MainMap.height / 2);

    // Calculate the bottom-left corner of the inner boundary
    const startX = centerX - Math.floor(InnerMap.width / 2);
    const startY = centerY - Math.floor(InnerMap.height / 2);

    // Calculate the top-right corner of the inner boundary
    const endX = startX + InnerMap.width - 1;
    const endY = startY + InnerMap.height - 1;

    function* spiral(N, M, startX, startY) {
        let x = startX, y = startY;
        let dx = 0, dy = -1;

        for (let dumb = 0; dumb < N * M; dumb++) {
            if (Math.abs(x - startX) === Math.abs(y - startY) && !(dx === 1 && dy === 0) || (x > startX && y === startY + 1 - (x - startX))) {
                [dx, dy] = [-dy, dx];  // corner, change direction
            }

            if (Math.abs(x - startX) > Math.floor(N / 2) || Math.abs(y - startY) > Math.floor(M / 2)) {
                [dx, dy] = [-dy, dx];  // change direction
                [x, y] = [-y + startY + dx, x - startX + dy + startX];  // jump
            }

            yield {x, y};
            [x, y] = [x + dx, y + dy];
        }
    }

// Example usage:
    const spiralPoints = spiral(InnerMap.width, InnerMap.height, centerX, centerY);
    //let availablePoints = [];
    for (let spiralPoint of spiralPoints) {
        if (!isPointInsideInnerBoundary(InnerMap, spiralPoint))
            continue;
        const buildings = [...allocatedBuildings, ...reservedBuildings];
        if (isSpaceFree(buildings, spiralPoint.x, spiralPoint.y, width, height)) {
            //console.log(spiralPoint);
            //availablePoints.push(spiralPoint)
            return spiralPoint;
        }
    }
    //console.log(availablePoints)
    return null;
}


const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');

            const enumToPrototypes = await PrimodiumYeomen.getEnumToPrototypes();
            //console.log(JSON.stringify(enumToPrototypes))

            const asteroid = await PrimodiumYeomen.getAsteroid(asteroidEntity);
            //console.log(JSON.stringify(asteroid))

            const asteroidLevel = await PrimodiumYeomen.getLevel(asteroidEntity);
            //console.log(JSON.stringify(asteroidLevel))

            const dimensions = await PrimodiumYeomen.getDimensions();
            //console.log(JSON.stringify(dimensions))

            const terrains = await PrimodiumYeomen.getTerrains();
            //console.log(JSON.stringify(terrains))

            const asteroidDimension = dimensions.find((dimension) => dimension.level == asteroidLevel.value);
            //console.log(JSON.stringify(asteroidDimension))

            const asteroidTerrains = terrains.filter((terrain) => terrain.map_id == asteroid.map_id);
            //console.log(JSON.stringify(asteroidTerrains))

            const asteroidBuildingsPositions = await PrimodiumYeomen.getPositions(asteroidEntity);
            //console.log(JSON.stringify(asteroidBuildingsPositions))

            let asteroidBuildingsPositionsTypes = [];
            for (const asteroidBuildingsPosition of asteroidBuildingsPositions) {
                const buildingEntity = asteroidBuildingsPosition.entity;
                const buildingTypeRecord = await PrimodiumYeomen.getBuildingType(buildingEntity);
                if (!buildingTypeRecord) {
                    continue;
                }
                const buildingType = WorkerUtils.hexToUtf8(buildingTypeRecord.value);
                asteroidBuildingsPositionsTypes.push({
                    ...asteroidBuildingsPosition,
                    type: buildingType
                });
            }
            //console.log(JSON.stringify(asteroidBuildingsPositionsTypes))

            const InnerMap = {width: asteroidDimension.width, height: asteroidDimension.height};

            let asteroidDimensionTerrains = [];
            for (const asteroidTerrain of asteroidTerrains) {
                const point = {x: asteroidTerrain.x, y: asteroidTerrain.y};
                if (!isPointInsideInnerBoundary(InnerMap, point))
                    continue;
                asteroidDimensionTerrains.push(asteroidTerrain);
            }
            //console.log(JSON.stringify(asteroidDimensionTerrains))

            let mainBaseEntity;
            for (const enumToPrototype of enumToPrototypes) {
                const enumToPrototypeKeyHex = enumToPrototype.key;
                const enumToPrototypeValueHex = enumToPrototype.value;
                const enumToPrototypeKeyText = WorkerUtils.hexToUtf8(enumToPrototype.key);
                const enumToPrototypeValueText = WorkerUtils.hexToUtf8(enumToPrototype.value);
                if (enumToPrototypeKeyText != 'Building')
                    continue;

                const buildingType = WorkerUtils.hexToUtf8(enumToPrototype.value);
                const buildingTypeHex = enumToPrototype.value;
                const buildingTypeId = PrimodiumYeomen.BUILDINGS[buildingType] ? PrimodiumYeomen.BUILDINGS[buildingType].ID : null;
                if (!buildingTypeId)
                    continue;

                //check if MainBase Building                
                if (buildingType == 'MainBase' || buildingType == 'WormholeBase') {
                    const mainBaseBuilding = asteroidBuildingsPositionsTypes.find((asteroidBuildingsPositionsType) => asteroidBuildingsPositionsType.type == buildingType)
                    if (!mainBaseBuilding)
                        continue;
                    mainBaseEntity = mainBaseBuilding.entity.replace(/\\x/g, '0x');
                }

                //check if building is allowed to build or max reached
                const existingBuildings = asteroidBuildingsPositionsTypes.filter((asteroidBuildingsPositionsType) => asteroidBuildingsPositionsType.type == buildingType)
                if (!MAX_BUILDINGS[buildingType] || existingBuildings.length >= MAX_BUILDINGS[buildingType])
                    continue;


                //Placing Building Mines
                if (['IronMine', 'CopperMine', 'LithiumMine'].includes(buildingType)) {
                    //console.log(JSON.stringify(asteroidBuildingsPositionsTypes))

                    const position = asteroidDimensionTerrains.find(asteroidDimensionTerrain => !asteroidBuildingsPositionsTypes.some(asteroidBuildingsPositionsType => asteroidBuildingsPositionsType.x === asteroidDimensionTerrain.x && asteroidBuildingsPositionsType.y === asteroidDimensionTerrain.y));
                    if (!position)
                        continue;
                    //console.log('Available position to build mine', buildingType, buildingTypeId, position)

                    //for (const asteroidDimensionTerrain of asteroidDimensionTerrains) {
                    try {
                        await YeomenAI.estimateContractGas('build', [buildingTypeId, {x: position.x, y: position.y, parentEntity: asteroidEntity}], BuildSystemId);
                        try {
                            YeomenAI.statusMessage(`Build ${buildingType}`);
                            await YeomenAI.sendTransaction('build', [buildingTypeId, {x: position.x, y: position.y, parentEntity: asteroidEntity}], BuildSystemId);
                            YeomenAI.statusMessage(`Successfully build ${buildingType}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            //Add this to available list temporary
                            asteroidBuildingsPositionsTypes.push({
                                entity: null,
                                x: position.x,
                                y: position.y,
                                parent_entity: asteroidEntity,
                                type: buildingType
                            });
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to build ${buildingType}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } catch (err) {
                    }
                    //}
                } else { //Placing Buildings
                    const requiredBaseLevelRecord = await PrimodiumYeomen.getRequiredBaseLevel(buildingTypeHex, 1);

                    if (!requiredBaseLevelRecord)
                        continue;
                    const requiredBaseLevel = requiredBaseLevelRecord.value;

                    const mainBaseLevelRecord = await PrimodiumYeomen.getLevel(mainBaseEntity);
                    const mainBaseLevel = mainBaseLevelRecord.value;
                    //console.log(mainBaseLevel, ' ', requiredBaseLevel)
                    if (mainBaseLevel < requiredBaseLevel) {
                        YeomenAI.logMessage(`MainBase Level ${requiredBaseLevel} required for creating ${buildingType}`);
                        continue;
                    }

                    console.log(JSON.stringify(asteroidBuildingsPositionsTypes), JSON.stringify(asteroidDimensionTerrains))
                    const position = placeBuilding(InnerMap, asteroidBuildingsPositionsTypes, asteroidDimensionTerrains, buildingType);
                    if (!position)
                        continue;

                    //console.log('Available position to build building', buildingType, buildingTypeId, position)

                    try {
                        await YeomenAI.estimateContractGas('build', [buildingTypeId, {x: position.x, y: position.y, parentEntity: asteroidEntity}], BuildSystemId);
                        try {
                            YeomenAI.statusMessage(`Build ${buildingType}`);
                            await YeomenAI.sendTransaction('build', [buildingTypeId, {x: position.x, y: position.y, parentEntity: asteroidEntity}], BuildSystemId);
                            YeomenAI.statusMessage(`Successfully build ${buildingType}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                            //Add this to available list temporary
                            asteroidBuildingsPositionsTypes.push({
                                entity: null,
                                x: position.x,
                                y: position.y,
                                parent_entity: asteroidEntity,
                                type: buildingType
                            });
                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to build ${buildingType}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } catch (err) {
                    }
                }
            }

            await YeomenAI.delay(delay);

            YeomenAI.statusMessage('Completed one iteration of the simulation');
            //await YeomenAI.telegramAlert('Fleet movement triggered');
            //YeomenAI.exit(0);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   