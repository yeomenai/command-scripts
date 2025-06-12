
const RPC_ENDPOINT = 'https://rpc.chain.siusia.com';
const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

const attackLocationId = parseInt(formFields['attackLocationId']);
const units = [
    'Kabango',
    'Rootguard',
    'Gunmak',
    'Snoodle',
    'Hechoy',
    'Boilix',
    'Hamgar',
    'Mushie',
    'Waxon',
    'Potano',
    'Roe',
    'Brocco',
    'Lager',
    'Dorayaki'
];
const items = [
    //instant effect items; count: 31
    "None", //0
    "ChiliChopperI", "ChiliChopperII", "ChiliChopperIII", "ChiliChopperIV", //1-4
    "PepperedArrowI", "PepperedArrowII", "PepperedArrowIII", "PepperedArrowIV", //5-8
    "SugarySiegeI", "SugarySiegeII", "SugarySiegeIII", "SugarySiegeIV", //9-12
    "HeartyBrothI", "HeartyBrothII", "HeartyBrothIII", "HeartyBrothIV", //13-16
    "SharpMustardI", "SharpMustardII", "SharpMustardIII", "SharpMustardIV", //17-20
    "SpellcastersSyrup", //21 /grey
    "ManaMint", //22 /grey
    "LuckyLemonII", "LuckyLemonIII", "LuckyLemonIV", //23-25
    "BittersweetBlend", //26 /green
    "OneBlastBerryIII", "OneBlastBerryIV", //27-28 
    "LongReachRelishIII", "LongReachRelishIV", //29-30 
    "InvincibleIcingIV", //31
    // while adding new items, keep this record as a border for instant effect items
    "SouffleSurgeII", "SouffleSurgeIII", "SouffleSurgeIV", //32-34
    "InvincibleIcingIII", //35
    "GingerZestRush", //36 /grey
    "MysteryMarinadeI", "MysteryMarinadeII", "MysteryMarinadeIII", "MysteryMarinadeIV", //37-40
    "EnergizingEspresso", //41 /green
    "TabulaRice", //42 /unique  
    "ThymeTonicII", "ThymeTonicIII", "ThymeTonicIV", //43-45
    "StomachBitters", //46 /unique
    "QuantumQuicheII", "QuantumQuicheIV", //47-48
    "VampiricVinegarII", "VampiricVinegarIII", "VampiricVinegarIV", //49-51 
    "RampagingRosemaryII", "RampagingRosemaryIII", "RampagingRosemaryIV", //52-54
    "HeftyHerb", //55 /green
    "LicoriceLeap", //56 /green
    "LastDitchDillII", "LastDitchDillIII", "LastDitchDillIV", //57-59
    "GhostlyGarlic", //60 /blue
    "SaffronShield", //61 /blue
    "DoubleDoughnut", //62 /blue
    "UntouchableUdon", //63 /blue
    "HealthHarvestingHoneyIII", "HealthHarvestingHoneyIV", //64-65
    "PomegranatePulverizer", //66 /blue
    "ResurrectionRaisinRemedy", //67 /purple
    "ChaosChocolate", //68 /purple
    "ApocalypticApple" //69 /purple
];

const locationSizes = [
    { location: 0, size: 16 },
    { location: 1, size: 24 },
    { location: 2, size: 16 },
    { location: 3, size: 16 },
    { location: 4, size: 16 },
    { location: 5, size: 16 },
    { location: 6, size: 24 },
    { location: 7, size: 16 }
];
// const spawnUnits = formFields['spawnUnits']
//     .split(',')
//     .map(spawnUnit => parseInt(spawnUnit.trim(), 10));
const [spawnUnits, spawnUnitsModifiers] = formFields['spawnUnits']
    .split(',')
    .map(unit => unit.trim()) // Remove extra spaces
    .reduce(
        ([unitsArr, modifiersArr], unit) => {
            const [baseUnit, modifier] = unit.split('*'); // Split unit and modifier
            const normalizedUnit = isNaN(parseInt(baseUnit, 10))
                ? units.includes(baseUnit) ? baseUnit : null
                : units[parseInt(baseUnit, 10)] || null;

            if (normalizedUnit) {
                unitsArr.push(units.indexOf(normalizedUnit)); // Push the unit ID (index)
                // Handle modifiers: Use `*` if no value after it, otherwise use the value or null if no `*`
                modifiersArr.push(modifier === '' ? '*' : modifier || null);
            }

            return [unitsArr, modifiersArr];
        },
        [[], []] // Initial empty arrays for units and modifiers
    ); // Convert unit names to IDs (indices)
const spendingCap = formFields['spendingCap'] || 1000;

const SCHEMA = "ai_0xd6825673ef4903f54d6a8ec1c71f399b4f34e792_";


async function getPlayer(playerAddress) {

    let TABLE_ID = '0x74620000000000000000000000000000506c6179657273000000000000000000';

    let KEY_TUPLE = [ethers.utils.hexZeroPad(playerAddress, 32)];
    let TABLE_SCHEMA = {
        "schema": {
            "player": "address",
            "isTeamRight": "bool",
            "lootboxes": "uint32",
            "ArmyGeneral": "bytes32",
            "latestWarId": "uint32",
            "votingPowerSpent": "uint256",
            "warPrisoners": "uint32",
            "title": "string",
            "items": "uint32[]",
            "resources": "uint256[]",
            "units": "uint32[]",
            "ArmyCaptain": "bytes32[]"
        },
        "key": [
            "player"
        ]
    };
    let record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);


    let recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);

    return recordDecoded;
}

async function getLocations() {
    let locationsRecords = [];
    for (let i = 0; i <= 7; i++) {
        let TABLE_ID = '0x746200000000000000000000000000004c6f636174696f6e7300000000000000';

        let KEY_TUPLE = [ethers.utils.hexZeroPad(i, 32)];
        let TABLE_SCHEMA = {
            schema: {
                id: "uint32",
                isTeamRight: "bool",
                hp: "int32",
                maxHp: "int32",
                width: "uint32",
                height: "uint32",
                resource: "uint256",
                lastClaimVp: "uint256",
                mapType: "uint256",
                neighbours: "uint32[]",
                ongoingBattles: "bytes32[]",
            },
            key: ["id"],
        };
        let record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);


        let recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);
        console.log(recordDecoded)

        locationsRecords.push(recordDecoded);
    }

    return locationsRecords;
}

async function getArmyById(armyId) {

    let TABLE_ID = '0x7462000000000000000000000000000041726d79000000000000000000000000';

    let KEY_TUPLE = [armyId];
    let TABLE_SCHEMA = {
        schema: {
            armyId: "bytes32",
            warId: "uint32",
            size: "uint32",
            armyState: "ArmyState", //Idle, Fighting
            captains: "address[]", //captains[0] is the army leader, the only person that can disband the army
            pendingInvitations: "address[]",
        },
        key: ["armyId"],
    };
    let record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);


    let recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);

    return recordDecoded;
}

// let spawnUnits = [
//     0, 1, 2, 3,
//     4, 5, 6, 7,
//     8, 9, 10, 11,
//     12, 13, 1, 0
// ];

// async function getPlayer(playerAddress) {
//     playerAddress = playerAddress.replace(/(0x|\\x)/g, '\\\\x');
//     const queryData = await YeomenAI.getQueryData(`
//             query GetQuery {
//               ${SCHEMA}players(where: {player: {_eq: "${playerAddress}"}}) {
//                 player                    
//                 is_team_right,
//                 lootboxes,
//                 army_general,
//                 latest_war_id,
//                 voting_power_spent,
//                 war_prisoners,
//                 title,
//                 items,
//                 resources,
//                 units,
//                 army_captain
//               }
//             }
//             `);
//     const data = queryData[`${SCHEMA}players`][0] || null;
//     return data;
// }

// async function getLocations() {
//     const queryData = await YeomenAI.getQueryData(`
//             query GetQuery {
//               ${SCHEMA}locations {
//                 id                    
//                 is_team_right,
//                 hp,
//                 max_hp,
//                 width,
//                 height,
//                 resource,
//                 last_claim_vp,
//                 map_type,
//                 neighbours,
//                 ongoing_battles
//               }
//             }
//             `);
//     const data = queryData[`${SCHEMA}locations`] || [];
//     return data;
// }

// async function getUnitConstants() {
//     const queryData = await YeomenAI.getQueryData(`
//             query GetQuery {
//               ${SCHEMA}unit_constants {
//                 unit_type                    
//                 hp,
//                 mana,
//                 mana_regen,
//                 cast_mana,
//                 max_mana,
//                 melee_damage,
//                 range_damage,
//                 crit_damage,
//                 crit_chance,
//                 gate_damage,
//                 attack_range
//               }
//             }
//             `);
//     const data = queryData[`${SCHEMA}unit_constants`] || [];
//     return data;
// }

async function getBattleByAttackingArmy(attackingArmy) {
    attackingArmy = attackingArmy.replace(/(0x|\\x)/g, '\\\\x');
    const queryData = await YeomenAI.getQueryData(`
            query GetQuery {
              ${SCHEMA}battles(where: {attacking_army: {_eq: "${attackingArmy}"}}) {
                id                    
                war_id,
                winner,
                init_time,
                battle_state,
                left_gate_hp,
                right_gate_hp,
                gate_bleed,
                location,
                defender_unit_placed,
                attacking_army,
                defending_army,
                left_ready,
                right_ready,
                public_defenders
              }
            }
            `);
    const data = queryData[`${SCHEMA}battles`][0] || null;
    return data;
}

async function getBattleById(id) {
    id = id.replace(/(0x|\\x)/g, '\\\\x');
    const queryData = await YeomenAI.getQueryData(`
            query GetQuery {
              ${SCHEMA}battles(where: {id: {_eq: "${id}"}}) {
                id                    
                war_id,
                winner,
                init_time,
                battle_state,
                left_gate_hp,
                right_gate_hp,
                gate_bleed,
                location,
                defender_unit_placed,
                attacking_army,
                defending_army,
                left_ready,
                right_ready,
                public_defenders
              }
            }
            `);
    const data = queryData[`${SCHEMA}battles`][0] || null;
    return data;
}

// async function getArmyById(armyId) {
//     armyId = armyId.replace(/(0x|\\x)/g, '\\\\x');
//     const queryData = await YeomenAI.getQueryData(`
//             query GetQuery {
//               ${SCHEMA}army(where: {army_id: {_eq: "${armyId}"}}) {
//                 army_id                    
//                 war_id,
//                 size,
//                 army_state,
//                 captains,
//                 pending_invitations
//               }
//             }
//             `);
//     const data = queryData[`${SCHEMA}army`][0] || null;
//     return data;
// }

async function getBattleUnitsByOwner(battleId, owner) {
    battleId = battleId.replace(/(0x|\\x)/g, '\\\\x');
    owner = owner.replace(/(0x|\\x)/g, '\\\\x');
    const queryData = await YeomenAI.getQueryData(`
            query GetQuery {
              ${SCHEMA}units(
                where: {battle_id: {_eq: "${battleId}"}, owner: {_eq: "${owner}"}}
              ) {
                id                    
                battle_id,
                unit_type,
                x,
                y,
                hp,
                max_hp,
                mana,
                mana_regen,
                cast_mana,
                max_mana,
                is_team_right,
                owner,
                level,
                title
              }
            }
            `);
    const data = queryData[`${SCHEMA}units`] || [];
    return data;
}

async function getMudConfigRecord() {

    const queryData = await YeomenAI.getQueryData(`
            query GetQuery {
              ${SCHEMA}mud_config {
                version                    
                chain_id,
                block_number
              }
            }
            `);
    const data = queryData[`${SCHEMA}mud_config`][0] || null;
    return data;
}



async function waitForMudConfigSync() {
    let interval = 5000;
    // Get the latest block number from the blockchain
    const latestBlockNumber = await provider.getBlockNumber();
    while (true) {
        try {

            // Fetch the MUD config record
            const mudConfig = await getMudConfigRecord();

            if (!mudConfig) {
                console.log("MUD config record not found, retrying...");
            } else if (mudConfig.block_number >= latestBlockNumber) {
                console.log(`MUD config is synced! ${mudConfig.block_number} >= ${latestBlockNumber}`);
                return true; // Synced
            } else {
                console.log(
                    `MUD config not synced. Latest block: ${latestBlockNumber}, Config block: ${mudConfig.block_number}`
                );
            }
        } catch (error) {
            console.error("Error while checking sync:", error);
        }

        // Wait for the specified interval before checking again
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}

(async function () {
    let stats = {
        battles: 0,
        battles_won: 0,
        battles_lost: 0,
        lootboxes: 0,
        rewards: { gold: 0, wood: 0, stone: 0, iron: 0, sugar: 0 }
    };
    const displayStats = async () => {
        let markdown = `#### Stats\n\n`; // Add extra newline for separation
        markdown += `Battles: ${stats.battles}  \n`;
        markdown += `Battles Won: ${stats.battles_won}  \n`;
        markdown += `Battles Lost: ${stats.battles_lost}  \n`;
        markdown += `#### Rewards\n\n`;
        markdown += `Lootboxes: ${stats.lootboxes}  \n`;
        markdown += `Gold: ${parseInt(stats.rewards.gold / Math.pow(10, 18))}  \n`;
        markdown += `Wood: ${stats.rewards.wood}  \n`;
        markdown += `Stone: ${stats.rewards.stone}  \n`;
        markdown += `Iron: ${stats.rewards.iron}  \n`;
        markdown += `Sugar: ${stats.rewards.sugar}  \n`;

        await YeomenAI.markdown(markdown);
    };

    await displayStats();


    while (true) {
        try {
            // Log that our Yeoman worker has started
            YeomenAI.statusMessage("Attack startegy Worker started", YeomenAI.MESSAGE_TYPES.INFO);

            let playerAddress = (YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address).toLowerCase();

            let player = await getPlayer(playerAddress);
            if (!player) {
                YeomenAI.statusMessage('Player not found', YeomenAI.MESSAGE_TYPES.INFO);
                return YeomenAI.exit(1);
            }
            console.log(player)
            let locations = await getLocations();
            console.log('locations', locations)
            //let unitConstants = await getUnitConstants();
            //console.log('unitConstants', unitConstants)
            console.log('spawnUnits', spawnUnits)
            console.log('spawnUnitsModifiers', spawnUnitsModifiers)


            let attackLocation = locations.find((location) => location.isTeamRight != player.isTeamRight && location.id == attackLocationId);

            if (!attackLocation) {
                YeomenAI.statusMessage("Location is not available to attack, Waiting 5 minutes before next check", YeomenAI.MESSAGE_TYPES.INFO);
                await YeomenAI.delay(5 * 60);//process after x minutes
                continue;
            }

            let attackLocationSize = locationSizes.find((locationSize) => locationSize.location == attackLocationId);
            if (attackLocationSize && attackLocationSize.size !== spawnUnits.length) {
                YeomenAI.statusMessage(
                    `The required units count for location is ${attackLocationSize.size}, but spawnUnits count is ${spawnUnits.length}.`,
                    YeomenAI.MESSAGE_TYPES.INFO
                );
                return YeomenAI.exit(1);
            }

            let battle;

            let armyId = player.ArmyGeneral;
            console.log('Existing ArmyId:', armyId)
            let army = armyId && armyId != '0x0000000000000000000000000000000000000000000000000000000000000000' ? await getArmyById(armyId) : null;
            console.log("Existing army", army)

            // if (armyId) return;
            // let battle;
            // if (armyId) {
            //     battle = await getBattleByAttackingArmy(armyId);
            //     console.log(battle)
            // }

            await waitForMudConfigSync();

            if (army) {
                let battleExists = await getBattleByAttackingArmy(army.armyId);
                console.log('battleExists', battleExists)
                if (battleExists && battleExists.battle_state != 3) {
                    YeomenAI.statusMessage("Battle exists, Waiting 5 minutes before next check", YeomenAI.MESSAGE_TYPES.INFO);
                    await YeomenAI.delay(5 * 60);//process after x minutes
                    continue;
                }

                try {
                    YeomenAI.statusMessage("Disband Army", YeomenAI.MESSAGE_TYPES.INFO);
                    await YeomenAI.sendTransaction('disbandArmy', []);
                    YeomenAI.statusMessage("Disband Army Success", YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Disband Army Failed ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            try {
                YeomenAI.statusMessage("Create Army", YeomenAI.MESSAGE_TYPES.INFO);
                let strikForceSize = spawnUnits.length;
                await YeomenAI.sendTransaction('createArmy', [strikForceSize, []]);
                YeomenAI.statusMessage("Create Army Success", YeomenAI.MESSAGE_TYPES.SUCCESS);

                await YeomenAI.delay(20);
                player = await getPlayer(playerAddress);
                console.log(player)

                armyId = player.ArmyGeneral;
                console.log('Created ArmyId:', armyId)
                army = await getArmyById(armyId);
                console.log("Created army", army)
            } catch (err) {
                YeomenAI.statusMessage(`Create Army Failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
            }


            const requiredUnits = spawnUnits.reduce((counts, item) => (counts[item] = (counts[item] || 0) + 1, counts), {});
            console.log('requiredUnits', requiredUnits)
            for (let [unitTypeIndex, requiredUnitTypeCount] of Object.entries(requiredUnits)) {
                console.log(`Unit Type: ${unitTypeIndex}, Count: ${requiredUnitTypeCount}`);
                let playerUnitTypeCount = player.units[unitTypeIndex] || 0;
                console.log(playerUnitTypeCount, ' ', requiredUnitTypeCount)
                if (playerUnitTypeCount >= requiredUnitTypeCount) continue;

                requiredUnitTypeCount = requiredUnitTypeCount - playerUnitTypeCount;

                for (let counter = 1; counter <= requiredUnitTypeCount; counter++) {
                    try {
                        YeomenAI.statusMessage(`Buy Unit: ${unitTypeIndex}, count: ${counter}/${requiredUnitTypeCount} `, YeomenAI.MESSAGE_TYPES.INFO);
                        await YeomenAI.sendTransaction('buyUnit', [unitTypeIndex, 1, spendingCap * Math.pow(10, 18)]);
                        YeomenAI.statusMessage(`Buy Unit: ${unitTypeIndex}, count: ${counter}/${requiredUnitTypeCount} Success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        console.log(err)
                        YeomenAI.statusMessage(`Buy Unit: ${unitTypeIndex}, count: ${counter}/${requiredUnitTypeCount} Failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
                    }
                }

            }




            try {
                let commitUnits = Array.from({ length: units.length }, (_, i) => requiredUnits[i] || 0);
                YeomenAI.statusMessage(`Commit Units to Army`, YeomenAI.MESSAGE_TYPES.INFO);
                await YeomenAI.sendTransaction('commitUnitsToArmy', [armyId, commitUnits]);
                await YeomenAI.delay(5);
                YeomenAI.statusMessage(`Commit Units to Army success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Commit Units to Army failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
            }


            //for (let attackLocation of attackLocations) {
            let locationId = attackLocation.id;
            try {
                YeomenAI.statusMessage(`Attack Location ${locationId}`, YeomenAI.MESSAGE_TYPES.INFO);
                await YeomenAI.sendTransaction('attackWithArmy', [locationId]);
                await YeomenAI.delay(2);
                YeomenAI.statusMessage(`Attack Location ${locationId} success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                console.error(`Failed to attack location ${attackLocation.id}:`, err);
                YeomenAI.statusMessage(`Attack Location ${locationId} failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
            }
            //}

            await YeomenAI.sendTransaction('pushBlock', []);

            await waitForMudConfigSync();

            await YeomenAI.delay(10);
            console.log(`Get battle from armyId: ${armyId}`)
            battle = await getBattleByAttackingArmy(armyId);
            console.log(`armyId: ${armyId} battle`, battle)
            if (!battle) {
                YeomenAI.statusMessage(`No Battle created to attack, Waiting 5 minutes before next check`, YeomenAI.MESSAGE_TYPES.FAILED);
                await YeomenAI.delay(5 * 60);//process after x minutes
                continue;
            }
            let battleId = battle.id.replace(/(\\x)/g, '0x');
            console.log(battle)



            try {
                const gridSize = 4; // 4x4 grid

                for (let i = 0; i < spawnUnits.length; i++) {
                    try {
                        const x = i % gridSize + (player.isTeamRight ? 4 : 0);// Row index       
                        const y = Math.floor(i / gridSize); // Column index                             
                        const unitType = spawnUnits[i];

                        YeomenAI.statusMessage(`Spawn Unit ${unitType} at (${x},${y})`, YeomenAI.MESSAGE_TYPES.INFO);
                        // Send transaction
                        await YeomenAI.sendTransaction('spawnUnit', [battleId, x, y, unitType]);
                        YeomenAI.statusMessage(`Spawn Unit ${unitType} at (${x},${y}) success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Spawn Unit ${unitType} at (${x},${y}) failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
                    }
                }
            } catch (err) {

            }

            await waitForMudConfigSync();

            //Add modifiers
            let battleUnitsByOwner;
            do {
                try {
                    battleUnitsByOwner = await getBattleUnitsByOwner(battleId, playerAddress);
                    console.log('battleUnitsByOwner', battleUnitsByOwner)
                    if (battleUnitsByOwner && battleUnitsByOwner.length > 0) break;
                    await YeomenAI.delay(20);
                } catch (err) {
                    break;
                }
            } while (true);
            try {
                const gridSize = 4; // 4x4 grid

                for (let i = 0; i < spawnUnitsModifiers.length; i++) {
                    try {
                        const x = i % gridSize + (player.isTeamRight ? 4 : 0);// Row index       
                        const y = Math.floor(i / gridSize); // Column index                             
                        const unitType = spawnUnits[i];
                        const unitTypeModifier = spawnUnitsModifiers[i];
                        if (!unitTypeModifier) continue;

                        let battleUnitByOwner = battleUnitsByOwner.find((battleUnitByOwner) => battleUnitByOwner.unit_type == unitType && battleUnitByOwner.x == x && battleUnitByOwner.y == y)
                        let unitId = battleUnitByOwner.id.replace(/(\\x)/g, '0x');

                        let equipItemIndex = null;
                        for (const [itemIndex, itemValue] of items.entries()) {
                            if (unitTypeModifier == '*' || unitTypeModifier == itemValue) {
                                try {
                                    await YeomenAI.estimateContractGas('equipItem', [unitId, itemIndex]);
                                    equipItemIndex = itemIndex;
                                    break;
                                } catch (err) {

                                }
                            }
                        }

                        if (!equipItemIndex) continue;

                        YeomenAI.statusMessage(`EquipItem ${unitType} at (${x},${y}) with ${equipItemIndex}`, YeomenAI.MESSAGE_TYPES.INFO);
                        // Send transaction
                        await YeomenAI.sendTransaction('equipItem', [unitId, equipItemIndex]);
                        YeomenAI.statusMessage(`EquipItem ${unitType} at (${x},${y}) with ${equipItemIndex} success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`EquipItem ${unitType} at (${x},${y}) with ${equipItemIndex} failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
                    }
                }
            } catch (err) {

            }


            //YeomenAI.statusMessage(`Waiting 10 mins for battle phase. Battle may start and complete if opponent triggers`, YeomenAI.MESSAGE_TYPES.INFO);
            // await YeomenAI.delay(10 * 60);//wait 10 minutes

            const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds (Unix timestamp)
            const startTime = battle.init_time + 10 * 60; // Battle starts 10 minutes after init_time
            const waitTime = Math.max(0, startTime - currentTime);

            if (waitTime > 0) {
                YeomenAI.statusMessage(
                    `Waiting ${Math.ceil(waitTime / 60)} minutes for battle phase. Battle may start and complete if opponent triggers.`,
                    YeomenAI.MESSAGE_TYPES.INFO
                );
                await YeomenAI.delay(waitTime); // Wait until the battle phase
            } else {
                YeomenAI.statusMessage(
                    `Battle phase has already started. Proceeding immediately.`,
                    YeomenAI.MESSAGE_TYPES.INFO
                );
            }

            await YeomenAI.delay(20);

            // await YeomenAI.delay(5 * 60);//wait 5 minutes
            // await YeomenAI.delay(5);

            // await YeomenAI.delay(4 * 60);//wait 4 minutes
            // await YeomenAI.delay(5);

            //Live fetch check if bot
            // try {
            //     YeomenAI.statusMessage(`Set army ready`, YeomenAI.MESSAGE_TYPES.INFO);
            //     await YeomenAI.sendTransaction('setArmyReady', [battleId]);
            //     await YeomenAI.delay(5);
            //     YeomenAI.statusMessage(`Set army ready success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            // } catch (err) {
            //     YeomenAI.statusMessage(`Set army ready failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
            // }

            try {
                await YeomenAI.estimateContractGas('toggleBattlePhase', [battleId]);
                try {
                    YeomenAI.statusMessage(`Start fighting`, YeomenAI.MESSAGE_TYPES.INFO);
                    await YeomenAI.sendTransaction('toggleBattlePhase', [battleId]);
                    await YeomenAI.delay(5);
                    YeomenAI.statusMessage(`Start fighting success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Start fighting failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
                }
            } catch (err) { }

            // try {
            //     YeomenAI.statusMessage(`Start Processing battle`, YeomenAI.MESSAGE_TYPES.INFO);
            //     await YeomenAI.sendTransaction('processBattle', [battleId]);
            //     await YeomenAI.delay(5);
            //     YeomenAI.statusMessage(`Start Processing battle success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            // } catch (err) {
            //     YeomenAI.statusMessage(`Start Processing battle failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
            // }

            await waitForMudConfigSync();

            battle = await getBattleById(battleId);
            do {
                try {
                    await YeomenAI.estimateContractGas('multipleProcessing', [10, battleId]);
                    try {
                        YeomenAI.statusMessage(`Start Multiple Processing`, YeomenAI.MESSAGE_TYPES.INFO);
                        await YeomenAI.sendTransaction('multipleProcessing', [10, battleId]);
                        await YeomenAI.delay(10);
                        YeomenAI.statusMessage(`Start Multiple Processing success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Start Multiple Processing failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
                    }
                    await YeomenAI.sendTransaction('pushBlock', []);
                } catch (err) {
                    console.log(err)
                    break;
                }
                await YeomenAI.delay(10);
                battle = await getBattleById(battleId); // Fetch the updated battle state                
            } while (battle.battle_state != 3);


            await YeomenAI.sendTransaction('pushBlock', []);
            await YeomenAI.delay(10);
            //let battleRewardsToClaim = await YeomenAI.getContractData('getBattleRewardsToClaim', []);            
            //console.log('battleRewardsToClaim', battleRewardsToClaim)
            let playerBeforeClaimRewards = await getPlayer(playerAddress);

            try {
                YeomenAI.statusMessage(`Claim battle rewards`, YeomenAI.MESSAGE_TYPES.INFO);
                await YeomenAI.sendTransaction('claimBattleRewards', []);
                YeomenAI.statusMessage(`Claim battle rewards success`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Claim battle rewards failed ${err.message}`, YeomenAI.MESSAGE_TYPES.FAILED);
            }

            await YeomenAI.sendTransaction('pushBlock', []);
            await YeomenAI.delay(20);

            let playerAfterClaimRewards = await getPlayer(playerAddress);
            let battleRewardsToClaim = [
                playerAfterClaimRewards.lootboxes - playerBeforeClaimRewards.lootboxes,
                [
                    Number(playerAfterClaimRewards.resources[0]) - Number(playerBeforeClaimRewards.resources[0]),
                    Number(playerAfterClaimRewards.resources[1]) - Number(playerBeforeClaimRewards.resources[1]),
                    Number(playerAfterClaimRewards.resources[2]) - Number(playerBeforeClaimRewards.resources[2]),
                    Number(playerAfterClaimRewards.resources[3]) - Number(playerBeforeClaimRewards.resources[3]),
                    Number(playerAfterClaimRewards.resources[4]) - Number(playerBeforeClaimRewards.resources[4])
                ]
            ];
            console.log('battleRewardsToClaim', battleRewardsToClaim)
            YeomenAI.statusMessage(`Battle Rewards Claimed - Lootboxes: ${battleRewardsToClaim[0]}, Gold: ${parseInt(battleRewardsToClaim[1][0] / Math.pow(10, 18))}, Wood: ${battleRewardsToClaim[1][1]}, Stone: ${battleRewardsToClaim[1][2]}, Iron: ${battleRewardsToClaim[1][3]}, Sugar: ${battleRewardsToClaim[1][4]}`);
            stats.lootboxes += Number(battleRewardsToClaim[0]);
            stats.rewards.gold += Number(battleRewardsToClaim[1][0]);
            stats.rewards.wood += Number(battleRewardsToClaim[1][1]);
            stats.rewards.stone += Number(battleRewardsToClaim[1][2]);
            stats.rewards.iron += Number(battleRewardsToClaim[1][3]);
            stats.rewards.sugar += Number(battleRewardsToClaim[1][4]);
            await displayStats();


            await waitForMudConfigSync();

            battle = await getBattleById(battleId);
            if (battle.winner == 1) {
                if (player.isTeamRight) {
                    YeomenAI.statusMessage(`Player team won the battle`, YeomenAI.MESSAGE_TYPES.INFO);
                    stats.battles_won++;
                } else {
                    YeomenAI.statusMessage(`Player team lost the battle`, YeomenAI.MESSAGE_TYPES.INFO);
                    stats.battles_lost++;
                }
            } else if (battle.winner == 2) {
                if (!player.isTeamRight) {
                    YeomenAI.statusMessage(`Player team won the battle`, YeomenAI.MESSAGE_TYPES.INFO);
                    stats.battles_won++;
                } else {
                    YeomenAI.statusMessage(`Player team lost the battle`, YeomenAI.MESSAGE_TYPES.INFO);
                    stats.battles_lost++;
                }
            }
            stats.battles++;
            await displayStats();

            YeomenAI.statusMessage(`Waiting 5 mins before next round`, YeomenAI.MESSAGE_TYPES.INFO);
            await YeomenAI.delay(5 * 60);//process after x minutes

        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage(
                `Error: ${err.message || err}, Waiting 5 minutes before next check`,
                YeomenAI.MESSAGE_TYPES.ERROR
            );
            await YeomenAI.delay(5 * 60);//process after x minutes
        }

    }





})();
