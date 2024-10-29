const user_id = formFields['walletAddress'];
const map_id = 'season_GS4_big_3';
const endpoint = "https://forceprime.io";
const access_token = 'd1d3fe0f4832512e28a0c1a514ac508f71dcbdbd7357f44e99eab1a04b69014f';
const hero_id = 260;

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');

        const createRecord = await fetch(`${endpoint}/forceprime/starknet/account/dummy/create`, {
            method: 'POST',
            body: new URLSearchParams({
                user_id: user_id,
                access_token: access_token
            })
        }).then(response => response.json());

        const mapConfig = await fetch(`${endpoint}/heroes/map/config`, {
            method: 'POST',
            headers: {
                'x-auth-token': createRecord.auth_token
            },
            body: new URLSearchParams({
                map_id: map_id
            })
        }).then(response => response.json());

        const playerGame = await fetch(`${endpoint}/dojo/player_game?${new URLSearchParams({
            player_id: createRecord.wallet.address,
            world_id: mapConfig.map_config.world
        })}`, {
            method: 'GET',
        }).then(response => response.json());

        if (mapConfig.need_hero) {
            YeomenAI.statusMessage('Setting hero as Dojaro to play game');
            const setHero = await fetch(`${endpoint}/heroes/map/set_hero`, {
                method: 'POST',
                headers: {
                    'x-auth-token': createRecord.auth_token
                },
                body: new URLSearchParams({
                    map_id: map_id,
                    hero_id: hero_id
                })
            });
        }

        if (mapConfig.hero != hero_id) {
            YeomenAI.statusMessage('Switching hero as Dojaro to play game');
            const switchHero = await fetch(`${endpoint}/heroes/map/set_hero`, {
                method: 'POST',
                headers: {
                    'x-auth-token': createRecord.auth_token
                },
                body: new URLSearchParams({
                    map_id: map_id,
                    hero_id: hero_id
                })
            });
        }

        const actions = [
            {
                "call": "pickup",
                "params": "0x17,0x13"
            },
            {
                "call": "move",
                "params": "0x4,0x2,0x2,0x4,0x2"
            },
            {
                "call": "pickup",
                "params": "0x1A,0x16"
            },
            {
                "call": "move",
                "params": "0x6,0x1,0x1,0x1,0x1,0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x14,0x14"
            },
            {
                "call": "move",
                "params": "0xA,0x1,0x1,0x3,0x3,0x2,0x3,0x2,0x2,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "capture",
                "params": "0x17,0xF"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x9,0x4,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x2"
            },
            {
                "call": "visit",
                "params": "0x1B,0xE"
            },
            {
                "call": "move",
                "params": "0x9,0x1,0x4,0x4,0x2,0x2,0x2,0x3,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xB,0x2,0x2,0x2,0x2,0x4,0x2,0x2,0x3,0x2,0x3,0x2"
            },
            {
                "call": "fight",
                "params": "0x25,0xC"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "pickup_artifact",
                "params": "0x25,0xB"
            },
            {
                "call": "equip_artifact",
                "params": "0x1,0x1"
            },
            {
                "call": "move",
                "params": "0x8,0x4,0x2,0x2,0x2,0x4,0x2,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "visit",
                "params": "0x2B,0xD"
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x1,0x1,0x3,0x1,0x1,0x1,0x1,0x4,0x1,0x4,0x1,0x1,0x1,0x3,0x1,0x1,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xC,0x4,0x1,0x1,0x1,0x1,0x4,0x1,0x1,0x1,0x4,0x1,0x1"
            },
            {
                "call": "fight",
                "params": "0x13,0x11"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "pickup_artifact",
                "params": "0x14,0x10"
            },
            {
                "call": "equip_artifact",
                "params": "0x2,0x1"
            },
            {
                "call": "move",
                "params": "0x6,0x4,0x4,0x4,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x11,0x4,0x1,0x4,0x4,0x4,0x4,0x4,0x4,0x4,0x4,0x2,0x4,0x4,0x1,0x1,0x3,0x1"
            },
            {
                "call": "visit",
                "params": "0xE,0x1D"
            },
            {
                "call": "move",
                "params": "0x3,0x2,0x4,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x13,0x2,0x3,0x3,0x3,0x3,0x1,0x3,0x3,0x3,0x3,0x3,0x3,0x2,0x3,0x2,0x3,0x2,0x3,0x2"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x4,0x3,0x2,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x9,0x4,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x2"
            },
            {
                "call": "visit",
                "params": "0x1B,0xE"
            },
            {
                "call": "move",
                "params": "0x7,0x1,0x4,0x4,0x2,0x2,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x14,0x2,0x3,0x2,0x2,0x2,0x2,0x4,0x2,0x2,0x3,0x2,0x2,0x3,0x2,0x2,0x2,0x4,0x2,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "visit",
                "params": "0x2B,0xD"
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x1,0x1,0x3,0x1,0x1,0x1,0x1,0x4,0x1,0x4,0x1,0x1,0x1,0x3,0x1,0x1,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x1,0x1,0x1,0x1,0x4,0x1,0x1,0x4,0x1,0x1,0x1,0x4,0x1,0x4,0x1,0x4,0x1,0x4,0x4"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xD,0x4,0x4,0x4,0x4,0x4,0x4,0x2,0x4,0x4,0x1,0x1,0x3,0x1"
            },
            {
                "call": "visit",
                "params": "0xE,0x1D"
            },
            {
                "call": "move",
                "params": "0x7,0x2,0x4,0x2,0x2,0x3,0x3,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x9,0x3,0x1,0x3,0x3,0x3,0x3,0x3,0x3,0x2"
            },
            {
                "call": "move",
                "params": "0xB,0x3,0x2,0x3,0x2,0x3,0x2,0x2,0x3,0x2,0x2,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x4,0x1,0x1,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x10,0x4,0x4,0x1,0x4,0x1,0x1,0x4,0x1,0x4,0x1,0x4,0x1,0x4,0x4,0x4,0x4"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x4,0x1,0x4,0x4,0x1"
            },
            {
                "call": "fight",
                "params": "0xD,0x1B"
            },
            {
                "call": "move",
                "params": "0x2,0x1,0x3"
            },
            {
                "call": "capture",
                "params": "0xD,0x19"
            },
            {
                "call": "purchase_unit",
                "params": "0xD,0x19,0xC"
            },
            {
                "call": "move",
                "params": "0xB,0x4,0x2,0x2,0x3,0x3,0x2,0x3,0x3,0x3,0x1,0x1"
            },
            {
                "call": "fight",
                "params": "0xE,0x15"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x2"
            },
            {
                "call": "capture",
                "params": "0x10,0x12"
            },
            {
                "call": "move",
                "params": "0x10,0x1,0x4,0x1,0x4,0x4,0x2,0x2,0x4,0x4,0x4,0x4,0x4,0x2,0x4,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x13,0x1B"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "pickup",
                "params": "0x13,0x1A"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x12,0x19"
            },
            {
                "call": "move",
                "params": "0xC,0x2,0x4,0x4,0x1,0x1,0x4,0x4,0x4,0x1,0x1,0x3,0x1"
            },
            {
                "call": "visit",
                "params": "0xE,0x1D"
            },
            {
                "call": "move",
                "params": "0x7,0x2,0x4,0x2,0x2,0x3,0x3,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x14,0x3,0x1,0x3,0x3,0x3,0x3,0x3,0x3,0x2,0x3,0x2,0x3,0x2,0x3,0x2,0x2,0x3,0x2,0x2,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x5,0x3,0x2,0x3,0x3,0x2"
            },
            {
                "call": "visit",
                "params": "0x1B,0xE"
            },
            {
                "call": "move",
                "params": "0xF,0x1,0x4,0x4,0x1,0x4,0x1,0x1,0x1,0x4,0x1,0x1,0x4,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xC,0x4,0x1,0x4,0x4,0x4,0x4,0x1,0x4,0x4,0x1,0x1,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "purchase_unit",
                "params": "0xD,0x19,0xC"
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x3,0x3,0x2,0x3,0x3,0x2,0x3,0x2,0x3,0x2,0x2,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x9,0x4,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x2"
            },
            {
                "call": "visit",
                "params": "0x1B,0xE"
            },
            {
                "call": "move",
                "params": "0x9,0x1,0x4,0x4,0x2,0x2,0x2,0x3,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xF,0x2,0x2,0x2,0x2,0x4,0x2,0x2,0x3,0x2,0x2,0x3,0x2,0x2,0x2,0x4"
            },
            {
                "call": "fight",
                "params": "0x28,0xF"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x1"
            },
            {
                "call": "pickup",
                "params": "0x26,0xF"
            },
            {
                "call": "move",
                "params": "0x2,0x1,0x4"
            },
            {
                "call": "pickup",
                "params": "0x25,0x10"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x6,0x2,0x2,0x3,0x2,0x2,0x3"
            },
            {
                "call": "visit",
                "params": "0x2B,0xD"
            },
            {
                "call": "move",
                "params": "0xA,0x4,0x4,0x2,0x2,0x4,0x4,0x2,0x4,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x2F,0x11"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "capture",
                "params": "0x2F,0x10"
            },
            {
                "call": "purchase_unit",
                "params": "0x2F,0x10,0xC"
            },
            {
                "call": "move",
                "params": "0x3,0x4,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "fight",
                "params": "0x2C,0x12"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x2B,0x12"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x2A,0x12"
            },
            {
                "call": "pickup",
                "params": "0x2B,0x13"
            },
            {
                "call": "move",
                "params": "0xE,0x2,0x2,0x2,0x2,0x4,0x2,0x4,0x2,0x4,0x4,0x2,0x4,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x34,0x16"
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x3,0x1"
            },
            {
                "call": "capture",
                "params": "0x33,0x14"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x3,0x4,0x4,0x4"
            },
            {
                "call": "fight",
                "params": "0x35,0x18"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup_artifact",
                "params": "0x36,0x18"
            },
            {
                "call": "equip_artifact",
                "params": "0x3,0x1"
            },
            {
                "call": "move",
                "params": "0x7,0x1,0x1,0x1,0x1,0x1,0x1,0x1"
            },
            {
                "call": "fight",
                "params": "0x2D,0x18"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x2C,0x18"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x2C,0x17"
            },
            {
                "call": "move",
                "params": "0x7,0x2,0x2,0x2,0x2,0x2,0x2,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x4"
            },
            {
                "call": "fight",
                "params": "0x33,0x1B"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x2"
            },
            {
                "call": "pickup",
                "params": "0x35,0x1B"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup",
                "params": "0x35,0x1A"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup",
                "params": "0x34,0x1C"
            },
            {
                "call": "move",
                "params": "0xA,0x1,0x1,0x1,0x1,0x1,0x1,0x1,0x1,0x4,0x1"
            },
            {
                "call": "fight",
                "params": "0x2A,0x1C"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x2,0x1,0x3"
            },
            {
                "call": "capture",
                "params": "0x2A,0x1A"
            },
            {
                "call": "purchase_unit",
                "params": "0x2A,0x1A,0xC"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xA,0x4,0x4,0x2,0x2,0x2,0x2,0x2,0x4,0x4,0x4"
            },
            {
                "call": "fight",
                "params": "0x2F,0x21"
            },
            {
                "call": "move",
                "params": "0x4,0x3,0x3,0x2,0x2"
            },
            {
                "call": "visit",
                "params": "0x32,0x20"
            },
            {
                "call": "move",
                "params": "0x6,0x1,0x3,0x1,0x1,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x6,0x1,0x1,0x3,0x3,0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2A,0x1A,0xC"
            },
            {
                "call": "move",
                "params": "0xE,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x3,0x2,0x3,0x3,0x3,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2F,0x10,0xC"
            },
            {
                "call": "move",
                "params": "0x11,0x4,0x1,0x1,0x3,0x1,0x3,0x3,0x1,0x1,0x1,0x1,0x3,0x3,0x1,0x1,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x1,0x4,0x1,0x1,0x1,0x3,0x1,0x1,0x1,0x4,0x1,0x4,0x1,0x1,0x1,0x1,0x4,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x12,0x4,0x4,0x1,0x4,0x1,0x1,0x4,0x1,0x4,0x1,0x4,0x1,0x4,0x4,0x4,0x4,0x1,0x4"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x4,0x4,0x1,0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0xD,0x19,0xC"
            },
            {
                "call": "move",
                "params": "0xC,0x4,0x2,0x2,0x4,0x2,0x4,0x2,0x4,0x4,0x1,0x1,0x4"
            },
            {
                "call": "fight",
                "params": "0xF,0x21"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x2"
            },
            {
                "call": "pickup",
                "params": "0x11,0x21"
            },
            {
                "call": "move",
                "params": "0x2,0x2,0x2"
            },
            {
                "call": "pickup",
                "params": "0x12,0x22"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "pickup",
                "params": "0x13,0x21"
            },
            {
                "call": "move",
                "params": "0x14,0x1,0x1,0x1,0x3,0x3,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x3,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "fight",
                "params": "0x1C,0x1C"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x3,0x1"
            },
            {
                "call": "capture",
                "params": "0x1B,0x1A"
            },
            {
                "call": "move",
                "params": "0x5,0x2,0x4,0x4,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x1E,0x1E"
            },
            {
                "call": "move",
                "params": "0xC,0x1,0x4,0x4,0x4,0x4,0x4,0x1,0x1,0x1,0x1,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x4"
            },
            {
                "call": "fight",
                "params": "0x17,0x24"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x2"
            },
            {
                "call": "use_object",
                "params": "0x19,0x24"
            },
            {
                "call": "move",
                "params": "0x5,0x2,0x2,0x2,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x32,0x2C"
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "pickup_chest",
                "params": "0x31,0x2B,0x2"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "pickup_artifact",
                "params": "0x31,0x2A"
            },
            {
                "call": "equip_artifact",
                "params": "0x4,0x1"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "pickup_chest",
                "params": "0x32,0x2A,0x2"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x8,0x2,0x4,0x4,0x4,0x2,0x2,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x7,0x2,0x3,0x2,0x3,0x3,0x3,0x3"
            },
            {
                "call": "fight",
                "params": "0x37,0x26"
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "pickup_chest",
                "params": "0x36,0x25,0x2"
            },
            {
                "call": "pickup_artifact",
                "params": "0x37,0x24"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "pickup_chest",
                "params": "0x38,0x24,0x2"
            },
            {
                "call": "move",
                "params": "0xA,0x4,0x4,0x4,0x1,0x1,0x1,0x1,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "fight",
                "params": "0x30,0x27"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x3,0x3"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x25"
            },
            {
                "call": "use_object",
                "params": "0x10,0x28"
            },
            {
                "call": "use_object",
                "params": "0x1D,0x6"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x7"
            },
            {
                "call": "move",
                "params": "0x10,0x4,0x2,0x4,0x2,0x2,0x3,0x2,0x2,0x2,0x2,0x4,0x2,0x4,0x4,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xB,0x4,0x1,0x1,0x4,0x1,0x1,0x1,0x1,0x1,0x1,0x1"
            },
            {
                "call": "use_object",
                "params": "0x2D,0x2C"
            },
            {
                "call": "move",
                "params": "0x9,0x1,0x3,0x1,0x3,0x3,0x1,0x1,0x3,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xE,0x3,0x1,0x1,0x1,0x1,0x3,0x3,0x3,0x3,0x1,0x1,0x1,0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0xD,0x19,0xC"
            },
            {
                "call": "move",
                "params": "0x6,0x4,0x2,0x2,0x3,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x10,0x3,0x3,0x3,0x2,0x3,0x3,0x2,0x3,0x2,0x3,0x2,0x2,0x3,0x2,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x4,0x4,0x4,0x2,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x4,0x1,0x1,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0x10"
            },
            {
                "call": "move",
                "params": "0x10,0x4,0x4,0x2,0x2,0x2,0x2,0x3,0x2,0x2,0x2,0x3,0x3,0x2,0x2,0x2,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x2,0x2,0x2,0x3,0x2,0x3,0x2,0x2,0x2,0x4,0x2,0x2,0x4,0x2,0x2,0x4,0x4,0x2,0x4"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x3,0x2,0x2,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2F,0x10,0x18"
            },
            {
                "call": "move",
                "params": "0x11,0x4,0x4,0x4,0x1,0x4,0x4,0x4,0x4,0x1,0x4,0x4,0x4,0x1,0x4,0x1,0x1,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "purchase_unit",
                "params": "0x2A,0x1A,0xA"
            },
            {
                "call": "move",
                "params": "0x7,0x4,0x4,0x4,0x4,0x1,0x4,0x4"
            },
            {
                "call": "fight",
                "params": "0x29,0x22"
            },
            {
                "call": "move",
                "params": "0x8,0x4,0x4,0x4,0x1,0x4,0x1,0x1,0x3"
            },
            {
                "call": "capture",
                "params": "0x26,0x23"
            },
            {
                "call": "move",
                "params": "0x4,0x4,0x2,0x2,0x4"
            },
            {
                "call": "fight",
                "params": "0x28,0x27"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x1,0x4"
            },
            {
                "call": "pickup",
                "params": "0x29,0x27"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup",
                "params": "0x2A,0x27"
            },
            {
                "call": "move",
                "params": "0x6,0x1,0x3,0x3,0x1,0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x26,0x23,0x4"
            },
            {
                "call": "move",
                "params": "0x7,0x1,0x1,0x4,0x4,0x4,0x4,0x1"
            },
            {
                "call": "fight",
                "params": "0x22,0x28"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "capture",
                "params": "0x22,0x27"
            },
            {
                "call": "move",
                "params": "0x5,0x1,0x1,0x3,0x3,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x1,0x3"
            },
            {
                "call": "fight",
                "params": "0x1D,0x24"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x8,0x2,0x4,0x4,0x2,0x2,0x3,0x2,0x3"
            },
            {
                "call": "pickup_artifact",
                "params": "0x22,0x23"
            },
            {
                "call": "equip_artifact",
                "params": "0x6,0x1"
            },
            {
                "call": "move",
                "params": "0x4,0x2,0x2,0x2,0x2"
            },
            {
                "call": "purchase_unit",
                "params": "0x26,0x23,0x1"
            },
            {
                "call": "move",
                "params": "0x5,0x4,0x2,0x2,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xA,0x3,0x3,0x3,0x3,0x3,0x2,0x3,0x3,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2A,0x1A,0x7"
            },
            {
                "call": "move",
                "params": "0x10,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x3,0x2,0x3,0x3,0x3,0x3,0x2,0x3,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2F,0x10,0x6"
            },
            {
                "call": "move",
                "params": "0x19,0x4,0x1,0x1,0x3,0x1,0x3,0x3,0x1,0x1,0x1,0x1,0x3,0x3,0x1,0x1,0x1,0x1,0x4,0x1,0x4,0x1,0x1,0x1,0x3,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xE,0x1,0x1,0x4,0x1,0x4,0x1,0x1,0x1,0x1,0x4,0x1,0x1,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0xA"
            },
            {
                "call": "move",
                "params": "0xC,0x4,0x4,0x1,0x4,0x1,0x1,0x4,0x1,0x4,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xA,0x4,0x4,0x4,0x4,0x1,0x4,0x4,0x1,0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0xD,0x19,0x6"
            },
            {
                "call": "move",
                "params": "0x10,0x4,0x2,0x2,0x2,0x2,0x4,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x4"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x17,0x2,0x2,0x2,0x4,0x4,0x4,0x4,0x4,0x4,0x4,0x2,0x2,0x4,0x4,0x2,0x2,0x3,0x2,0x3,0x2,0x2,0x2,0x2"
            },
            {
                "call": "purchase_unit",
                "params": "0x26,0x23,0x1"
            },
            {
                "call": "move",
                "params": "0x3,0x4,0x2,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xC,0x3,0x2,0x3,0x3,0x3,0x3,0x3,0x2,0x3,0x3,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2A,0x1A,0x6"
            },
            {
                "call": "move",
                "params": "0xE,0x4,0x2,0x4,0x4,0x2,0x2,0x2,0x2,0x4,0x2,0x4,0x4,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "use_object",
                "params": "0x2D,0x20"
            },
            {
                "call": "move",
                "params": "0x11,0x4,0x4,0x1,0x1,0x3,0x3,0x1,0x1,0x1,0x1,0x1,0x4,0x1,0x1,0x3,0x3,0x3"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x25"
            },
            {
                "call": "fight",
                "params": "0xF,0x29"
            },
            {
                "call": "move",
                "params": "0x7,0x1,0x1,0x1,0x1,0x1,0x1,0x3"
            },
            {
                "call": "pickup_artifact",
                "params": "0xA,0x27"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x1"
            },
            {
                "call": "fight",
                "params": "0x9,0x25"
            },
            {
                "call": "move",
                "params": "0x3,0x3,0x3,0x2"
            },
            {
                "call": "capture",
                "params": "0xB,0x24"
            },
            {
                "call": "purchase_unit",
                "params": "0xB,0x24,0x6"
            },
            {
                "call": "move",
                "params": "0x9,0x1,0x4,0x4,0x4,0x4,0x2,0x4,0x4,0x1"
            },
            {
                "call": "fight",
                "params": "0x8,0x2A"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x2,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0xB,0x2B"
            },
            {
                "call": "move",
                "params": "0x1,0x4"
            },
            {
                "call": "pickup",
                "params": "0xC,0x2B"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup",
                "params": "0xD,0x2B"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup",
                "params": "0xE,0x2B"
            },
            {
                "call": "move",
                "params": "0x7,0x1,0x1,0x3,0x3,0x1,0x3,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x5,0x3,0x1,0x3,0x3,0x2"
            },
            {
                "call": "purchase_unit",
                "params": "0xB,0x24,0x9"
            },
            {
                "call": "move",
                "params": "0xD,0x1,0x4,0x4,0x2,0x2,0x2,0x2,0x4,0x2,0x4,0x4,0x2,0x2"
            },
            {
                "call": "use_object",
                "params": "0x10,0x28"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "fight",
                "params": "0x1C,0x8"
            },
            {
                "call": "move",
                "params": "0x7,0x4,0x1,0x1,0x1,0x1,0x1,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "fight",
                "params": "0x16,0x6"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x6,0x1,0x1,0x3,0x1,0x1,0x4"
            },
            {
                "call": "fight",
                "params": "0x12,0x8"
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "pickup_artifact",
                "params": "0x11,0x6"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x4"
            },
            {
                "call": "pickup",
                "params": "0x12,0x9"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x1"
            },
            {
                "call": "pickup",
                "params": "0x11,0xA"
            },
            {
                "call": "move",
                "params": "0x2,0x4,0x1"
            },
            {
                "call": "pickup",
                "params": "0xF,0xA"
            },
            {
                "call": "move",
                "params": "0xB,0x2,0x3,0x2,0x3,0x3,0x3,0x2,0x2,0x2,0x2,0x3"
            },
            {
                "call": "pickup",
                "params": "0x17,0x5"
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup",
                "params": "0x18,0x5"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x2"
            },
            {
                "call": "pickup",
                "params": "0x19,0x5"
            },
            {
                "call": "move",
                "params": "0xD,0x1,0x1,0x4,0x4,0x2,0x4,0x2,0x2,0x2,0x2,0x2,0x3,0x3"
            },
            {
                "call": "use_object",
                "params": "0x1D,0x6"
            },
            {
                "call": "move",
                "params": "0x1,0x4"
            },
            {
                "call": "fight",
                "params": "0x30,0x9"
            },
            {
                "call": "move",
                "params": "0x3,0x2,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x32,0xA"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0x4,0x2,0x2,0x2,0x2"
            },
            {
                "call": "fight",
                "params": "0x37,0x9"
            },
            {
                "call": "move",
                "params": "0x3,0x2,0x3,0x3"
            },
            {
                "call": "capture",
                "params": "0x37,0x6"
            },
            {
                "call": "purchase_unit",
                "params": "0x37,0x6,0x5"
            },
            {
                "call": "move",
                "params": "0x1,0x4"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x6,0x4,0x1,0x1,0x3,0x1,0x1"
            },
            {
                "call": "pickup_artifact",
                "params": "0x32,0x8"
            },
            {
                "call": "move",
                "params": "0x6,0x1,0x1,0x4,0x1,0x1,0x3"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x7"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x25"
            },
            {
                "call": "move",
                "params": "0xD,0x1,0x1,0x3,0x3,0x3,0x1,0x1,0x1,0x1,0x1,0x3,0x3,0x2"
            },
            {
                "call": "purchase_unit",
                "params": "0xB,0x24,0x1"
            },
            {
                "call": "move",
                "params": "0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xC,0x4,0x4,0x2,0x4,0x4,0x4,0x2,0x2,0x2,0x2,0x2,0x2"
            },
            {
                "call": "use_object",
                "params": "0x10,0x28"
            },
            {
                "call": "use_object",
                "params": "0x1D,0x6"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x7"
            },
            {
                "call": "move",
                "params": "0xE,0x2,0x4,0x4,0x2,0x2,0x3,0x2,0x2,0x2,0x2,0x2,0x4,0x4,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x3,0x2,0x3,0x3"
            },
            {
                "call": "use_object",
                "params": "0x39,0x26"
            },
            {
                "call": "move",
                "params": "0x17,0x2,0x2,0x2,0x3,0x3,0x1,0x3,0x1,0x1,0x1,0x1,0x4,0x4,0x1,0x1,0x4,0x4,0x4,0x4,0x1,0x4,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x26,0x23,0x9"
            },
            {
                "call": "move",
                "params": "0xF,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x3,0x3,0x3,0x2,0x3,0x3,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2A,0x1A,0x9"
            },
            {
                "call": "move",
                "params": "0xA,0x4,0x2,0x2,0x3,0x2,0x3,0x3,0x3,0x2,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x7,0x3,0x3,0x3,0x2,0x3,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x2F,0x10,0x7"
            },
            {
                "call": "move",
                "params": "0x13,0x4,0x1,0x1,0x3,0x1,0x3,0x3,0x1,0x1,0x1,0x1,0x3,0x3,0x1,0x1,0x1,0x1,0x4,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x14,0x4,0x1,0x1,0x1,0x3,0x1,0x1,0x1,0x4,0x1,0x4,0x1,0x1,0x1,0x1,0x4,0x1,0x1,0x3,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0x17,0xF,0xA"
            },
            {
                "call": "move",
                "params": "0x6,0x4,0x4,0x1,0x4,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x10,0x4,0x1,0x4,0x1,0x4,0x1,0x4,0x4,0x4,0x4,0x1,0x4,0x4,0x1,0x1,0x3"
            },
            {
                "call": "purchase_unit",
                "params": "0xD,0x19,0x6"
            },
            {
                "call": "move",
                "params": "0xA,0x4,0x2,0x2,0x2,0x2,0x4,0x4,0x4,0x4,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xB,0x2,0x2,0x2,0x4,0x4,0x4,0x2,0x2,0x4,0x4,0x2"
            },
            {
                "call": "use_object",
                "params": "0x19,0x24"
            },
            {
                "call": "move",
                "params": "0xF,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x3,0x2,0x2,0x3,0x2,0x3,0x3,0x3"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0xC,0x3,0x1,0x1,0x1,0x1,0x1,0x4,0x1,0x1,0x3,0x3,0x3"
            },
            {
                "call": "use_object",
                "params": "0x2F,0x25"
            },
            {
                "call": "use_object",
                "params": "0x10,0x28"
            },
            {
                "call": "move",
                "params": "0xE,0x1,0x4,0x1,0x1,0x1,0x1,0x1,0x3,0x1,0x1,0x1,0x3,0x1,0x1"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x9,0x1,0x1,0x4,0x1,0x1,0x4,0x1,0x1,0x3"
            },
            {
                "call": "use_object",
                "params": "0xC,0x6"
            },
            {
                "call": "move",
                "params": "0x7,0x1,0x1,0x3,0x3,0x3,0x3,0x1"
            },
            {
                "call": "fight",
                "params": "0x6,0x1A"
            },
            {
                "call": "level_up",
                "params": "0x1"
            },
            {
                "call": "move",
                "params": "0xA,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x2"
            },
            {
                "call": "next_day",
                "params": ""
            },
            {
                "call": "move",
                "params": "0x2,0x3,0x3"
            },
            {
                "call": "fight",
                "params": "0x7,0xF"
            },
            {
                "call": "level_up",
                "params": "0x3"
            },
            {
                "call": "move",
                "params": "0x4,0x3,0x1,0x3,0x3"
            },
            {
                "call": "visit",
                "params": "0x6,0xC"
            }
        ];

        for (const action of actions) {
            try {
                YeomenAI.statusMessage(`Execute Contract call: ${action.call} params: ${action.params}`);
                const callContractResponse = await fetch(`${endpoint}/forceprime/starknet/call_contract`, {
                    method: 'POST',
                    body: new URLSearchParams({
                        access_token: access_token,
                        private_key: createRecord.wallet.privateKey,
                        public_key: createRecord.wallet.publicKey,
                        address: createRecord.wallet.address,
                        call: action.call,
                        params: action.params,
                        contract: mapConfig.map_config.contract,
                        sid: createRecord.sid,
                        uid: createRecord.user_id,
                        user_token: createRecord.auth_token,
                        game_id: playerGame.game_id
                    })
                }).then(response => response.json());
                YeomenAI.statusMessage(`Executed Contract call: ${action.call} params: ${action.params}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Failed Contract call ${action.call}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        YeomenAI.statusMessage('Running code script completed');
        YeomenAI.exit(0);
    } catch (err) {
        console.error('Error in simulateGame:', err);
        YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
