(async () => {
    try {
        importScripts(`${self.location.origin}/libraries/ethers6.umd.min.js`);
        importScripts(`https://cdnjs.cloudflare.com/ajax/libs/eventemitter3/5.0.1/index.min.js`);

        // Define replacer function
        const JSONBigNumberReplacer = (key, value) => typeof value === "bigint" ? value.toString() : value;

        const rpcEndpoint = "https://json-rpc.culinaris-2.initia.tech";

        // RPC Provider (Change as needed)        
        const provider = new ethers.JsonRpcProvider(rpcEndpoint);
        const network = await provider.getNetwork();

        const chain = {
            id: parseInt(network.chainId),
            name: `Network ${network.chainId}`,
            rpcUrls: {
                default: {
                    http: [rpcEndpoint], // Replace with your RPC URL
                },
            },
        }


        let playerAddress = (YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address).toLowerCase();
        let delegatorAddress = YeomenAI.ACCOUNT.delegator ? YeomenAI.ACCOUNT.delegator.toLowerCase() : null;
        let delegateeAddress = YeomenAI.ACCOUNT.address ? YeomenAI.ACCOUNT.address.toLowerCase() : null;



        let contractAddress = '0xf5bc2d28d40cd3cfa98e32f7c709b784b743336a';
        let contractABI = [
            {
                "type": "function",
                "name": "areUnitsLeft",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [
                    {
                        "name": "_unitsLeft",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "attackWithArmy",
                "inputs": [
                    {
                        "name": "_location",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "batchCall",
                "inputs": [
                    {
                        "name": "systemCalls",
                        "type": "tuple[]",
                        "internalType": "struct SystemCallData[]",
                        "components": [
                            {
                                "name": "systemId",
                                "type": "bytes32",
                                "internalType": "ResourceId"
                            },
                            {
                                "name": "callData",
                                "type": "bytes",
                                "internalType": "bytes"
                            }
                        ]
                    }
                ],
                "outputs": [
                    {
                        "name": "returnDatas",
                        "type": "bytes[]",
                        "internalType": "bytes[]"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "batchCallFrom",
                "inputs": [
                    {
                        "name": "systemCalls",
                        "type": "tuple[]",
                        "internalType": "struct SystemCallFromData[]",
                        "components": [
                            {
                                "name": "from",
                                "type": "address",
                                "internalType": "address"
                            },
                            {
                                "name": "systemId",
                                "type": "bytes32",
                                "internalType": "ResourceId"
                            },
                            {
                                "name": "callData",
                                "type": "bytes",
                                "internalType": "bytes"
                            }
                        ]
                    }
                ],
                "outputs": [
                    {
                        "name": "returnDatas",
                        "type": "bytes[]",
                        "internalType": "bytes[]"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "buyUnit",
                "inputs": [
                    {
                        "name": "_unitType",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    },
                    {
                        "name": "_amount",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_spendingCap",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "call",
                "inputs": [
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "callData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "payable"
            },
            {
                "type": "function",
                "name": "callFrom",
                "inputs": [
                    {
                        "name": "delegator",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "callData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "payable"
            },
            {
                "type": "function",
                "name": "changeArmySize",
                "inputs": [
                    {
                        "name": "_newSize",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "claimBattleRewards",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "claimDailyGold",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "claimLocationVP",
                "inputs": [
                    {
                        "name": "_locationId",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "claimResources",
                "inputs": [
                    {
                        "name": "_structureType",
                        "type": "uint8",
                        "internalType": "enum StructureType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "claimWarRewards",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "commitRevealLootBox",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "commitUnitsToArmy",
                "inputs": [
                    {
                        "name": "_armyId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_units",
                        "type": "uint32[14]",
                        "internalType": "uint32[14]"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "completeQuest",
                "inputs": [
                    {
                        "name": "_questToComplete",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "concludeWarClaimingPeriod",
                "inputs": [
                    {
                        "name": "_warId",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "contributeToBuilding",
                "inputs": [
                    {
                        "name": "_building",
                        "type": "uint8",
                        "internalType": "enum BuildingType"
                    },
                    {
                        "name": "_resources",
                        "type": "uint256[5]",
                        "internalType": "uint256[5]"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "createArmy",
                "inputs": [
                    {
                        "name": "_size",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_otherCaptains",
                        "type": "address[]",
                        "internalType": "address[]"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "creator",
                "inputs": [],
                "outputs": [
                    {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "dailyGoldLastClaimed",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "declineInvite",
                "inputs": [
                    {
                        "name": "_armyId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "defendWithArmy",
                "inputs": [
                    {
                        "name": "_location",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "deleteRecord",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "disbandArmy",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipChaosChocolate",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_laneY",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipInvincibleIcingIII",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_targetUnit",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipItem",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_item",
                        "type": "uint8",
                        "internalType": "enum ItemType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipPomegranatePulverizer",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_vectorX",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_vectorY",
                        "type": "int32",
                        "internalType": "int32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipQuantumQuicheII",
                "inputs": [
                    {
                        "name": "_firstUnitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_secondUnitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipQuantumQuicheIV",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_secondLaneY",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipSouffleSurge",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_targetUnits",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "_itemType",
                        "type": "uint8",
                        "internalType": "enum ItemType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipStomachBitters",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "equipTabulaRice",
                "inputs": [
                    {
                        "name": "_unitId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_newUnitType",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "getAllStructuresCost",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_structuresCost",
                        "type": "uint256[4][8]",
                        "internalType": "uint256[4][8]"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getAllUnitsPrices",
                "inputs": [],
                "outputs": [
                    {
                        "name": "_prices",
                        "type": "uint256[14]",
                        "internalType": "uint256[14]"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getBattleRewardsToClaim",
                "inputs": [],
                "outputs": [
                    {
                        "name": "_lootboxes",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_rewards",
                        "type": "uint256[5]",
                        "internalType": "uint256[5]"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "getCaptainsBattles",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_battles",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getCurrentBuildingLevel",
                "inputs": [
                    {
                        "name": "_building",
                        "type": "uint8",
                        "internalType": "enum BuildingType"
                    },
                    {
                        "name": "_isTeamRight",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "outputs": [
                    {
                        "name": "_currentLevel",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getCurrentUnitPrice",
                "inputs": [
                    {
                        "name": "_unitType",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    },
                    {
                        "name": "_amount",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "_price",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getDynamicField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getDynamicFieldLength",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getDynamicFieldSlice",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "start",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "end",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "outputs": [
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ],
                "outputs": [
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getFieldLayout",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    }
                ],
                "outputs": [
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getFieldLength",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getFieldLength",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getGeneralArmy",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_generalArmy",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getKeySchema",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    }
                ],
                "outputs": [
                    {
                        "name": "keySchema",
                        "type": "bytes32",
                        "internalType": "Schema"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getPNL",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_size",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_profit",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_loss",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_roiWin",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_roiLose",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getPlayerInventory",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_items",
                        "type": "uint32[69]",
                        "internalType": "uint32[69]"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getPlayerStructures",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_levels",
                        "type": "uint32[3]",
                        "internalType": "uint32[3]"
                    },
                    {
                        "name": "_structures",
                        "type": "uint32[3]",
                        "internalType": "uint32[3]"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getPlayerTitle",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "string",
                        "internalType": "string"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getRecord",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "outputs": [
                    {
                        "name": "staticData",
                        "type": "bytes",
                        "internalType": "bytes"
                    },
                    {
                        "name": "encodedLengths",
                        "type": "bytes32",
                        "internalType": "EncodedLengths"
                    },
                    {
                        "name": "dynamicData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getRecord",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    }
                ],
                "outputs": [
                    {
                        "name": "staticData",
                        "type": "bytes",
                        "internalType": "bytes"
                    },
                    {
                        "name": "encodedLengths",
                        "type": "bytes32",
                        "internalType": "EncodedLengths"
                    },
                    {
                        "name": "dynamicData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getResourcesLastTimeCollected",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_lumberyardLastClaim",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_quarryLastClaim",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_ironMineLastClaim",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getResourcesToClaim",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_wood",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_stone",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_iron",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getStaticField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getTimeToFill",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_lumberyardTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_quarryTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_ironMineTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getValueSchema",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    }
                ],
                "outputs": [
                    {
                        "name": "valueSchema",
                        "type": "bytes32",
                        "internalType": "Schema"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "getWarRewardsToClaim",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_rewards",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "grantAccess",
                "inputs": [
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "grantee",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "guideBookOpened",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "initialize",
                "inputs": [
                    {
                        "name": "initModule",
                        "type": "address",
                        "internalType": "contract IModule"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "installModule",
                "inputs": [
                    {
                        "name": "module",
                        "type": "address",
                        "internalType": "contract IModule"
                    },
                    {
                        "name": "encodedArgs",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "installRootModule",
                "inputs": [
                    {
                        "name": "module",
                        "type": "address",
                        "internalType": "contract IModule"
                    },
                    {
                        "name": "encodedArgs",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "inviteToArmy",
                "inputs": [
                    {
                        "name": "_playerToInvite",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "isKingdomSelected",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_isKingdomSelected",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "isPlayerRegistered",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "_isPlayerRegistered",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "joinArmy",
                "inputs": [
                    {
                        "name": "_armyId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "kickFromArmy",
                "inputs": [
                    {
                        "name": "_playerToKick",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "killAllBattlesPossible",
                "inputs": [],
                "outputs": [
                    {
                        "name": "_anythingToClear",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "killBattle",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "leaveArmy",
                "inputs": [
                    {
                        "name": "_armyId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "multipleProcessing",
                "inputs": [
                    {
                        "name": "_iterations",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "popFromDynamicField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "byteLengthToPop",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "processBattle",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "pushBlock",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "pushToDynamicField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "dataToPush",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerDelegation",
                "inputs": [
                    {
                        "name": "delegatee",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "delegationControlId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "initCallData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerFunctionSelector",
                "inputs": [
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "systemFunctionSignature",
                        "type": "string",
                        "internalType": "string"
                    }
                ],
                "outputs": [
                    {
                        "name": "worldFunctionSelector",
                        "type": "bytes4",
                        "internalType": "bytes4"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerNamespace",
                "inputs": [
                    {
                        "name": "namespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerNamespaceDelegation",
                "inputs": [
                    {
                        "name": "namespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "delegationControlId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "initCallData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerRootFunctionSelector",
                "inputs": [
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "worldFunctionSignature",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "systemFunctionSignature",
                        "type": "string",
                        "internalType": "string"
                    }
                ],
                "outputs": [
                    {
                        "name": "worldFunctionSelector",
                        "type": "bytes4",
                        "internalType": "bytes4"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerStoreHook",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "hookAddress",
                        "type": "address",
                        "internalType": "contract IStoreHook"
                    },
                    {
                        "name": "enabledHooksBitmap",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerSystem",
                "inputs": [
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "system",
                        "type": "address",
                        "internalType": "contract System"
                    },
                    {
                        "name": "publicAccess",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerSystemHook",
                "inputs": [
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "hookAddress",
                        "type": "address",
                        "internalType": "contract ISystemHook"
                    },
                    {
                        "name": "enabledHooksBitmap",
                        "type": "uint8",
                        "internalType": "uint8"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "registerTable",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    },
                    {
                        "name": "keySchema",
                        "type": "bytes32",
                        "internalType": "Schema"
                    },
                    {
                        "name": "valueSchema",
                        "type": "bytes32",
                        "internalType": "Schema"
                    },
                    {
                        "name": "keyNames",
                        "type": "string[]",
                        "internalType": "string[]"
                    },
                    {
                        "name": "fieldNames",
                        "type": "string[]",
                        "internalType": "string[]"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "removeInvite",
                "inputs": [
                    {
                        "name": "_playerToRemove",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "removeUnitsFromArmy",
                "inputs": [
                    {
                        "name": "_armyId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_units",
                        "type": "uint32[14]",
                        "internalType": "uint32[14]"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "renounceOwnership",
                "inputs": [
                    {
                        "name": "namespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "revokeAccess",
                "inputs": [
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "grantee",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "selectKingdom",
                "inputs": [
                    {
                        "name": "_teamRight",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "_title",
                        "type": "string",
                        "internalType": "string"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setArmyReady",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setDynamicField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setHealerBondedUnit",
                "inputs": [
                    {
                        "name": "_healer",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_bondedUnit",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setRecord",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "staticData",
                        "type": "bytes",
                        "internalType": "bytes"
                    },
                    {
                        "name": "encodedLengths",
                        "type": "bytes32",
                        "internalType": "EncodedLengths"
                    },
                    {
                        "name": "dynamicData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "setStaticField",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "fieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    },
                    {
                        "name": "fieldLayout",
                        "type": "bytes32",
                        "internalType": "FieldLayout"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "spawnFreeUnit",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_x",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_y",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_type",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "spawnUnit",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "_x",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_y",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_type",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "spliceDynamicData",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "internalType": "uint8"
                    },
                    {
                        "name": "startWithinField",
                        "type": "uint40",
                        "internalType": "uint40"
                    },
                    {
                        "name": "deleteCount",
                        "type": "uint40",
                        "internalType": "uint40"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "spliceStaticData",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "start",
                        "type": "uint48",
                        "internalType": "uint48"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "storeVersion",
                "inputs": [],
                "outputs": [
                    {
                        "name": "version",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "function",
                "name": "toggleBattlePhase",
                "inputs": [
                    {
                        "name": "_battleId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "transferBalanceToAddress",
                "inputs": [
                    {
                        "name": "fromNamespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "toAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "transferBalanceToNamespace",
                "inputs": [
                    {
                        "name": "fromNamespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "toNamespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "transferOwnership",
                "inputs": [
                    {
                        "name": "namespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "unregisterDelegation",
                "inputs": [
                    {
                        "name": "delegatee",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "unregisterNamespaceDelegation",
                "inputs": [
                    {
                        "name": "namespaceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "unregisterStoreHook",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "hookAddress",
                        "type": "address",
                        "internalType": "contract IStoreHook"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "unregisterSystemHook",
                "inputs": [
                    {
                        "name": "systemId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "hookAddress",
                        "type": "address",
                        "internalType": "contract ISystemHook"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "upgradeStructure",
                "inputs": [
                    {
                        "name": "_slot",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "_structureType",
                        "type": "uint8",
                        "internalType": "enum StructureType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "useReforger",
                "inputs": [
                    {
                        "name": "_items",
                        "type": "uint32[4]",
                        "internalType": "uint32[4]"
                    }
                ],
                "outputs": [
                    {
                        "name": "_randomItem",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_success",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "worldVersion",
                "inputs": [],
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ],
                "stateMutability": "view"
            },
            {
                "type": "event",
                "name": "HelloStore",
                "inputs": [
                    {
                        "name": "storeVersion",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "bytes32"
                    }
                ],
                "anonymous": false
            },
            {
                "type": "event",
                "name": "HelloWorld",
                "inputs": [
                    {
                        "name": "worldVersion",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "bytes32"
                    }
                ],
                "anonymous": false
            },
            {
                "type": "event",
                "name": "Store_DeleteRecord",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "indexed": false,
                        "internalType": "bytes32[]"
                    }
                ],
                "anonymous": false
            },
            {
                "type": "event",
                "name": "Store_SetRecord",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "indexed": false,
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "staticData",
                        "type": "bytes",
                        "indexed": false,
                        "internalType": "bytes"
                    },
                    {
                        "name": "encodedLengths",
                        "type": "bytes32",
                        "indexed": false,
                        "internalType": "EncodedLengths"
                    },
                    {
                        "name": "dynamicData",
                        "type": "bytes",
                        "indexed": false,
                        "internalType": "bytes"
                    }
                ],
                "anonymous": false
            },
            {
                "type": "event",
                "name": "Store_SpliceDynamicData",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "indexed": false,
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "dynamicFieldIndex",
                        "type": "uint8",
                        "indexed": false,
                        "internalType": "uint8"
                    },
                    {
                        "name": "start",
                        "type": "uint48",
                        "indexed": false,
                        "internalType": "uint48"
                    },
                    {
                        "name": "deleteCount",
                        "type": "uint40",
                        "indexed": false,
                        "internalType": "uint40"
                    },
                    {
                        "name": "encodedLengths",
                        "type": "bytes32",
                        "indexed": false,
                        "internalType": "EncodedLengths"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "indexed": false,
                        "internalType": "bytes"
                    }
                ],
                "anonymous": false
            },
            {
                "type": "event",
                "name": "Store_SpliceStaticData",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "keyTuple",
                        "type": "bytes32[]",
                        "indexed": false,
                        "internalType": "bytes32[]"
                    },
                    {
                        "name": "start",
                        "type": "uint48",
                        "indexed": false,
                        "internalType": "uint48"
                    },
                    {
                        "name": "data",
                        "type": "bytes",
                        "indexed": false,
                        "internalType": "bytes"
                    }
                ],
                "anonymous": false
            },
            {
                "type": "error",
                "name": "EncodedLengths_InvalidLength",
                "inputs": [
                    {
                        "name": "length",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "FieldLayout_Empty",
                "inputs": []
            },
            {
                "type": "error",
                "name": "FieldLayout_InvalidStaticDataLength",
                "inputs": [
                    {
                        "name": "staticDataLength",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "computedStaticDataLength",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "FieldLayout_StaticLengthDoesNotFitInAWord",
                "inputs": [
                    {
                        "name": "index",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "FieldLayout_StaticLengthIsNotZero",
                "inputs": [
                    {
                        "name": "index",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "FieldLayout_StaticLengthIsZero",
                "inputs": [
                    {
                        "name": "index",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "FieldLayout_TooManyDynamicFields",
                "inputs": [
                    {
                        "name": "numFields",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "maxFields",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "FieldLayout_TooManyFields",
                "inputs": [
                    {
                        "name": "numFields",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "maxFields",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Module_AlreadyInstalled",
                "inputs": []
            },
            {
                "type": "error",
                "name": "Module_MissingDependency",
                "inputs": [
                    {
                        "name": "dependency",
                        "type": "address",
                        "internalType": "address"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Module_NonRootInstallNotSupported",
                "inputs": []
            },
            {
                "type": "error",
                "name": "Module_RootInstallNotSupported",
                "inputs": []
            },
            {
                "type": "error",
                "name": "Schema_InvalidLength",
                "inputs": [
                    {
                        "name": "length",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Schema_StaticTypeAfterDynamicType",
                "inputs": []
            },
            {
                "type": "error",
                "name": "Slice_OutOfBounds",
                "inputs": [
                    {
                        "name": "data",
                        "type": "bytes",
                        "internalType": "bytes"
                    },
                    {
                        "name": "start",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "end",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_IndexOutOfBounds",
                "inputs": [
                    {
                        "name": "length",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "accessedIndex",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidBounds",
                "inputs": [
                    {
                        "name": "start",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "end",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidFieldNamesLength",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "received",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidKeyNamesLength",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "received",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidResourceType",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "bytes2",
                        "internalType": "bytes2"
                    },
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "resourceIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidSplice",
                "inputs": [
                    {
                        "name": "startWithinField",
                        "type": "uint40",
                        "internalType": "uint40"
                    },
                    {
                        "name": "deleteCount",
                        "type": "uint40",
                        "internalType": "uint40"
                    },
                    {
                        "name": "fieldLength",
                        "type": "uint40",
                        "internalType": "uint40"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidStaticDataLength",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "received",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidValueSchemaDynamicLength",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "received",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidValueSchemaLength",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "received",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_InvalidValueSchemaStaticLength",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "received",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_TableAlreadyExists",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "tableIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "Store_TableNotFound",
                "inputs": [
                    {
                        "name": "tableId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "tableIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_AccessDenied",
                "inputs": [
                    {
                        "name": "resource",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "caller",
                        "type": "address",
                        "internalType": "address"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_AlreadyInitialized",
                "inputs": []
            },
            {
                "type": "error",
                "name": "World_CallbackNotAllowed",
                "inputs": [
                    {
                        "name": "functionSelector",
                        "type": "bytes4",
                        "internalType": "bytes4"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_DelegationNotFound",
                "inputs": [
                    {
                        "name": "delegator",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "delegatee",
                        "type": "address",
                        "internalType": "address"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_FunctionSelectorAlreadyExists",
                "inputs": [
                    {
                        "name": "functionSelector",
                        "type": "bytes4",
                        "internalType": "bytes4"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_FunctionSelectorNotFound",
                "inputs": [
                    {
                        "name": "functionSelector",
                        "type": "bytes4",
                        "internalType": "bytes4"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_InsufficientBalance",
                "inputs": [
                    {
                        "name": "balance",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_InterfaceNotSupported",
                "inputs": [
                    {
                        "name": "contractAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "interfaceId",
                        "type": "bytes4",
                        "internalType": "bytes4"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_InvalidNamespace",
                "inputs": [
                    {
                        "name": "namespace",
                        "type": "bytes14",
                        "internalType": "bytes14"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_InvalidResourceId",
                "inputs": [
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "resourceIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_InvalidResourceType",
                "inputs": [
                    {
                        "name": "expected",
                        "type": "bytes2",
                        "internalType": "bytes2"
                    },
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "resourceIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_ResourceAlreadyExists",
                "inputs": [
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "resourceIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_ResourceNotFound",
                "inputs": [
                    {
                        "name": "resourceId",
                        "type": "bytes32",
                        "internalType": "ResourceId"
                    },
                    {
                        "name": "resourceIdString",
                        "type": "string",
                        "internalType": "string"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_SystemAlreadyExists",
                "inputs": [
                    {
                        "name": "system",
                        "type": "address",
                        "internalType": "address"
                    }
                ]
            },
            {
                "type": "error",
                "name": "World_UnlimitedDelegationNotAllowed",
                "inputs": []
            }
        ];

        let mudConfig = {
            "deploy": {
                "upgradeableWorldImplementation": true
            },
            "enums": {
                "UnitType": [
                    "Bomb",
                    "Blocker",
                    "Archer",
                    "Squire",
                    "Healer",
                    "Mage",
                    "Barbarian",
                    "Alchemist",
                    "Butcher",
                    "Shaman",
                    "Assassin",
                    "Druid",
                    "Spellcannon",
                    "Phantomleech",
                    "Dummy"
                ],
                "BattleState": [
                    "WaitingForOpponent",
                    "Planning",
                    "Battle",
                    "Finished"
                ],
                "WarState": [
                    "Ongoing",
                    "PreSiegePursuit",
                    "Siege",
                    "Finished"
                ],
                "DamageType": [
                    "Melee",
                    "Range",
                    "Skill",
                    "Item"
                ],
                "ButcherSkillStage": [
                    "LongGrab",
                    "ShortGrab",
                    "PowerAttack"
                ],
                "BuildingType": [
                    "BombHouse",
                    "BlockerHouse",
                    "ArcherHouse",
                    "SquireHouse",
                    "HealerHouse",
                    "MageHouse",
                    "BarbarianHouse",
                    "AlchemistHouse",
                    "ButcherHouse",
                    "ShamanHouse",
                    "AssassinHouse",
                    "DruidHouse",
                    "SpellcannonHouse",
                    "PhantomleechHouse"
                ],
                "BattleWinner": [
                    "Unconcluded",
                    "TeamRight",
                    "TeamLeft"
                ],
                "ResourceType": [
                    "Gold",
                    "Wood",
                    "Stone",
                    "Iron",
                    "Sugar"
                ],
                "MapType": [
                    "Warzone",
                    "Grasslands",
                    "MagicForest",
                    "Mountains",
                    "VillageSpooncity",
                    "VillageForktown",
                    "Spooncity",
                    "Forktown"
                ],
                "RarityType": [
                    "Gray",
                    "Green",
                    "Blue",
                    "Purple",
                    "Unique"
                ],
                "CallToArmsStatus": [
                    "NotInvited",
                    "PendingInvite",
                    "Accepted"
                ],
                "ArmyState": [
                    "Idle",
                    "Fighting"
                ],
                "SiegeStage": [
                    "Gates",
                    "Courtyard",
                    "ThroneHall",
                    "Conquered"
                ],
                "ArtilleryType": [
                    "KebabRocket",
                    "MustardGas",
                    "FatMandarin"
                ],
                "ItemType": [
                    "None",
                    "ChiliChopperI",
                    "ChiliChopperII",
                    "ChiliChopperIII",
                    "ChiliChopperIV",
                    "PepperedArrowI",
                    "PepperedArrowII",
                    "PepperedArrowIII",
                    "PepperedArrowIV",
                    "SugarySiegeI",
                    "SugarySiegeII",
                    "SugarySiegeIII",
                    "SugarySiegeIV",
                    "HeartyBrothI",
                    "HeartyBrothII",
                    "HeartyBrothIII",
                    "HeartyBrothIV",
                    "SharpMustardI",
                    "SharpMustardII",
                    "SharpMustardIII",
                    "SharpMustardIV",
                    "SpellcastersSyrup",
                    "ManaMint",
                    "LuckyLemonII",
                    "LuckyLemonIII",
                    "LuckyLemonIV",
                    "BittersweetBlend",
                    "OneBlastBerryIII",
                    "OneBlastBerryIV",
                    "LongReachRelishIII",
                    "LongReachRelishIV",
                    "InvincibleIcingIV",
                    "SouffleSurgeII",
                    "SouffleSurgeIII",
                    "SouffleSurgeIV",
                    "InvincibleIcingIII",
                    "GingerZestRush",
                    "MysteryMarinadeI",
                    "MysteryMarinadeII",
                    "MysteryMarinadeIII",
                    "MysteryMarinadeIV",
                    "EnergizingEspresso",
                    "TabulaRice",
                    "ThymeTonicII",
                    "ThymeTonicIII",
                    "ThymeTonicIV",
                    "StomachBitters",
                    "QuantumQuicheII",
                    "QuantumQuicheIV",
                    "VampiricVinegarII",
                    "VampiricVinegarIII",
                    "VampiricVinegarIV",
                    "RampagingRosemaryII",
                    "RampagingRosemaryIII",
                    "RampagingRosemaryIV",
                    "HeftyHerb",
                    "LicoriceLeap",
                    "LastDitchDillII",
                    "LastDitchDillIII",
                    "LastDitchDillIV",
                    "GhostlyGarlic",
                    "SaffronShield",
                    "DoubleDoughnut",
                    "UntouchableUdon",
                    "HealthHarvestingHoneyIII",
                    "HealthHarvestingHoneyIV",
                    "PomegranatePulverizer",
                    "ResurrectionRaisinRemedy",
                    "ChaosChocolate",
                    "ApocalypticApple"
                ],
                "StructureType": [
                    "None",
                    "Lumberyard",
                    "Quarry",
                    "IronMine",
                    "Scavenger",
                    "Reforger",
                    "RiceFields",
                    "PerpetualStew"
                ]
            },
            "tables": {
                "TeamLeft": {
                    "schema": {
                        "warId": "uint32",
                        "bombHouseLevel": "uint32",
                        "blockerHouseLevel": "uint32",
                        "archerHouseLevel": "uint32",
                        "squireHouseLevel": "uint32",
                        "healerHouseLevel": "uint32",
                        "mageHouseLevel": "uint32",
                        "barbarianHouseLevel": "uint32",
                        "alchemistHouseLevel": "uint32",
                        "butcherHouseLevel": "uint32",
                        "shamanHouseLevel": "uint32",
                        "assassinHouseLevel": "uint32",
                        "druidHouseLevel": "uint32",
                        "spellcannonHouseLevel": "uint32",
                        "phantomleechHouseLevel": "uint32"
                    },
                    "key": [
                        "warId"
                    ]
                },
                "TeamRight": {
                    "schema": {
                        "warId": "uint32",
                        "bombHouseLevel": "uint32",
                        "blockerHouseLevel": "uint32",
                        "archerHouseLevel": "uint32",
                        "squireHouseLevel": "uint32",
                        "healerHouseLevel": "uint32",
                        "mageHouseLevel": "uint32",
                        "barbarianHouseLevel": "uint32",
                        "alchemistHouseLevel": "uint32",
                        "butcherHouseLevel": "uint32",
                        "shamanHouseLevel": "uint32",
                        "assassinHouseLevel": "uint32",
                        "druidHouseLevel": "uint32",
                        "spellcannonHouseLevel": "uint32",
                        "phantomleechHouseLevel": "uint32"
                    },
                    "key": [
                        "warId"
                    ]
                },
                "GlobalBattleStats": {
                    "schema": {
                        "battleId": "bytes32",
                        "isTeamRight": "bool",
                        "unitsPlaced": "uint32"
                    },
                    "key": [
                        "battleId",
                        "isTeamRight"
                    ]
                },
                "PlayerBattleStats": {
                    "schema": {
                        "player": "address",
                        "battleId": "bytes32",
                        "unitsPlaced": "uint32"
                    },
                    "key": [
                        "player",
                        "battleId"
                    ]
                },
                "Gold": {
                    "schema": {
                        "battleGoldEmitted": "uint256"
                    },
                    "key": []
                },
                "Lootboxes": {
                    "schema": {
                        "owner": "address",
                        "commitBlock": "uint256"
                    },
                    "key": [
                        "owner"
                    ]
                },
                "ProcessParams": {
                    "schema": {
                        "battleId": "bytes32",
                        "leftProcessIndex": "uint32",
                        "rightProcessIndex": "uint32",
                        "leftMaxIndex": "uint32",
                        "rightMaxIndex": "uint32",
                        "leftProcessFinished": "bool",
                        "rightProcessFinished": "bool",
                        "leftNoUnitsLeft": "bool",
                        "rightNoUnitsLeft": "bool",
                        "deleteBatchSize": "uint32"
                    },
                    "key": [
                        "battleId"
                    ]
                },
                "Units": {
                    "schema": {
                        "id": "bytes32",
                        "battleId": "bytes32",
                        "unitType": "UnitType",
                        "x": "uint32",
                        "y": "uint32",
                        "hp": "int32",
                        "maxHp": "int32",
                        "mana": "int32",
                        "manaRegen": "int32",
                        "castMana": "int32",
                        "maxMana": "int32",
                        "isTeamRight": "bool",
                        "owner": "address",
                        "level": "uint32",
                        "title": "string"
                    },
                    "key": [
                        "id"
                    ]
                },
                "UnitsCombat": {
                    "schema": {
                        "id": "bytes32",
                        "meleeDamage": "int32",
                        "rangeDamage": "int32",
                        "critDamage": "int32",
                        "critChance": "uint32",
                        "gateDamage": "int32",
                        "attackRange": "uint32",
                        "item": "uint32"
                    },
                    "key": [
                        "id"
                    ]
                },
                "UnitsSkillsModifiers": {
                    "schema": {
                        "isTeamRight": "bool",
                        "shamanDamageIncrease": "int32",
                        "shamanBonusDamagePercent": "int32",
                        "shamanManaSteal": "int32",
                        "butcherDamageIncreaseThirdStage": "int32",
                        "butcherHealAmount": "int32",
                        "healerHealAmount": "int32",
                        "healerBondedUnitHealIncrease": "int32",
                        "squireDamageIncrease": "int32",
                        "bombCritDamageIncrease": "int32",
                        "bombCritChanceIncrease": "uint32",
                        "archerDamageIncrease": "int32",
                        "mageSubtargetsDamage": "int32",
                        "mageManaGenerationForCrit": "int32",
                        "alchemistManaHeal": "int32",
                        "alchemistPoisonMaxStacks": "int32",
                        "alchemistShroomRange": "uint32",
                        "alchemistShroomDamage": "int32",
                        "assassinGateDamageIncrease": "int32",
                        "assassinSkillDamageIncrease": "int32",
                        "spellCannonDamageIncrease": "int32",
                        "spellCannonSkillHitChancePercentage": "uint32",
                        "spellCannonTargetsCount": "uint32",
                        "phantomleechManaDrain": "int32",
                        "phantomleechGateDamageManaTreshold": "int32",
                        "phantomleechGateDamageOnSkill": "int32",
                        "barbarianDamegePercentPerHit": "int32",
                        "barbarianDamageSumDealtIntoGatePercent": "int32",
                        "druidBuffAmount": "int32"
                    },
                    "key": [
                        "isTeamRight"
                    ]
                },
                "UnitConstants": {
                    "schema": {
                        "unitType": "UnitType",
                        "hp": "int32",
                        "mana": "int32",
                        "manaRegen": "int32",
                        "castMana": "int32",
                        "maxMana": "int32",
                        "meleeDamage": "int32",
                        "rangeDamage": "int32",
                        "critDamage": "int32",
                        "critChance": "uint32",
                        "gateDamage": "int32",
                        "attackRange": "uint32"
                    },
                    "key": [
                        "unitType"
                    ]
                },
                "ItemRarityConstants": {
                    "schema": {
                        "grayItems": "uint32[9]",
                        "greenItems": "uint32[17]",
                        "blueItems": "uint32[21]",
                        "purpleItems": "uint32[20]",
                        "uniqueItems": "uint32[2]"
                    },
                    "key": []
                },
                "UnitUpgrade": {
                    "schema": {
                        "buildingType": "UnitType",
                        "isTeamRight": "bool",
                        "level": "uint32",
                        "hp": "int32",
                        "mana": "int32",
                        "manaRegen": "int32",
                        "castMana": "int32",
                        "meleeDamage": "int32",
                        "rangeDamage": "int32",
                        "critDamage": "int32",
                        "critChance": "uint32",
                        "gateDamage": "int32",
                        "attackRange": "uint32",
                        "skillModifier": "int32"
                    },
                    "key": [
                        "buildingType",
                        "isTeamRight"
                    ]
                },
                "MapUnits": {
                    "schema": {
                        "battleId": "bytes32",
                        "x": "uint32",
                        "y": "uint32",
                        "unitId": "bytes32"
                    },
                    "key": [
                        "battleId",
                        "x",
                        "y"
                    ]
                },
                "LeftQueue": {
                    "schema": {
                        "id": "uint32",
                        "battleId": "bytes32",
                        "unitId": "bytes32"
                    },
                    "key": [
                        "id",
                        "battleId"
                    ]
                },
                "RightQueue": {
                    "schema": {
                        "id": "uint32",
                        "battleId": "bytes32",
                        "unitId": "bytes32"
                    },
                    "key": [
                        "id",
                        "battleId"
                    ]
                },
                "Randomness": {
                    "schema": {
                        "blockNumber": "uint256",
                        "value": "uint256",
                        "randomnessActive": "bool"
                    },
                    "key": []
                },
                "ButcherSkillSequence": {
                    "schema": {
                        "id": "bytes32",
                        "stage": "ButcherSkillStage"
                    },
                    "key": [
                        "id"
                    ]
                },
                "DruidForm": {
                    "schema": {
                        "id": "bytes32",
                        "isBear": "bool"
                    },
                    "key": [
                        "id"
                    ]
                },
                "BarbarianTargets": {
                    "schema": {
                        "barbarian": "bytes32",
                        "target": "bytes32",
                        "hitCount": "int32",
                        "totalDamageDealt": "int32"
                    },
                    "key": [
                        "barbarian"
                    ]
                },
                "HealerTarget": {
                    "schema": {
                        "healer": "bytes32",
                        "bondedTarget": "bytes32"
                    },
                    "key": [
                        "healer"
                    ]
                },
                "PhantomleechManaDrain": {
                    "schema": {
                        "id": "bytes32",
                        "manaDrained": "int32"
                    },
                    "key": [
                        "id"
                    ]
                },
                "PoisonedUnits": {
                    "schema": {
                        "id": "bytes32",
                        "poisonStack": "int32"
                    },
                    "key": [
                        "id"
                    ]
                },
                "PoisonDamage": {
                    "schema": {
                        "id": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "PomegranatePulverizer": {
                    "schema": {
                        "id": "bytes32",
                        "x": "uint32",
                        "y": "uint32",
                        "thrown": "bool"
                    },
                    "key": [
                        "id"
                    ]
                },
                "InvincibleIcingIIITarget": {
                    "schema": {
                        "ownerId": "bytes32",
                        "target": "bytes32"
                    },
                    "key": [
                        "ownerId"
                    ]
                },
                "SouffleSurgeTargets": {
                    "schema": {
                        "ownerId": "bytes32",
                        "itemType": "ItemType",
                        "targets": "bytes32[]"
                    },
                    "key": [
                        "ownerId"
                    ]
                },
                "ChaosChocolateTargetLane": {
                    "schema": {
                        "ownerId": "bytes32",
                        "lane": "uint32"
                    },
                    "key": [
                        "ownerId"
                    ]
                },
                "UnitDesign": {
                    "schema": {
                        "id": "bytes32",
                        "damageDealt": "int32",
                        "damageHealed": "int32",
                        "manaGained": "int32"
                    },
                    "key": [
                        "id"
                    ]
                },
                "UnitTypeDesign": {
                    "schema": {
                        "unitType": "UnitType",
                        "damageDealt": "int32",
                        "damageHealed": "int32",
                        "manaGained": "int32"
                    },
                    "key": [
                        "unitType"
                    ]
                },
                "Buildings": {
                    "schema": {
                        "building": "BuildingType",
                        "isTeamRight": "bool",
                        "totalResourcesStaked": "uint256[5]"
                    },
                    "key": [
                        "building",
                        "isTeamRight"
                    ]
                },
                "VillageStructures": {
                    "schema": {
                        "player": "address",
                        "level": "uint32[3]",
                        "structureType": "uint32[3]"
                    },
                    "key": [
                        "player"
                    ]
                },
                "Generators": {
                    "schema": {
                        "player": "address",
                        "generator": "StructureType",
                        "lastTimeCollected": "uint256"
                    },
                    "key": [
                        "player",
                        "generator"
                    ]
                },
                "Players": {
                    "schema": {
                        "player": "address",
                        "isTeamRight": "bool",
                        "lootboxes": "uint32",
                        "ArmyGeneral": "bytes32",
                        "latestWarId": "uint32",
                        "votingPowerSpent": "uint256",
                        "warPrisoners": "uint32",
                        "title": "string",
                        "items": "uint32[69]",
                        "resources": "uint256[5]",
                        "units": "uint32[14]",
                        "ArmyCaptain": "bytes32[]"
                    },
                    "key": [
                        "player"
                    ]
                },
                "Rewards": {
                    "schema": {
                        "player": "address",
                        "lootboxes": "uint32",
                        "battleRewards": "uint256[5]"
                    },
                    "key": [
                        "player"
                    ]
                },
                "Army": {
                    "schema": {
                        "armyId": "bytes32",
                        "warId": "uint32",
                        "size": "uint32",
                        "armyState": "ArmyState",
                        "captains": "address[]",
                        "pendingInvitations": "address[]"
                    },
                    "key": [
                        "armyId"
                    ]
                },
                "Captain": {
                    "schema": {
                        "player": "address",
                        "armyId": "bytes32",
                        "commitedUnits": "uint32[14]",
                        "reservesUnits": "uint32[14]"
                    },
                    "key": [
                        "player",
                        "armyId"
                    ]
                },
                "CallToArms": {
                    "schema": {
                        "captain": "address",
                        "armyId": "bytes32",
                        "status": "CallToArmsStatus"
                    },
                    "key": [
                        "captain",
                        "armyId"
                    ]
                },
                "Locations": {
                    "schema": {
                        "id": "uint32",
                        "isTeamRight": "bool",
                        "hp": "int32",
                        "maxHp": "int32",
                        "width": "uint32",
                        "height": "uint32",
                        "resource": "ResourceType",
                        "lastClaimVp": "uint256",
                        "mapType": "MapType",
                        "neighbours": "uint32[]",
                        "ongoingBattles": "bytes32[]"
                    },
                    "key": [
                        "id"
                    ]
                },
                "Artillery": {
                    "schema": {
                        "isTeamRight": "bool",
                        "warId": "uint32",
                        "kebabRocket": "uint256[4]",
                        "mustardGas": "uint256[4]",
                        "fatMandarin": "uint256[4]",
                        "allocation": "uint256[3]"
                    },
                    "key": [
                        "warId",
                        "isTeamRight"
                    ]
                },
                "War": {
                    "schema": {
                        "warId": "uint32",
                        "winnerTeamRight": "bool",
                        "startTime": "uint256",
                        "leftVictoryPoints": "uint32",
                        "rightVictoryPoints": "uint32",
                        "warState": "WarState",
                        "leftCapitalId": "uint32",
                        "rightCapitalId": "uint32",
                        "goldClaimed": "uint256"
                    },
                    "key": [
                        "warId"
                    ]
                },
                "WarStats": {
                    "schema": {
                        "warId": "uint32",
                        "leftTreasury": "uint256",
                        "rightTreasury": "uint256",
                        "unitsBought": "uint256[14]"
                    },
                    "key": [
                        "warId"
                    ]
                },
                "PlayerContribution": {
                    "schema": {
                        "player": "address",
                        "warId": "uint256",
                        "gold": "uint256",
                        "unitsPlaced": "uint32",
                        "unitsBought": "uint32"
                    },
                    "key": [
                        "player",
                        "warId"
                    ]
                },
                "Siege": {
                    "schema": {
                        "warId": "uint32",
                        "stage": "SiegeStage",
                        "roundsPlayed": "uint32",
                        "teamLeftPointsCurrentStage": "uint32",
                        "teamRightPointsCurrentStage": "uint32",
                        "roundStartTime": "uint256"
                    },
                    "key": [
                        "warId"
                    ]
                },
                "SiegeGoldSpent": {
                    "schema": {
                        "warId": "uint32",
                        "goldSpent": "uint256"
                    },
                    "key": [
                        "warId"
                    ]
                },
                "Battles": {
                    "schema": {
                        "id": "bytes32",
                        "warId": "bytes32",
                        "winner": "BattleWinner",
                        "initTime": "uint256",
                        "battleState": "BattleState",
                        "leftGateHp": "int32",
                        "rightGateHp": "int32",
                        "gateBleed": "int32",
                        "location": "uint32",
                        "defenderUnitPlaced": "bool",
                        "attackingArmy": "bytes32",
                        "defendingArmy": "bytes32",
                        "leftReady": "bool",
                        "rightReady": "bool",
                        "publicDefenders": "address[]"
                    },
                    "key": [
                        "id"
                    ]
                },
                "WarConfig": {
                    "schema": {
                        "warId": "uint32",
                        "battleId": "uint32"
                    },
                    "key": []
                },
                "QuestRequirements": {
                    "schema": {
                        "questId": "uint32",
                        "requirement": "uint32",
                        "nextQuests": "uint32[]"
                    },
                    "key": [
                        "questId"
                    ]
                },
                "PlayerQuestProgress": {
                    "schema": {
                        "player": "address",
                        "questId": "uint32",
                        "progress": "uint32",
                        "unlocked": "bool",
                        "completed": "bool"
                    },
                    "key": [
                        "player",
                        "questId"
                    ]
                },
                "DailyQuests": {
                    "schema": {
                        "player": "address",
                        "dailyGoldLastClaimed": "uint256"
                    },
                    "key": [
                        "player"
                    ]
                },
                "LocationBattleFinished": {
                    "schema": {
                        "locationId": "uint32",
                        "battleId": "bytes32",
                        "damageDealt": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "KebabRocketLaunched": {
                    "schema": {
                        "warId": "uint32",
                        "isTeamRight": "bool",
                        "victoryPoints": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "MustardGasLaunched": {
                    "schema": {
                        "warId": "uint32",
                        "locationId": "uint32",
                        "isTeamRight": "bool",
                        "hpDecrease": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "FatMandarinLaunched": {
                    "schema": {
                        "warId": "uint32",
                        "locationId": "uint32",
                        "isTeamRight": "bool",
                        "manaRegenDecrease": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "PlanningPhase": {
                    "schema": {
                        "planningId": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "BattlePhase": {
                    "schema": {
                        "battleId": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "UnitSpawned": {
                    "schema": {
                        "unitId": "bytes32",
                        "unitType": "UnitType",
                        "x": "uint32",
                        "y": "uint32",
                        "cost": "uint256"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "UnitMoved": {
                    "schema": {
                        "unitId": "bytes32",
                        "x": "uint32",
                        "y": "uint32",
                        "newX": "uint32",
                        "newY": "uint32",
                        "isQuiched": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "MeleeAttack": {
                    "schema": {
                        "attacker": "bytes32",
                        "defender": "bytes32",
                        "damage": "int32",
                        "isCrit": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "RangeAttack": {
                    "schema": {
                        "attacker": "bytes32",
                        "defender": "bytes32",
                        "damage": "int32",
                        "isCrit": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "GateAttack": {
                    "schema": {
                        "unitId": "bytes32",
                        "isTeamRightGate": "bool",
                        "damage": "int32",
                        "killUnit": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "BarbarianDetonate": {
                    "schema": {
                        "unitId": "bytes32",
                        "damage": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "BattleFinished": {
                    "schema": {
                        "winner": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ProcessingUnit": {
                    "schema": {
                        "unitId": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "IterationFinished": {
                    "schema": {
                        "leftIndex": "uint32",
                        "rightIndex": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "PlayerDonated": {
                    "schema": {
                        "player": "address",
                        "isTeamRight": "bool",
                        "building": "BuildingType",
                        "resources": "uint256[5]"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "GeneratorResourcesCollected": {
                    "schema": {
                        "player": "address",
                        "wood": "uint256",
                        "stone": "uint256",
                        "iron": "uint256"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "HealerSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "unit1": "bytes32",
                        "unit2": "bytes32",
                        "unit3": "bytes32",
                        "unit4": "bytes32",
                        "unit5": "bytes32",
                        "hasBondedUnit": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ArcherSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "target1": "bytes32",
                        "dmg1": "int32",
                        "target2": "bytes32",
                        "dmg2": "int32",
                        "target3": "bytes32",
                        "dmg3": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "SquireSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "target1": "bytes32",
                        "target2": "bytes32",
                        "dmg": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "BombSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "unit1": "bytes32",
                        "unit2": "bytes32",
                        "unit3": "bytes32",
                        "unit4": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "BlockerSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "target": "bytes32",
                        "reflectedDamage": "int32",
                        "isCrit": "bool",
                        "damageType": "DamageType"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "MageSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "target1": "bytes32",
                        "target2": "bytes32",
                        "target3": "bytes32",
                        "target4": "bytes32",
                        "isCrit": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "BarbarianSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "newPercentageDamage": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "AlchemistSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "targets0": "bytes32[]",
                        "targets1": "bytes32[]",
                        "targets2": "bytes32[]",
                        "targets3": "bytes32[]"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ButcherSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "stage": "ButcherSkillStage",
                        "target": "bytes32",
                        "newTargetX": "uint32",
                        "reorderedUnit": "bytes32",
                        "reorderedUnitNewX": "uint32",
                        "healAmount": "int32",
                        "damage": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ShamanSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "changesToMelee": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "AssassinGateDamageIncrease": {
                    "schema": {
                        "unitId": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "AssassinSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "newX": "uint32",
                        "target": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "DruidSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "changedToBear": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "DruidBuffs": {
                    "schema": {
                        "druid": "bytes32",
                        "target1": "bytes32",
                        "target2": "bytes32",
                        "isHeal": "bool",
                        "value": "int32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "CannonSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "targets": "bytes32[]"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "PhantomleechSkill": {
                    "schema": {
                        "casterId": "bytes32",
                        "unit1": "bytes32",
                        "unit2": "bytes32",
                        "unit3": "bytes32",
                        "unit4": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "EnergizingEspressoUsed": {
                    "schema": {
                        "unitId": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "PlayerReceivedItem": {
                    "schema": {
                        "player": "address",
                        "item": "ItemType"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ResurectionRaisinUsed": {
                    "schema": {
                        "unitId": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ApocalypticAppleUsed": {
                    "schema": {
                        "ownerId": "bytes32",
                        "yCoordintate": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "GrenadeThrown": {
                    "schema": {
                        "itemOwner": "bytes32",
                        "targetX": "uint32",
                        "targetY": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "OneBlastBerryUsed": {
                    "schema": {
                        "itemOwner": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "ChaosChocolateUsed": {
                    "schema": {
                        "ownerId": "bytes32",
                        "lane": "uint32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "InvincibleIcingUsed": {
                    "schema": {
                        "ownerId": "bytes32",
                        "target": "bytes32",
                        "lane": "uint32",
                        "isTierIV": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "SouffleSurgeUsed": {
                    "schema": {
                        "ownerId": "bytes32",
                        "targets": "bytes32[]"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "QuantumQuicheUsed": {
                    "schema": {
                        "ownerId": "bytes32",
                        "target": "bytes32",
                        "lane": "uint32",
                        "isTierIV": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "StomachBittersUsed": {
                    "schema": {
                        "ownerId": "bytes32"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "TabulaRiceUsed": {
                    "schema": {
                        "ownerId": "bytes32",
                        "previousType": "UnitType",
                        "newType": "UnitType"
                    },
                    "type": "offchainTable",
                    "key": []
                },
                "LootboxOpened": {
                    "schema": {
                        "player": "address",
                        "item0": "uint32",
                        "item1": "uint32",
                        "item2": "uint32",
                        "item3": "uint32"
                    },
                    "type": "offchainTable",
                    "key": [
                        "player"
                    ]
                },
                "ReforgerUsed": {
                    "schema": {
                        "player": "address",
                        "item": "uint32",
                        "isSuccess": "bool"
                    },
                    "type": "offchainTable",
                    "key": []
                }
            }
        };

        let GRAPHQL_SCHEMA = 'ai_0xf5bc2d28d40cd3cfa98e32f7c709b784b743336a_';



        let GAME_DOCUMENT = documents['yeomen/bfb_kb'] || null;
        if (!GAME_DOCUMENT)
            throw new Error('Game document not provided')

        /**
         * AI-Driven Task Executor
         */
        class YeomenAIPlanner extends EventEmitter {
            goal = "";
            goalResponse = null;
            steps = [];
            pastSteps = [];
            executing = false;
            canceled = false;
            replan = false; // Switch to replan after executing the first step  

            baseMessages = []; // Base messages array to be used in AI prompt


            // Tools Definitions
            tools = [
                {
                    type: "function",
                    function: {
                        name: "plan",
                        description: "Generate an ordered list of steps to achieve a goal.",
                        parameters: {
                            type: "object",
                            properties: {
                                steps: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Ordered steps to follow.",
                                },
                            },
                            required: ["steps"],
                        },
                    },
                },
                {
                    "type": "function",
                    "function": {
                        "name": "planResponse",
                        "description": "The final plan response to the user.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "response": {
                                    "type": "string",
                                    "description": "Response to user."
                                }
                            },
                            "required": [
                                "response"
                            ],
                            "additionalProperties": false,
                            "$schema": "http://json-schema.org/draft-07/schema#"
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "stepResponse",
                        "description": "The response to the step.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "response": {
                                    "type": "string",
                                    "description": "Response to step."
                                }
                            },
                            "required": [
                                "response"
                            ],
                            "additionalProperties": false,
                            "$schema": "http://json-schema.org/draft-07/schema#"
                        }
                    }
                }, 
            ];

            // Tool Handlers
            toolHandlers = {};


            constructor() {
                super();

                this.goal = ""; // Initialize goal
                this.steps = [];
                this.pastSteps = [];
                this.executing = false;
                this.canceled = false;
                this.baseMessages = []; // Initialize messages
            }

            emit(event, ...args) {
                super.emit(event, ...args);
                // Emit a global '*' event that catches all other events
                super.emit('*', event, ...args);
            }

            /**
             * Set the base messages for the AI prompt
             */
            setBaseMessages(messages) {
                if (Array.isArray(messages)) {
                    // If it's an array, push each message into the messages array
                    this.baseMessages.push(...messages);
                } else if (typeof messages === "object") {
                    // If it's a single object, push it into the messages array
                    this.baseMessages.push(messages);
                } else {
                    console.error("❌ Invalid input: Expected an array or an object.");
                }
            }

            /**
             * Adds one or multiple tools to the tools list.
             * Ensures no duplicate tools are added based on function name.
             *
             */
            addTool(toolOrTools) {
                const tools = Array.isArray(toolOrTools) ? toolOrTools : [toolOrTools];

                for (const tool of tools) {
                    const toolName = tool.function.name;
                    if (this.tools.some(t => t.function.name === toolName)) {
                        throw new Error(`Tool name ${toolName} conflicts with a tool already exists.`);
                    }

                    this.tools.push(tool);
                }
            }

            /**
             * Registers a handler for a specific tool.
             * Ensures no duplicate handlers are registered for the same tool.
             *
             */
            registerToolHandler(toolName, handler) {
                if (this.toolHandlers[toolName]) {
                    throw new Error(`Cannot register handler for tool ${toolName}, already exists.`);
                }
                this.toolHandlers[toolName] = handler;
            }


            /**
             * Generate a plan using OpenAI
             */
            async createPlan() {
                console.log(`📝 Creating plan for: "${this.goal}"`);
                this.canceled = false;

                let messages = [
                    ...this.baseMessages,
                    {
                        role: "user",
                        content: `
                    For the given objective, come up with a simple step by step plan. 
                    This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps.
                    The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.                        

                    ${this.goal}
                ` }
                ];

                try {

                    const response = await YeomenAI.Intelligence.call({
                        messages: messages,
                        tools: this.tools,
                        tool_choice: { "type": "function", "function": { "name": "plan" } },
                    });

                    const toolCalls = response.choices[0].message.tool_calls || [];
                    for (const toolCall of toolCalls) {
                        if (toolCall.function.name === "plan") {
                            this.steps = JSON.parse(toolCall.function.arguments).steps;
                            console.log("✅ Plan created:", this.steps);

                            this.planId = Date.now(); // Generate a unique execution ID
                            this.emit("plan:created", {
                                planId: this.planId,
                                steps: this.steps
                            });


                            return this.steps;
                        }
                    }

                    throw new Error("No valid plan received.");
                } catch (error) {
                    console.error("❌ Error creating plan:", error.message);
                    this.emit("plan:error", {
                        error: error
                    });
                }
            }

            /**
             * Execute the plan step by step
             */
            async executePlan() {
                try {
                    if (!this.steps || this.steps.length === 0) {
                        console.log("⚠️ No plan available to execute.");
                        throw new Error("No plan available to execute.");
                        //return;
                    }


                    const currentPlanId = this.planId;

                    this.executing = true;
                    this.replan = false;
                    console.log("🚀 Starting execution...");

                    this.emit("plan:started", {
                        planId: this.planId
                    });

                    for (const step of this.steps) {
                        if (this.canceled) {
                            console.log("⏹ Execution canceled.");
                            return;
                        }

                        // If a replan has occurred, exit early
                        if (this.planId !== currentPlanId) {
                            //console.log("🔄 New plan detected, stopping old execution.");
                            return;
                        }

                        try {
                            console.log(`➡️ Executing: ${step}`);
                            await this.executeStep(step);

                            // If a replan occurred, stop executing the current plan
                            if (this.planId !== currentPlanId) {
                                //console.log("🔄 Execution halted due to replan.");
                                return;
                            }

                            this.replan = true;
                        } catch (error) {
                            console.error(`❌ Error in step "${step}":`, error.message);
                            return;
                        }
                    }


                    this.emit("plan:completed", {
                        planId: this.planId
                    });



                    console.log("🎉 Execution completed!");

                    this.executing = false;
                    this.replan = false;

                } catch (error) {
                    console.error("❌ Error executing plan:", error.message);
                    this.emit("plan:error", {
                        error: error
                    });
                }
            }

            /**
             * Execute an individual step (AI-decided tool execution)
             */
            async executeStep(step) {
                const currentPlanId = this.planId; // Store current execution ID

                this.emit("step:started", {
                    planId: this.planId,
                    step: step
                });

                let messages = [
                    ...this.baseMessages,
                    {
                        role: "user", content:
                            !this.replan ?
                                `Step: ${step}`
                                :
                                `
                        For the given objective, come up with a simple step by step plan. 
                        This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps.
                        The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.
                    
                        Your objective was this:
                        ${this.goal}

                        Your original plan was this:
                        ${this?.steps?.length ? this.steps.join(`\n`) : ""}

                        You have currently done the following steps:
                        ${this?.pastSteps?.length ? this.pastSteps.map((pastStep) => pastStep.join(`:`)).join(`\n`) : ""}

                        Update your plan accordingly. If no more steps are needed to answer the objective, you can return to the user by using the 'planResponse' function without completing the remaining steps.
                        Otherwise, fill out the plan.  
                        Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan. 
                        `
                    }
                ];
                console.log(`➡️ Model Request: ${JSON.stringify(messages)}`)
                this.emit("model:request", {
                    message: messages[messages.length - 1]
                });
                const response = await YeomenAI.Intelligence.call({
                    messages: messages,
                    tools: this.tools,
                    tool_choice: "required",
                });

                const message = response.choices[0].message;
                messages.push(message);
                console.log(`⬅️ Model Response: ${JSON.stringify(message)}`)
                this.emit("model:response", {
                    message: messages[messages.length - 1]
                });

                const toolCalls = message.tool_calls || [];

                for (const toolCall of toolCalls) {
                    let toolCallResponse;
                    const toolName = toolCall.function.name;
                    const args = JSON.parse(toolCall.function.arguments);
                    console.log(toolName, args)
                    if (toolName === "plan") {
                        this.steps = JSON.parse(toolCall.function.arguments).steps;
                        console.log("✅ New Plan created:", this.steps);

                        this.planId = Date.now(); // Update execution ID to invalidate old loops
                        this.emit("plan:created", {
                            planId: this.planId,
                            steps: this.steps
                        });

                        await this.executePlan();// Restart the execution of the updated plan
                        return; // Prevent further execution as the new plan will be reprocessed
                    } else if (toolName === "planResponse") {
                        toolCallResponse = JSON.parse(toolCall.function.arguments).response;
                        this.emit("plan:response", {
                            planId: this.planId,
                            response: toolCallResponse
                        });
                        console.log("Plan Response Received:", response);
                    } else if (toolName === "stepResponse") {
                        toolCallResponse = JSON.parse(toolCall.function.arguments).response;
                        this.emit("step:response", {
                            response: toolCallResponse
                        });
                        console.log("Step Response Received:", toolCallResponse);
                    } else {
                        console.log('Tool Handler', toolName, args)
                        const toolHandler = this.toolHandlers[toolName];
                        if (toolHandler) {
                            toolCallResponse = await toolHandler(args);
                        } else {
                            toolCallResponse = `Tool ${toolName} not found.`;
                        }

                        this.emit("tool:response", {
                            toolName: toolName,
                            args: args,
                            response: toolCallResponse
                        });
                    }

                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(toolCallResponse, JSONBigNumberReplacer)
                    });
                }
                console.log(`➡️ Model Request: ${JSON.stringify(messages)}`)
                this.emit("model:request", {
                    message: messages[messages.length - 1]
                });
                const response2 = await YeomenAI.Intelligence.call({
                    messages: messages,
                    tools: this.tools,
                    tool_choice: "none",
                });

                let stepResponse = response2.choices[0].message.content;
                console.log(`⬅️ Model Response: ${stepResponse}`);
                this.emit("model:response", {
                    message: response2.choices[0].message
                });

                this.emit("step:completed", {
                    planId: this.planId,
                    step: step,
                    response: stepResponse
                });

                // Ensure we only track steps from the latest execution
                if (this.planId === currentPlanId) {
                    this.pastSteps.push([step, stepResponse]);
                    this.steps = this.steps.slice(1);
                }


            }


            setGoal(goal) {
                this.goal = goal;
                this.emit("goal:set", {
                    goal: this.goal
                });
            }

            async generateGoalResponse() {


                let messages = [
                    //...this.baseMessages,
                    {
                        role: "user", content:
                            `
                Provide an answer to the objective if possible from steps below.

                **Objective:**  
                ${this.goal}

                **Steps Completed:**  
                ${this?.pastSteps?.length ? this.pastSteps.map((pastStep) => `- ${pastStep[0]}: ${pastStep[1]}`).join(`\n`) : "No steps completed yet."}

                    `
                    }
                ];

                const response = await YeomenAI.Intelligence.call({
                    messages: messages,
                    tools: this.tools,
                    tool_choice: "none",
                });

                this.goalResponse = response.choices[0].message.content;
                this.setBaseMessages(response.choices[0].message);//Store final response 

                this.emit("goal:response", {
                    goal: this.goal,
                    response: this.goalResponse
                });

                console.log(`🎉 Goal response: ${this.goalResponse}`);
            }

            getGoalResponse() {
                return this.goalResponse;
            }


            /**
             * Run the full process
             */
            async run() {
                //this.goal = goal;
                this.steps = [];
                this.pastSteps = [];
                this.executing = false;
                this.canceled = false;
                this.replan = false;

                console.log("🎯 Goal received:", this.goal);
                await this.createPlan();
                if (this.steps.length > 0) {
                    await this.executePlan();
                    await this.generateGoalResponse();
                }
            }
        }

        let markdown = ``;

        const yeomenAIPlanner = new YeomenAIPlanner();

        yeomenAIPlanner.on('*', async (event, payload) => {
            console.log(`${event} ->`, payload);

            switch (event) {
                case 'goal:set':
                    markdown += `🎯 Goal Set: ${payload.goal}   \n\n`;
                    break;
                case 'plan:created':
                    markdown += `📝 Plan Created (ID: ${payload.planId})    \n\n`;
                    markdown += `   Steps to follow:    \n\n`;
                    payload.steps.forEach((step, index) => {
                        markdown += `       ${step}  \n`;
                    });
                    break;
                case 'plan:started':
                    markdown += `🚀 Executing the plan (ID: ${payload.planId})   \n\n`;
                    break;
                case 'plan:completed':
                    markdown += `🎉 Plan Completed (ID: ${payload.planId})   \n\n`;
                    break;
                case 'step:started':
                    markdown += `⏳ Executing step: ${payload.step}   \n\n`;
                    break;
                case 'step:completed':
                    markdown += `✅ Step Completed: ${payload.step}   \n\n`;
                    if (payload.response) {
                        markdown += `   ${payload.response}   \n\n`;
                    }
                    break;
                case 'goal:response':
                    markdown += `🏆 Goal: ${payload.goal}   \n\n`;
                    if (payload.response) {
                        markdown += `   ${payload.response}   \n\n`;
                    }
                    break;
                default:
                    if (YeomenAI.DEVELOPER_MODE)
                        markdown += `🔹 ${event}: ${JSON.stringify(payload, JSONBigNumberReplacer)}  \n\n`;
                    break;
            }

            await YeomenAI.markdown(markdown);

        });


        yeomenAIPlanner.setBaseMessages(
            [
                { role: 'developer', content: GAME_DOCUMENT },
                {
                    role: "user", content: `
                  # Current Game State
                    ${JSON.stringify({
                        playerAddress,
                        delegatorAddress,
                        delegateeAddress
                    })}
                  `
                }
            ]
        );

        yeomenAIPlanner.addTool([           
            {
                type: "function",
                function: {
                    name: "queryGraphQL",
                    description: "Queries the GraphQL API for data.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: { type: "string", description: "The GraphQL query string." },
                            variables: {
                                type: "object",
                                description: "The GraphQL variables to bind on query.",
                                additionalProperties: true,
                            },
                        },
                        required: ["query"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "getContractData",
                    description: "Reads data from a smart contract.",
                    parameters: {
                        type: "object",
                        properties: {
                            contractAddress: { type: "string", description: "The contract address." },
                            functionName: { type: "string", description: "The function name to call." },
                            args: { type: "array", description: "Arguments for the function.", items: {} },
                        },
                        required: ["contractAddress", "functionName", "args"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "executeTransaction",
                    description: "Executes a transaction on the blockchain.",
                    parameters: {
                        type: "object",
                        properties: {
                            contractAddress: { type: "string", description: "The contract address." },
                            functionName: { type: "string", description: "The function name to call." },
                            args: { type: "array", description: "Arguments for the function.", items: {} },
                            systemId: { type: "string", description: "The systemId of the function." },
                        },
                        required: ["contractAddress", "functionName", "args"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "invokeApp",
                    description: "Invokes an existing yeomen app which belongs to this game",
                    parameters: {
                        type: "object",
                        properties: {
                            appId: {
                                type: "integer",
                                description: "The Appid of the yeomen app to call."
                            },
                            options: {
                                type: "object",
                                description: "Options for the invoke function."
                            }
                        },
                        required: ["appId"]
                    }
                }
            }
        ]);


        yeomenAIPlanner.registerToolHandler("queryGraphQL", async ({ query, variables = {} }) => {
            console.log(`📡 Querying GraphQL: ${query}`);
            try {
                query = query.replace(/(where:\s*\{[^}]*_eq:\s*")((?:0x|\\x)[a-fA-F0-9]+)"/g, (match, prefix, address) => {
                    return `${prefix}${address.replace(/(0x|\\x)/g, '\\\\x')}"`;
                });
                const data = await YeomenAI.getQueryData(query);
                console.log("✅ GraphQL Data:", data);
                return data;
            } catch (error) {
                console.error("❌ GraphQL query error:", error.message);
            }
        });

        yeomenAIPlanner.registerToolHandler("getContractData", async ({ contractAddress, functionName, args = [] }) => {
            console.log(`🔍 Fetching contract data: ${contractAddress}.${functionName}`);
            try {

                const iface = new ethers.Interface(contractABI);
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                async function callContractFunction(contract, functionName, args) {
                    // Get all function fragments with the given name.
                    const fragments = contract.interface.fragments.filter(
                        (fragment) => fragment.type === "function" && fragment.name === functionName
                    );

                    if (fragments.length === 0) {
                        throw new Error(`Function ${functionName} not found in contract ABI.`);
                    }

                    // If only one overload exists, use it.
                    if (fragments.length === 1) {
                        const fullSignature = fragments[0].format(); // e.g., "getInventory(bytes32)"
                        return await contract[fullSignature](...args);
                    }

                    // Filter candidates by matching argument count.
                    let candidates = fragments.filter(
                        (fragment) => fragment.inputs.length === args.length
                    );
                    if (candidates.length === 1) {
                        const fullSignature = candidates[0].format();
                        return await contract[fullSignature](...args);
                    }

                    // Further narrow candidates by checking argument types heuristically.
                    candidates = candidates.filter((fragment) => {
                        return fragment.inputs.every((input, index) => {
                            const arg = args[index];

                            // Check for addresses.
                            if (input.type === "address") {
                                return (
                                    typeof arg === "string" &&
                                    /^0x[a-fA-F0-9]{40}$/.test(arg)
                                );
                            }

                            // Check for bytes32.
                            if (input.type === "bytes32") {
                                return (
                                    typeof arg === "string" &&
                                    arg.startsWith("0x") &&
                                    arg.length === 66
                                );
                            }

                            // For numbers: check if type starts with uint or int.
                            if (input.type.startsWith("uint") || input.type.startsWith("int")) {
                                return (
                                    typeof arg === "number" ||
                                    (typeof arg === "string" && !isNaN(arg))
                                );
                            }

                            // Add more type heuristics as needed.
                            return true;
                        });
                    });

                    if (candidates.length === 1) {
                        const fullSignature = candidates[0].format();
                        return await contract[fullSignature](...args);
                    }

                    if (candidates.length === 0) {
                        throw new Error(
                            `No matching overload for ${functionName} with provided arguments: ${args}.`
                        );
                    }

                    throw new Error(
                        `Ambiguous function call for ${functionName} with provided arguments: ${args}. ` +
                        `Candidates: ${candidates.map((f) => f.format()).join(", ")}`
                    );
                }

                //const result = await contract[functionName](...args);
                const result = await callContractFunction(contract, functionName, args);
                console.log("✅ Contract Data:", result);
                return result;
            } catch (error) {
                console.error("❌ Contract data error:", error.message);
            }
        });

        yeomenAIPlanner.registerToolHandler("executeTransaction", async ({ contractAddress, functionName, args = [], systemId }) => {
            console.log(`🚀 Executing transaction: ${contractAddress}.${functionName}`);
            try {

                const iface = new ethers.Interface(contractABI);
                let callData = iface.encodeFunctionData(functionName, [...args]);


                if (delegatorAddress) {
                    callData = iface.encodeFunctionData('callFrom', [delegatorAddress, systemId, callData]);
                } else {
                    callData = iface.encodeFunctionData('call', [systemId, callData]);
                }


                let transaction = {
                    to: contractAddress,
                    from: delegateeAddress,
                    data: callData
                };

                const nonce = await provider.getTransactionCount(transaction.from, "latest");

                const gasEstimate = await provider.estimateGas({
                    to: transaction.to,
                    from: transaction.from,
                    data: transaction.data
                });
                const feeData = await provider.getFeeData();

                let preparedTx = {
                    to: transaction.to,
                    from: transaction.from,
                    data: transaction.data,
                    type: 0,
                    chainId: chain.id,
                    gasLimit: gasEstimate + 20000n, // Set a high enough gas limit   
                    gasPrice: feeData.gasPrice ?? 1000000000n,
                    gas: gasEstimate + 20000n,
                    nonce: nonce,
                    value: 0n
                };
                console.log(preparedTx)

                const txHash = await YeomenAI.signBroadcastTransaction({ tx: preparedTx, chain, abi: contractABI });

                console.log("✅ Transaction executed:", txHash);
                return tx;
            } catch (error) {
                console.error("❌ Transaction execution error:", error.message);
            }
        });

        yeomenAIPlanner.registerToolHandler("invokeApp", async ({ appId, options }) => {
            console.log(` Invoke App: "${appId}"`, options);
            try {
                await YeomenAI.invokeApp(appId, options);
                const app = await YeomenAI.getApp(appId);
                let invokedApp = { id: Date.now(), app: { name: app.name }, worker: null };

                return invokedApp;
            } catch (error) {
                console.error("❌ Invoke app error:", error.message);
            }
        });




        while (true) {
            try {

                await YeomenAI.markdown(markdown);
                const promptData = await YeomenAI.prompt([
                    {
                        type: 'text',
                        id: 'userPrompt',
                        label: 'User Prompt',
                        placeholder: "Enter your objective",
                        required: true
                    },
                    {
                        type: 'submit',
                        id: 'submit',
                        label: 'Submit'
                    }
                ]);

                const objective = promptData['userPrompt'];

                yeomenAIPlanner.setGoal(objective);

                await yeomenAIPlanner.run();

            } catch (err) {
                console.log(err)
                await YeomenAI.delay(5);
            }
        }



    } catch (err) {
        console.log(err)
    }
})()