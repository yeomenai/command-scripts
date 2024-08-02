const ownerAddress = formFields['ownerAddress'];
const alertOnAttack = formFields['alertOnAttack'];
const alertOnIncomingFleet = formFields['alertOnIncomingFleet'];
const alertOnNotClaimedPrimodiumFrequency = formFields['alertOnNotClaimedPrimodiumFrequency'];

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');

        const ownerEntity = WorkerUtils.addressToEntity(ownerAddress);
        let ownedAsteroids = await PrimodiumYeomen.getOwnedEntities(ownerEntity);

        if (alertOnAttack) {
            //console.log('yes attack')
            YeomenAI.getQuerySubscription(`
                subscription GetAsteroidBattleResultSubscription {
                  ${PrimodiumYeomen.SCHEMA}pri_11__battle_result(where: {asteroid_entity: {_in: ${JSON.stringify(ownedAsteroids.map(ownedAsteroid => ownedAsteroid.entity.replace(/^(0x|\\x)/, "\\x")))}}}) {            
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
                    const battleResults = result[`${PrimodiumYeomen.SCHEMA}pri_11__battle_result`] || [];

                    for (const battleResult of battleResults) {
                        // Parse the timestamp and calculate the difference from now
                        const battleTimestamp = new Date(battleResult.timestamp).getTime();
                        const currentTimestamp = new Date().getTime();
                        const timeDifference = currentTimestamp - battleTimestamp;

                        // Check if the time difference is within 2 minutes (2 * 60 * 1000 milliseconds)
                        if (timeDifference <= 2 * 60 * 1000) {
                            YeomenAI.telegramAlert(`Your asteroid is being attacked`);
                        }
                    }

                },
                error: (error) => {
                    //console.error('inside Subscription error:', error);

                },
            });
        }


        if (alertOnIncomingFleet) {
            YeomenAI.getQuerySubscription(`
                subscription GetAsteroidFleetMovementSubscription {
                  ${PrimodiumYeomen.SCHEMA}pri_11__fleet_movement(where: {destination: {_in: ${JSON.stringify(ownedAsteroids.map(ownedAsteroid => ownedAsteroid.entity.replace(/^(0x|\\x)/, "\\x")))}}}) {            
                        entity
                        origin
                        destination
                        send_time
                        arrival_time
                  }
                }`).subscribe({
                next: async (result) => {
                    //console.log('inside Subscription result:', result);
                    const fleetMovements = result[`${PrimodiumYeomen.SCHEMA}pri_11__fleet_movement`] || [];

                    for (const fleetMovement of fleetMovements) {

                        const destinationEntity = fleetMovement.destination.replace(/\\x/g, '0x');
                        const fleetEntity = fleetMovement.entity.replace(/\\x/g, '0x');

                        const asteroidEntity = destinationEntity;

                        YeomenAI.statusMessage('Get Fleet owner');
                        const fleetOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetEntity);
                        const fleetOwner = fleetOwnedBy.value.replace(/\\x/g, '0x');

                        YeomenAI.statusMessage('Get Fleet Asteroid owner');
                        const fleetAsteroidOwnedBy = await PrimodiumYeomen.getOwnedBy(fleetOwner);
                        const fleetAsteroidOwner = fleetAsteroidOwnedBy.value.replace(/\\x/g, '0x');

                        YeomenAI.statusMessage('Check with Attacking Asteroid owner');
                        const asteroidOwnedBy = await PrimodiumYeomen.getOwnedBy(asteroidEntity);
                        const asteroidOwner = asteroidOwnedBy ? asteroidOwnedBy.value : null;
                        //console.log(fleetAsteroidOwner, asteroidOwner)

                        if (fleetAsteroidOwner === asteroidOwner) {
                            return;
                        }


                        const fleetUnitsCount = await PrimodiumYeomen.getUnitsCount(fleetEntity);
                        const fleetTotalUnits = fleetUnitsCount.reduce((accumulator, current) => accumulator + current.value, 0);

                        const fleetResourcesCount = await PrimodiumYeomen.getResourcesCount(fleetEntity);
                        const fleetTotalResources = fleetResourcesCount.reduce((accumulator, current) => accumulator + current.value, 0);

                        //console.log(fleetUnitsCount, fleetResourcesCount)

                        const allianceJoinRequest = await PrimodiumYeomen.getAllianceJoinRequest(fleetAsteroidOwner);

                        let alliance;
                        if (allianceJoinRequest) {
                            const allianceEntity = allianceJoinRequest.alliance.replace(/\\x/g, '0x');
                            alliance = await PrimodiumYeomen.getAlliance(allianceEntity);
                        }

                        //console.log(allianceJoinRequest, alliance)

                        // Parse the timestamp and calculate the difference from now
                        const fleetMovementTimestamp = new Date(fleetMovement.send_time).getTime();
                        const currentTimestamp = new Date().getTime();
                        const timeDifference = currentTimestamp - fleetMovementTimestamp;

                        const arrivalTimeSeconds = new Date(fleetMovement.arrival_time).getTime() - new Date(fleetMovement.send_time).getTime();

                        // Check if the time difference is within 2 minutes (2 * 60 * 1000 milliseconds)
                        if (timeDifference <= 2 * 60 * 1000) {
                            const message = `
                            A fleet is headed to your asteroid.
                            Target Asteroid: ${PrimodiumYeomen.entityToRockName(destinationEntity)}
                            Fleet owner: ${PrimodiumYeomen.entityToPlayerName(fleetAsteroidOwner)}
                            Fleet Alliance: ${alliance ? WorkerUtils.hexToUtf8(alliance.name) : 'N/A'}
                            Fleet army units: ${fleetTotalUnits}
                            Fleet resources: ${fleetTotalResources}
                            Fleet arrival time: ${WorkerUtils.formatTime(arrivalTimeSeconds)}
                            `;
                            //console.log(message)
                            YeomenAI.telegramAlert(message);
                        }
                    }
                },
                error: (error) => {
                    //console.error('inside Subscription error:', error);

                },
            });
        }


        if (alertOnNotClaimedPrimodiumFrequency > 0) {
            do {
                try {

                    for (const ownedAsteroid of ownedAsteroids) {
                        const asteroidEntity = ownedAsteroid.entity.replace(/\\x/g, '0x');
                        const lastConqueredRecord = await PrimodiumYeomen.getLastConqueredRecord(asteroidEntity);

                        const storageKey = `${asteroidEntity}-lastConquered`;
                        const storageValue = await YeomenAI.getStorageItem(storageKey);

                        //Avoid sending same alerts 
                        if (storageValue && parseInt(storageValue) === parseInt(lastConqueredRecord.value))
                            continue;

                        const lastTimestamp = new Date(parseInt(lastConqueredRecord.value) * 1000).getTime();
                        const currentTimestamp = new Date().getTime();
                        const timeDifference = currentTimestamp - lastTimestamp;

                        // Convert time difference from milliseconds to minutes
                        const differenceInMinutes = parseInt(timeDifference / 60000);

                        if (differenceInMinutes > parseInt(alertOnNotClaimedPrimodiumFrequency)) {
                            YeomenAI.telegramAlert(`Claim check for Primodium on Asteroid ${PrimodiumYeomen.entityToRockName(asteroidEntity)} has not been performed for the last ${differenceInMinutes} minutes. Please ensure to claim promptly to avoid missing benefits.`);
                            await YeomenAI.setStorageItem(storageKey, parseInt(lastConqueredRecord.value));
                        }
                    }

                } catch (err) {
                }
                YeomenAI.delay(60);
            } while (true);
        }

        //YeomenAI.exit(0);
    } catch (err) {
        console.error('Error in simulateGame:', err);
        YeomenAI.statusMessage('Running code script failed');
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
