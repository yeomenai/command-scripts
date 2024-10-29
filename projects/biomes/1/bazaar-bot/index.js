importScripts(`${self.location.origin}/projects/biomes/1/services.js`);

const MoveSystemId = BiomesYeomen.SYSTEMS.MoveSystemId;
const TransferSystemId = BiomesYeomen.SYSTEMS.TransferSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;

//const FORCE_FIELD_SHARD_DIM = 32;

const experienceItemShops = [
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000002e94c",
        "shop_type": 2,
        "object_type_id": 166
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000002e94d",
        "shop_type": 2,
        "object_type_id": 165
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000002ec29",
        "shop_type": 2,
        "object_type_id": 164
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000002ec2e",
        "shop_type": 1,
        "object_type_id": 50
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000002eecf",
        "shop_type": 2,
        "object_type_id": 97
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000032654",
        "shop_type": 3,
        "object_type_id": 50
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000033496",
        "shop_type": 2,
        "object_type_id": 97
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000033df2",
        "shop_type": 2,
        "object_type_id": 50
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000033e03",
        "shop_type": 2,
        "object_type_id": 75
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000033ff7",
        "shop_type": 2,
        "object_type_id": 42
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d5fd",
        "shop_type": 3,
        "object_type_id": 119
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d5fe",
        "shop_type": 3,
        "object_type_id": 121
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d5ff",
        "shop_type": 3,
        "object_type_id": 120
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d600",
        "shop_type": 3,
        "object_type_id": 118
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d605",
        "shop_type": 3,
        "object_type_id": 110
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d60a",
        "shop_type": 3,
        "object_type_id": 43
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d60b",
        "shop_type": 3,
        "object_type_id": 81
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d60c",
        "shop_type": 3,
        "object_type_id": 80
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d60d",
        "shop_type": 3,
        "object_type_id": 99
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d613",
        "shop_type": 3,
        "object_type_id": 26
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d614",
        "shop_type": 3,
        "object_type_id": 82
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d615",
        "shop_type": 3,
        "object_type_id": 104
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d616",
        "shop_type": 3,
        "object_type_id": 107
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d61b",
        "shop_type": 3,
        "object_type_id": 25
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d620",
        "shop_type": 3,
        "object_type_id": 24
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d621",
        "shop_type": 3,
        "object_type_id": 21
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d622",
        "shop_type": 3,
        "object_type_id": 23
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004d623",
        "shop_type": 3,
        "object_type_id": 32
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddab",
        "shop_type": 3,
        "object_type_id": 117
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddac",
        "shop_type": 3,
        "object_type_id": 114
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddad",
        "shop_type": 3,
        "object_type_id": 113
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddaf",
        "shop_type": 3,
        "object_type_id": 123
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddb0",
        "shop_type": 3,
        "object_type_id": 122
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddb1",
        "shop_type": 3,
        "object_type_id": 111
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddb6",
        "shop_type": 3,
        "object_type_id": 115
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddbb",
        "shop_type": 3,
        "object_type_id": 100
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddbc",
        "shop_type": 3,
        "object_type_id": 97
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddbe",
        "shop_type": 3,
        "object_type_id": 89
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddc0",
        "shop_type": 3,
        "object_type_id": 109
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddc5",
        "shop_type": 3,
        "object_type_id": 102
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddc6",
        "shop_type": 3,
        "object_type_id": 105
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddc7",
        "shop_type": 3,
        "object_type_id": 88
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddc8",
        "shop_type": 3,
        "object_type_id": 93
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddc9",
        "shop_type": 3,
        "object_type_id": 44
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddca",
        "shop_type": 3,
        "object_type_id": 108
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddcf",
        "shop_type": 3,
        "object_type_id": 30
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddd4",
        "shop_type": 3,
        "object_type_id": 22
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddd5",
        "shop_type": 3,
        "object_type_id": 29
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddd6",
        "shop_type": 3,
        "object_type_id": 27
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddd7",
        "shop_type": 3,
        "object_type_id": 31
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddd8",
        "shop_type": 3,
        "object_type_id": 33
    },
    {
        "entity_id": "0x000000000000000000000000000000000000000000000000000000000004ddd9",
        "shop_type": 3,
        "object_type_id": 28
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000051aac",
        "shop_type": 3,
        "object_type_id": 112
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000051ab5",
        "shop_type": 3,
        "object_type_id": 91
    },
    {
        "entity_id": "0x0000000000000000000000000000000000000000000000000000000000051abe",
        "shop_type": 3,
        "object_type_id": 95
    }
];

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');



            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = null;


            const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
            console.log('positionRecord', positionRecord)
            if (positionRecord && positionRecord.x != 0 && positionRecord.y != 0 && positionRecord.z != 0) {
                currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
            }

            const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
            console.log('lastKnownPositionRecord', lastKnownPositionRecord)
            if (lastKnownPositionRecord && lastKnownPositionRecord.x != 0 && lastKnownPositionRecord.y != 0 && lastKnownPositionRecord.z != 0) {
                currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
            }

            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

           // const shardCoord = BiomesYeomen.coordToShardCoord(currentPositionCoord, FORCE_FIELD_SHARD_DIM);

           // console.log('shardCoord', shardCoord)
            //const shardFieldRecord = await BiomesYeomen.getShardFieldRecord(shardCoord.x, shardCoord.y, shardCoord.z);
            //console.log('shardFieldRecord', shardFieldRecord)
           // const shardField = await BiomesYeomen.getShardField(shardCoord.x, shardCoord.y, shardCoord.z);
           // console.log('shardField', shardField)

            //Login player
            try {

                await YeomenAI.estimateContractGas('loginPlayer', [currentPositionCoord], PlayerLoginSystemId);
                try {
                    YeomenAI.statusMessage(`Start loginPlayer`);
                    await YeomenAI.sendTransaction('loginPlayer', [currentPositionCoord], PlayerLoginSystemId);
                    YeomenAI.statusMessage(`Successfully loginPlayer`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to loginPlayer: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            } catch (err) {

            }




            let transferObjectTypeId = 118;
            let numToTransfer = 1;

            const experienceItemShop = experienceItemShops.find((experienceItemShop) =>
                experienceItemShop.object_type_id === transferObjectTypeId && experienceItemShop.shop_type === 3
            );
            if (!experienceItemShop) {
                YeomenAI.statusMessage('Item shop not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            let sourceEntityId = experienceItemShop.entity_id;
            let destinationEntityId = playerEntityId;



            //const chestEntityId = (sourceEntityId == playerEntityId)?destinationEntityId:sourceEntityId;
            // const experienceChestMetadataRecord = await BiomesYeomen.getExperienceChestMetadataRecord(chestEntityId);
            // console.log(experienceChestMetadataRecord)

            // const destinationPositionRecord = await BiomesYeomen.getPositionRecord(destinationEntityId);
            // console.log('destinationPositionRecord', destinationPositionRecord)

            // let destinationPositionCoord = { x: destinationPositionRecord.x, y: destinationPositionRecord.y, z: destinationPositionRecord.z };



            // //Move to destination         
            // let path = await BiomesYeomen.generatePath(currentPositionCoord, destinationPositionCoord);
            // console.log(path)
            // try {
            //     await YeomenAI.estimateContractGas('move', [path], MoveSystemId);
            //     try {
            //         YeomenAI.statusMessage(`Start moving`);
            //         await YeomenAI.sendTransaction('move', [path], MoveSystemId);
            //         YeomenAI.statusMessage(`Successfully moved`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            //     } catch (err) {
            //         YeomenAI.statusMessage(`Failed to move: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            //     }
            // } catch (err) {
            //     console.log(err)
            // }


            try {

                await YeomenAI.estimateContractGas('transfer', [sourceEntityId, destinationEntityId, transferObjectTypeId, numToTransfer], TransferSystemId);
                try {
                    YeomenAI.statusMessage(`Start buy`);
                    await YeomenAI.sendTransaction('transfer', [sourceEntityId, destinationEntityId, transferObjectTypeId, numToTransfer], TransferSystemId);
                    YeomenAI.statusMessage(`Successfully bought`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to buy: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            } catch (err) {
                console.log(err)
            }

        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();   