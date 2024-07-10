const PrimodiumYeomen = {
    SCHEMA: 'ai_0xcdde8dc29bcb7a7b30e22318746dfd81f0510b43__',
    SYSTEMS: {
        AbandonAsteroidS: "0x73795072695f313100000000000000004162616e646f6e41737465726f696453",
        AccessManagement: "0x737900000000000000000000000000004163636573734d616e6167656d656e74",
        AllianceSystem: "0x73795072695f31310000000000000000416c6c69616e636553797374656d0000",
        BalanceTransfer: "0x7379000000000000000000000000000042616c616e63655472616e7366657200",
        BatchCall: "0x73790000000000000000000000000000426174636843616c6c00000000000000",
        BuildSystem: "0x73795072695f313100000000000000004275696c6453797374656d0000000000",
        ClaimObjectiveSy: "0x73795072695f31310000000000000000436c61696d4f626a6563746976655379",
        ClaimPrimodiumSy: "0x73795072695f31310000000000000000436c61696d5072696d6f6469756d5379",
        ClaimWormholeSys: "0x73795072695f31310000000000000000436c61696d576f726d686f6c65537973",
        ColonySystem: "0x73795072695f31310000000000000000436f6c6f6e7953797374656d00000000",
        CombatSystem: "0x73795072695f31310000000000000000436f6d62617453797374656d00000000",
        Delegation: "0x7379000000000000000000000000000044656c65676174696f6e000000000000",
        DestroySystem: "0x73795072695f3131000000000000000044657374726f7953797374656d000000",
        FleetClearSystem: "0x73795072695f31310000000000000000466c656574436c65617253797374656d",
        FleetCreateSyste: "0x73795072695f31310000000000000000466c6565744372656174655379737465",
        FleetLandSystem: "0x73795072695f31310000000000000000466c6565744c616e6453797374656d00",
        FleetMergeSystem: "0x73795072695f31310000000000000000466c6565744d6572676553797374656d",
        FleetRecallSyste: "0x73795072695f31310000000000000000466c656574526563616c6c5379737465",
        FleetSendSystem: "0x73795072695f31310000000000000000466c65657453656e6453797374656d00",
        FleetStanceSyste: "0x73795072695f31310000000000000000466c6565745374616e63655379737465",
        IncrementSystem: "0x73795072695f31310000000000000000496e6372656d656e7453797374656d00",
        MarketplaceSyste: "0x73795072695f313100000000000000004d61726b6574706c6163655379737465",
        MoveBuildingSyst: "0x73795072695f313100000000000000004d6f76654275696c64696e6753797374",
        PrimodiumSystem: "0x73795072695f313100000000000000005072696d6f6469756d53797374656d00",
        Registration: "0x73790000000000000000000000000000526567697374726174696f6e00000000",
        S_BattleApplyDam: "0x73795072695f31310000000000000000535f426174746c654170706c7944616d",
        S_BattleEncrypti: "0x73795072695f31310000000000000000535f426174746c65456e637279707469",
        S_BattleRaidReso: "0x73795072695f31310000000000000000535f426174746c65526169645265736f",
        S_BuildRaidableA: "0x73795072695f31310000000000000000535f4275696c645261696461626c6541",
        S_ClaimSystem: "0x73795072695f31310000000000000000535f436c61696d53797374656d000000",
        S_CreateSecondar: "0x73795072695f31310000000000000000535f4372656174655365636f6e646172",
        S_FleetClearSyst: "0x73795072695f31310000000000000000535f466c656574436c65617253797374",
        S_InitAsteroidOw: "0x73795072695f31310000000000000000535f496e697441737465726f69644f77",
        S_ProductionRate: "0x73795072695f31310000000000000000535f50726f64756374696f6e52617465",
        S_RewardsSystem: "0x73795072695f31310000000000000000535f5265776172647353797374656d00",
        S_SpendResources: "0x73795072695f31310000000000000000535f5370656e645265736f7572636573",
        S_StorageSystem: "0x73795072695f31310000000000000000535f53746f7261676553797374656d00",
        S_TransferAstero: "0x73795072695f31310000000000000000535f5472616e7366657241737465726f",
        SpawnSystem: "0x73795072695f31310000000000000000537061776e53797374656d0000000000",
        ToggleBuildingSy: "0x73795072695f31310000000000000000546f67676c654275696c64696e675379",
        TrainUnitsSystem: "0x73795072695f31310000000000000000547261696e556e69747353797374656d",
        TransferSystem: "0x73795072695f313100000000000000005472616e7366657253797374656d0000",
        TransferTwoWaySy: "0x73795072695f313100000000000000005472616e7366657254776f5761795379",
        UpgradeBuildingS: "0x73795072695f31310000000000000000557067726164654275696c64696e6753",
        UpgradeRangeSyst: "0x73795072695f313100000000000000005570677261646552616e676553797374",
        UpgradeUnitSyste: "0x73795072695f3131000000000000000055706772616465556e69745379737465",
        callbound: "0x7379000000000000000000000000000063616c6c626f756e6400000000000000",
        stembound: "0x7379000000000000000000000000000073797374656d626f756e640000000000",
        timebound: "0x7379000000000000000000000000000074696d65626f756e6400000000000000"
    },
    RESOURCES: {
        IRON: 1,
        COPPER: 2,
        LITHIUM: 3,
        TITANIUM: 4,
        IRIDIUM: 5,
        KIMBERLITE: 6,
        PLATINUM: 7,
        IRON_PLATE: 8,
        ALLOY: 9,
        PV_CELL: 10
    },
    /**
     * Asynchronous function to get units data.
     * @returns {Promise<Array>} Units data.
     */
    getUnits: async function () {
        const unitsData = await YeomenAI.getQueryData(`
        query GetUnits {
          ${this.SCHEMA}pri_11__p_unit {
            entity
            level
            cargo
          }
        }
        `);
        const units = unitsData[`${this.SCHEMA}pri_11__p_unit`] || [];
        return units;
    },
    /**
     * Asynchronous function to get resources count.
     * @param {string} entity Entity ID.
     * @returns {Promise<Array>} Resources count.
     */
    getResourcesCount: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const resourcesCountData = await YeomenAI.getQueryData(`
        query GetResourcesCount {
          ${this.SCHEMA}pri_11__resource_count(where: {entity: {_eq: "${entity}"}}) {
            entity
            resource
            value
          }
        }
        `);
        const resourcesCount = resourcesCountData[`${this.SCHEMA}pri_11__resource_count`] || [];
        return resourcesCount;
    },
    /**
     * Asynchronous function to get owned by data.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} Owned by data.
     */
    getOwnedBy: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const ownedByData = await YeomenAI.getQueryData(`
        query GetOwnedBy {
          ${this.SCHEMA}pri_11__owned_by(where: {entity: {_eq: "${entity}"}}) {
            entity           
            value
          }
        }
        `);
        const ownedBy = ownedByData[`${this.SCHEMA}pri_11__owned_by`][0] || null;
        return ownedBy;
    },
    /**
     * Asynchronous function to get units count.
     * @param {string} entity Entity ID.
     * @returns {Promise<Array>} Units count.
     */
    getUnitsCount: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const unitsCountData = await YeomenAI.getQueryData(`
        query GetUnitsCount {
          ${this.SCHEMA}pri_11__unit_count(where: {entity: {_eq: "${entity}"}}) {
            entity
            unit
            value
          }
        }
        `);
        const unitsCount = unitsCountData[`${this.SCHEMA}pri_11__unit_count`] || [];
        return unitsCount;
    },
    /**
     * Asynchronous function to get unit level.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} Unit level data.
     */
    getUnitLevel: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const unitLevelData = await YeomenAI.getQueryData(`
                query GetUnitLevel {
                  ${this.SCHEMA}pri_11__unit_level(where: {entity: {_eq: "${entity}"}}) {
                    entity
                    unit
                    value
                  }
                }
                `);
        const unitLevel = unitLevelData[`${this.SCHEMA}pri_11__unit_level`][0] || null;

        return unitLevel;
    },
    /**
     * Asynchronous function to get fleet movement.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} Fleet movement data.
     */
    getFleetMovement: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const fleetMovementData = await YeomenAI.getQueryData(`
        query GetFleetMovement {
          ${this.SCHEMA}pri_11__fleet_movement(where: {entity: {_eq: "${entity}"}}) {
            arrival_time
            destination
            entity
            origin
            send_time
          }
        }`);
        const fleetMovement = fleetMovementData[`${this.SCHEMA}pri_11__fleet_movement`][0] || null;
        return fleetMovement;
    },
    /**
     * Asynchronous function to wait for fleet to reach target.
     * @param {string} fleetEntity Fleet entity ID.
     * @param {string} targetEntity Target entity ID.
     * @returns {Promise<string>} Resolves when fleet reaches the target.
     */
    waitForFleetToReachTarget: async function (fleetEntity, targetEntity) {
        await new Promise((resolve, reject) => {
            const checkFleetReachedTarget = async() => {

                const fleetMovement = await this.getFleetMovement(fleetEntity);
                //console.log('waitForFleetToReachTarget', fleetMovement, fleetEntity, targetEntity)
                if (fleetMovement && fleetMovement.destination.replace(/\\x/g, '0x') === targetEntity && parseInt((new Date().getTime() / 1000).toFixed(0)) > parseInt(fleetMovement.arrival_time) + 10) {
                    resolve("Fleet reached");
                } else if (fleetMovement && fleetMovement.destination.replace(/\\x/g, '0x') === targetEntity) {
                    setTimeout(checkFleetReachedTarget, ((parseInt(fleetMovement.arrival_time) + 10) - parseInt((new Date().getTime() / 1000).toFixed(0))) * 1000);//Check only after x period
                } else {
                    setTimeout(checkFleetReachedTarget, 1000); // Check again after 1000 milliseconds
                }
            };
            checkFleetReachedTarget();
        });
    },
    /**
     * Asynchronous function to get fleet cargo capacity.
     * @param {string} fleetEntity Fleet entity ID.
     * @returns {Promise<number>} Fleet cargo capacity.
     */
    getFleetCargoCapacity: async function (fleetEntity) {
        const units = await this.getUnits();
        //console.log(units);

        const fleetOwnedBy = await this.getOwnedBy(fleetEntity);
        const fleetOwner = fleetOwnedBy.value;
        //console.log(fleetOwnedBy);

        const fleetUnitsCount = await this.getUnitsCount(fleetEntity);
        //console.log(fleetUnitsCount);

        const fleetResourcesCount = await this.getResourcesCount(fleetEntity);
        //console.log(fleetResourcesCount);

        let fleetCargoCapacity = 0;
        for (const fleetUnitCount of fleetUnitsCount) {
            if (fleetUnitCount.value > 0) {
                const fleetUnitLevel = await this.getUnitLevel(fleetOwner);
                const level = fleetUnitLevel ? fleetUnitLevel.value : 0;
                const unit = units.find((unit) => unit.entity === fleetUnitCount.unit && unit.level === level);
                fleetCargoCapacity += fleetUnitCount.value * (unit.cargo);
            }
        }

        return fleetCargoCapacity;
    },
    /**
     * Asynchronous function to get asteroid to fleet load resources.
     * @param {string} asteroidEntity Asteroid entity ID.
     * @param {string} fleetEntity Fleet entity ID.
     * @param {Object} maxResources Maximum resources.
     * @returns {Promise<Array>} Loaded resources.
     */
    getAsteroidToFleetLoadResources: async function (asteroidEntity, fleetEntity, maxResources) {
        const fleetCargoCapacity = await this.getFleetCargoCapacity(fleetEntity);
        //console.log(fleetCargoCapacity);

        let availableFleetCargoCapacity = fleetCargoCapacity;

        const pickupAsteroidResourcesCount = await this.getResourcesCount(asteroidEntity);
        //console.log(pickupAsteroidResourcesCount);

        const fleetResourcesCount = await this.getResourcesCount(fleetEntity);
        //console.log(fleetResourcesCount);

        //Calculate allocation proportion
        let totalMaxResources = Object.values(maxResources).reduce((sum, value) => sum + value, 0);
        let maxResourcesAllocation = {};

        for (let resource in maxResources) {
            let proportion = maxResources[resource] / totalMaxResources;
            maxResourcesAllocation[resource] = Math.floor(proportion * (fleetCargoCapacity / Math.pow(10, 18)));
        }


        let loadResources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const pickupAsteroidResourceCount of pickupAsteroidResourcesCount) {
            const resourceId = pickupAsteroidResourceCount.resource;
            if (!maxResources[resourceId])
                continue;
            const fleetResourceCount = fleetResourcesCount.find((fleetResourceCount) => fleetResourceCount.resource === resourceId);
//            //Reduce current available fleet resource
//            availableFleetCargoCapacity -= fleetResourceCount ? fleetResourceCount.value : 0;
//
//            const loadResource = Math.max(maxResources[resourceId] * Math.pow(10, 18) - (fleetResourceCount ? fleetResourceCount.value : 0), 0);
//
//            loadResources[resourceId - 1]
//                    = Math.min(pickupAsteroidResourceCount.value, loadResource, availableFleetCargoCapacity);
//
//            //Reduce to load fleet resource
//            availableFleetCargoCapacity -= loadResources[resourceId - 1];
//
//            console.log('availableFleetCargoCapacity', availableFleetCargoCapacity)

            const loadResource = Math.max(maxResourcesAllocation[resourceId] * Math.pow(10, 18) - (fleetResourceCount ? fleetResourceCount.value : 0), 0);

            loadResources[resourceId - 1] = Math.min(pickupAsteroidResourceCount.value, loadResource);

        }
        //console.log('fleetCargoCapacity', fleetCargoCapacity / Math.pow(10, 18));
//        console.log('pickupAsteroidResourcesCount', pickupAsteroidResourcesCount.map(pickupAsteroidResourceCount => {
//            return {
//                resource: pickupAsteroidResourceCount.resource,
//                value: pickupAsteroidResourceCount.value / Math.pow(10, 18)
//            };
//        }));
//        console.log('fleetResourcesCount', fleetResourcesCount.map(fleetResourceCount => {
//            return {
//                resource: fleetResourceCount.resource,
//                value: fleetResourceCount.value / Math.pow(10, 18)
//            };
//        }));
        //console.log('maxResources', maxResources);
        //console.log('maxResourcesAllocation', maxResourcesAllocation);
        //console.log('loadResources', loadResources.map((loadResource) => Math.max(loadResource / Math.pow(10, 18), 0)));
        return loadResources;
    },
    /**
     * Asynchronous function to get fleet to asteroid unload resources.
     * @param {string} fleetEntity Fleet entity ID.
     * @param {string} asteroidEntity Asteroid entity ID.
     * @param {Object} maxResources Maximum resources.
     * @param {Array} loadResources Loaded resources.
     * @returns {Promise<Array>} Unloaded resources.
     */
    getFleetToAsteroidUnloadResources: async function (fleetEntity, asteroidEntity, maxResources, loadResources) {
        const fleetResourcesCount = await this.getResourcesCount(fleetEntity);
        //console.log(fleetResourcesCount);

        let unloadResources = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const key of Object.keys(maxResources)) {
            const resourceId = parseInt(key);
            //if (!loadResources[resourceId])
            //    continue;
            const fleetResourceCount = fleetResourcesCount.find((fleetResourceCount) => fleetResourceCount.resource === resourceId);

            //if (!fleetResourceCount)
            //    continue;
            //const loadResource = loadResources[resourceId - 1];

            const unloadResource = Math.min(loadResources[resourceId - 1] + (fleetResourceCount ? fleetResourceCount.value : 0), maxResources[resourceId] * Math.pow(10, 18));
            unloadResources[resourceId - 1] = unloadResource;
        }

        return unloadResources;
    },
    /**
     * Asynchronous function to get cooldown end.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} Fleet cooldown data.
     */
    getCooldownEnd: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const cooldownEndData = await YeomenAI.getQueryData(`
        query GetCooldownEnd {
          ${this.SCHEMA}pri_11__cooldown_end(where: {entity: {_eq: "${entity}"}}) {            
            entity
            value
          }
        }`);
        const cooldownEnd = cooldownEndData[`${this.SCHEMA}pri_11__cooldown_end`][0] || null;
        return cooldownEnd;
    },
    /**
     * Asynchronous function to wait for fleet cooldown.
     * @param {string} fleetEntity Fleet entity ID.    
     * @returns {Promise<string>} Resolves when fleet cooldown ends.
     */
    waitForFleetCooldownEnd: async function (fleetEntity) {
        await new Promise((resolve, reject) => {
            const checkFleetCooldownEnd = async() => {

                const cooldownEnd = await this.getCooldownEnd(fleetEntity);
                //console.log(cooldownEnd)
                if (cooldownEnd && parseInt((new Date().getTime() / 1000).toFixed(0)) > parseInt(cooldownEnd.value) + 10) {
                    resolve("Fleet cooldown");
                } else if (cooldownEnd) {
                    setTimeout(checkFleetCooldownEnd, ((parseInt(cooldownEnd.value) + 10) - parseInt((new Date().getTime() / 1000).toFixed(0))) * 1000);//Check only after x period
                } else {
                    setTimeout(checkFleetCooldownEnd, 1000); // Check again after 1000 milliseconds
                }
            };
            checkFleetCooldownEnd();
        });
    },
    /**
     * Asynchronous function to getowned entities.
     * @param {string} entity Entity ID.
     * @returns {Promise<Array>} Building Types.
     */
    getOwnedEntities: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const ownedEntitiesData = await YeomenAI.getQueryData(`
        query GetOwnedEntities {
          ${this.SCHEMA}pri_11__owned_by(where: {value: {_eq: "${entity}"}}) {           
                entity
                value
            
          }
        }
        `);

        const ownedEntities = ownedEntitiesData[`${this.SCHEMA}pri_11__owned_by`] || [];
        return ownedEntities;
    },
    /**
     * Asynchronous function to get building type.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} Building Type data.
     */
    getBuildingType: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const buildingTypeData = await YeomenAI.getQueryData(`
                query GetBuildingType {
                  ${this.SCHEMA}pri_11__building_type(where: {entity: {_eq: "${entity}"}}) {
                    entity                   
                    value
                  }
                }
                `);
        const buildingType = buildingTypeData[`${this.SCHEMA}pri_11__building_type`][0] || null;

        return buildingType;
    },
    /**
     * Asynchronous function to get max level.
     * @param {string} prototype .
     * @returns {Promise<Object|null>} max level data.
     */
    getMaxLevel: async function (prototype) {
        prototype = prototype.replace(/(0x|\\x)/g, '\\\\x');
        const maxLevelData = await YeomenAI.getQueryData(`
                query GetMaxLevel {
                  ${this.SCHEMA}pri_11__p_max_level(where: {prototype: {_eq: "${prototype}"}}) {
                    prototype                    
                    value
                  }
                }
                `);
        const maxLevel = maxLevelData[`${this.SCHEMA}pri_11__p_max_level`][0] || null;

        return maxLevel;
    },
    /**
     * Asynchronous function to get level.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} level data.
     */
    getLevel: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const levelData = await YeomenAI.getQueryData(`
                query GetLevel {
                  ${this.SCHEMA}pri_11__level(where: {entity: {_eq: "${entity}"}}) {
                    entity                    
                    value
                  }
                }
                `);
        const level = levelData[`${this.SCHEMA}pri_11__level`][0] || null;

        return level;
    },
    /**
     * Asynchronous function to get required resource.
     * @param {string} prototype .
     * @param {int} Level .
     * @returns {Promise<Object|null>} required resource data.
     */
    getRequiredResource: async function (prototype, level) {
        prototype = prototype.replace(/(0x|\\x)/g, '\\\\x');
        const requiredResourceData = await YeomenAI.getQueryData(`
                query GetRequiredResource {
                  ${this.SCHEMA}pri_11__p_required_resour(where: {prototype: {_eq: "${prototype}"}, level: {_lte: "${level}"}}, order_by: {level: desc}) {
                    prototype                    
                    level,
                    resources,
                    amounts
                  }
                }
                `);
        const requiredResource = requiredResourceData[`${this.SCHEMA}pri_11__p_required_resour`][0] || null;

        return requiredResource;
    },
    /**
     * Asynchronous function to get required base level.
     * @param {string} prototype .
     * @param {int} Level .
     * @returns {Promise<Object|null>} required base level data.
     */
    getRequiredBaseLevel: async function (prototype, level) {
        prototype = prototype.replace(/(0x|\\x)/g, '\\\\x');
        const requiredBaseLevelData = await YeomenAI.getQueryData(`
                query GetRequiredBaseLevel {
                  ${this.SCHEMA}pri_11__p_required_base_le(where: {prototype: {_eq: "${prototype}"}, level: {_lte: "${level}"}}, order_by: {level: desc}) {
                    prototype                    
                    level,
                    value
                  }
                }
                `);
        const requiredBaseLevel = requiredBaseLevelData[`${this.SCHEMA}pri_11__p_required_base_le`][0] || null;

        return requiredBaseLevel;
    },
    /**
     * Asynchronous function to get required upgrade.
     * @param {string} prototype .
     * @param {int} Level .
     * @returns {Promise<Object|null>} required ugrade data.
     */
    getRequiredUpgrade: async function (prototype, level) {
        prototype = prototype.replace(/(0x|\\x)/g, '\\\\x');
        const requiredUpgradeData = await YeomenAI.getQueryData(`
                query GetRequiredUpgrade {
                  ${this.SCHEMA}pri_11__p_required_upgrad(where: {prototype: {_eq: "${prototype}"}, level: {_eq: "${level}"}}) {
                    prototype                    
                    level,
                    resources,
                    amounts
                  }
                }
                `);
        const requiredUpgrade = requiredUpgradeData[`${this.SCHEMA}pri_11__p_required_upgrad`][0] || null;

        return requiredUpgrade;
    },
    /**
     * Asynchronous function to get is fleet.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} is fleet data.
     */
    getIsFleet: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const isFleetData = await YeomenAI.getQueryData(`
                query GetIsFleet {
                  ${this.SCHEMA}pri_11__is_fleet(where: {entity: {_eq: "${entity}"}}) {
                    entity                    
                    value
                  }
                }
                `);
        const isFleet = isFleetData[`${this.SCHEMA}pri_11__is_fleet`][0] || null;

        return isFleet;
    },
    /**
     * Asynchronous function to get position data.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} position data.
     */
    getPosition: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const positionData = await YeomenAI.getQueryData(`
        query GetPosition {
          ${this.SCHEMA}pri_11__position(where: {entity: {_eq: "${entity}"}}) {
            entity           
            x
            y
            parent_entity
          }
        }
        `);
        const position = positionData[`${this.SCHEMA}pri_11__position`][0] || null;
        return position;
    },
    /**
     * Asynchronous function to get max resources count.
     * @param {string} prototype .
     * @param {int} Entity .    
     * @returns {Promise<Object|null>} max resources data.
     */
    getMaxResourcesCount: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const maxResourcesCountData = await YeomenAI.getQueryData(`
                query GetMaxResourceCount {
                  ${this.SCHEMA}pri_11__max_resource_count(where: {entity: {_eq: "${entity}"}}) {
                    entity                    
                    resource,
                    value
                  }
                }
                `);
        const maxResourcesCount = maxResourcesCountData[`${this.SCHEMA}pri_11__max_resource_count`] || [];
        return maxResourcesCount;
    },
    /**
     * Asynchronous function to get max resource count.
     * @param {string} prototype .
     * @param {int} Entity .
     * @param {int} Resource .
     * @returns {Promise<Object|null>} required resource data.
     */
    getMaxResourceCount: async function (entity, resource) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const maxResourceCountData = await YeomenAI.getQueryData(`
                query GetMaxResourceCount {
                  ${this.SCHEMA}pri_11__max_resource_count(where: {entity: {_eq: "${entity}"}, resource: {_eq: "${resource}"}}) {
                    entity                    
                    resource,
                    value
                  }
                }
                `);
        const maxResourceCount = maxResourceCountData[`${this.SCHEMA}pri_11__max_resource_count`][0] || null;

        return maxResourceCount;
    },
    /**
     * Asynchronous function to get reserves.
     * @returns {Promise<Array>} Reserves data.
     */
    getReserves: async function () {
        const reservesData = await YeomenAI.getQueryData(`
        query GetReserves {
          ${this.SCHEMA}pri_11__reserves {
            resource_a
            resource_b
            amount_a
            amount_b
          }
        }
        `);
        const reserves = reservesData[`${this.SCHEMA}pri_11__reserves`] || [];
        return reserves;
    },
    /**
     * Asynchronous function to get last claimed data.
     * @param {string} entity Entity ID.
     * @returns {Promise<Object|null>} last claimed data.
     */
    getLastClaimedAt: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const lastClaimedAtData = await YeomenAI.getQueryData(`
        query GetLastClaimedAt {
          ${this.SCHEMA}pri_11__last_claimed_at(where: {entity: {_eq: "${entity}"}}) {
            entity           
            value
          }
        }
        `);
        const lastClaimedAt = lastClaimedAtData[`${this.SCHEMA}pri_11__last_claimed_at`][0] || null;
        return lastClaimedAt;
    },
    /**
     * Asynchronous function to get available resources.
     * @param {int} Entity .
     * @returns {Promise<Array>} available resources data.
     */
    getAvailableResources: async function (entity) {
        const entityResourcesCount = await this.getResourcesCount(entity);
        const entityMaxResourcesCount = await this.getMaxResourcesCount(entity);

        const entityProductionRates = await this.getProductionRates(entity);
        const entityConsumptionRates = await this.getConsumptionRates(entity);

        const lastClaimedAt = await this.getLastClaimedAt(entity);


        const currentTime = Math.floor(new Date().getTime() / 1000);
        const timeDiff = currentTime - lastClaimedAt.value;


        const availableResources = entityResourcesCount.map((entityResourceCount) => {
            const resource = entityResourceCount.resource;
            const currentResourceValue = entityResourceCount.value;

            const maxResource = entityMaxResourcesCount.find((r) => {
                return r.resource === resource;
            });
            const maxResourceValue = maxResource ? maxResource.value : 0;

            const productionRateResource = entityProductionRates.find((r) => {
                return r.resource === resource;
            });
            const productionRate = productionRateResource ? productionRateResource.value  : 0;

            const consumptionRateResource = entityConsumptionRates.find((r) => {
                return r.resource === resource;
            });
            const consumptionRate = consumptionRateResource ? consumptionRateResource.value  : 0;

            const producedValue = timeDiff * productionRate;
            const consumptionValue = timeDiff * consumptionRate;

            const totalValue = Math.floor((currentResourceValue + producedValue - consumptionValue) );
            const cappedTotalValue = Math.min(totalValue, maxResourceValue);

            return {
                resource,               
                amount: cappedTotalValue,
            };
        });
        
        return availableResources
    },
    /**
     * Asynchronous function to get production rates.    
     * @param {int} Entity .    
     * @returns {Promise<Object|null>} production rates data.
     */
    getProductionRates: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const productionRatesData = await YeomenAI.getQueryData(`
                query GetProductionRate {
                  ${this.SCHEMA}pri_11__production_rate(where: {entity: {_eq: "${entity}"}}) {
                    entity                    
                    resource,
                    value
                  }
                }
                `);
        const productionRates = productionRatesData[`${this.SCHEMA}pri_11__production_rate`] || [];
        return productionRates;
    },
    /**
     * Asynchronous function to get consumption rates.    
     * @param {int} Entity .    
     * @returns {Promise<Object|null>} consumption rates data.
     */
    getConsumptionRates: async function (entity) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        const consumptionRatesData = await YeomenAI.getQueryData(`
                query GetConsumptionRate {
                  ${this.SCHEMA}pri_11__consumption_rate(where: {entity: {_eq: "${entity}"}}) {
                    entity                    
                    resource,
                    value
                  }
                }
                `);
        const consumptionRates = consumptionRatesData[`${this.SCHEMA}pri_11__consumption_rate`] || [];
        return consumptionRates;
    },
    /**
     * Asynchronous function to get cooldown end.
     * @param {string} entity Entity ID.
     
     */
    getAsteroidBattleResultSubscription: async function (entity, callback) {
        entity = entity.replace(/(0x|\\x)/g, '\\\\x');
        return YeomenAI.getQuerySubscription(`
            subscription GetAsteroidBattleResultSubscription {
              ${this.SCHEMA}pri_11__battle_result(limit: 1, where: {asteroid_entity: {_eq: "${entity}"}}) {            
                battle_entity
                aggressor_entity
                aggressor_damage
                target_entity
                target_damage
                winner_entity
                asteroid_entity
                player_entity
                target_player_entity
                timestamp
                aggressor_allies
                target_allies
              }
            }`).subscribe({
            next: async (result) => {
                //console.log('inside Subscription result:', result);
                if (callback) {
                    callback(null, result[`${this.SCHEMA}pri_11__battle_result`]);
                }
            },
            error: (error) => {
                //console.error('inside Subscription error:', error);
                if (callback) {
                    callback(error, null);
                }
            },
        });
    },
}
