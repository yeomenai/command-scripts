(async () => {
    try {
        importScripts(`${self.location.origin}/libraries/yeomenOpenAI.js`);
        importScripts(`${self.location.origin}/libraries/ethers6.umd.min.js`);


        const rpcEndpoint = "https://json-rpc.culinaris-2.initia.tech";

        // RPC Provider (Change as needed)        
        const provider = new ethers.JsonRpcProvider(rpcEndpoint);
        const network = await provider.getNetwork();

        const chain = {
            id: parseInt(network.chainId),
            name: `Network ${network.chainId}`,
            //network: 'Pre Yominet-1',
            rpcUrls: {
                default: {
                    http: [rpcEndpoint], // Replace with your RPC URL
                },
            },
        }

        const { OpenAI } = YeomenOpenAI;

        let openAiProvider = 'openai';//deepseek
        let openAiModel = 'gpt-3.5-turbo';//deepseek-chat

        let openAiOptions = {};
        switch (openAiProvider) {
            case 'deepseek':
                openAiOptions = {
                    baseURL: 'https://api.deepseek.com',
                    apiKey: ''
                }
                break;
            default:
                openAiOptions = {
                    apiKey: YeomenAI?.INTELLIGENCE?.OPENAI_API_KEY || null
                }
                break;
        }

        const openai = new OpenAI.default(openAiOptions);

        let playerAddress = (YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address).toLowerCase();


        let contractAddress = '0xf5bc2d28d40cd3cfa98e32f7c709b784b743336a';
        let contractABI = [
            {
                "type": "function",
                "name": "acceptDailyBattleWon",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "addQuestProgress",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "_questId",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_progress",
                        "type": "uint32",
                        "internalType": "uint32"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "airdropResources",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "_gold",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
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
                    },
                    {
                        "name": "_sugar",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "airdropUnit",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "_amount",
                        "type": "uint32",
                        "internalType": "uint32"
                    },
                    {
                        "name": "_unitType",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "airdropUnit",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    },
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
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "airdropUnit",
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
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
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
                "name": "assignLootbox",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
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
                "name": "claimBattleRewards",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "claimDailyBattleWon",
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
                "name": "concludeSiegeForce",
                "inputs": [],
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
                "name": "conquerLocationForce",
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
                "name": "dailyBattleWonLastClaimed",
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
                "name": "downgradeBuildingLevel",
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
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "emergencyToggleBattleQuestsDebug",
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
                "name": "flushAllUpgrades",
                "inputs": [],
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
                "name": "killBattleForce",
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
                "name": "ovenburgClicked",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "pathOfKingsCompleteFirstQuest",
                "inputs": [],
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
                "name": "pushSiegeForce",
                "inputs": [
                    {
                        "name": "isTeamRightWinner",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
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
                "name": "renewWarPermit",
                "inputs": [],
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
                "name": "resetBuildingDev",
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
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "resetTeamTable",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "resetUnitUpgradeDev",
                "inputs": [
                    {
                        "name": "_unitType",
                        "type": "uint8",
                        "internalType": "enum UnitType"
                    },
                    {
                        "name": "_isTeamRight",
                        "type": "bool",
                        "internalType": "bool"
                    }
                ],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "returnWarPermit",
                "inputs": [],
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
                "name": "setForkQualified",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
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
                "name": "setItemToPlayer",
                "inputs": [
                    {
                        "name": "_item",
                        "type": "uint8",
                        "internalType": "enum ItemType"
                    },
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
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
                "name": "setSpoonQualified",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
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
                "name": "spawnUnitAdmin",
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
                        "name": "_unitType",
                        "type": "uint8",
                        "internalType": "enum UnitType"
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
                "name": "spendPlayerResources",
                "inputs": [
                    {
                        "name": "_player",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "_gold",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
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
                    },
                    {
                        "name": "_sugar",
                        "type": "uint256",
                        "internalType": "uint256"
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
                "name": "toggleBattlePhaseForce",
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
                "name": "toggleSiegeForce",
                "inputs": [
                    {
                        "name": "isTeamRightWinner",
                        "type": "bool",
                        "internalType": "bool"
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
                "name": "unlockQuestLineWeek1",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "unlockQuestLineWeek2",
                "inputs": [],
                "outputs": [],
                "stateMutability": "nonpayable"
            },
            {
                "type": "function",
                "name": "unlockQuestLineWeek3",
                "inputs": [],
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
                "name": "upgradeBuildingLevel",
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
            enums:
            {
                UnitType: ["Bomb", "Blocker", "Archer", "Squire", "Healer", "Mage", "Barbarian", "Alchemist", "Butcher", "Shaman", "Assassin", "Druid", "Spellcannon", "Phantomleech", "Dummy"], //FIXME DUMMY only for testing, remove dummy type from UnitType
                BattleState: ["WaitingForOpponent", "Planning", "Battle", "Finished"],
                WarState: ["Ongoing", "PreSiegePursuit", "Siege", "Finished"],
                DamageType: ["Melee", "Range", "Skill"],
                ButcherSkillStage: ["LongGrab", "ShortGrab", "PowerAttack"],
                BuildingType: ["BombHouse", "BlockerHouse", "ArcherHouse", "SquireHouse", "HealerHouse", "MageHouse", "BarbarianHouse", "AlchemistHouse", "ButcherHouse", "ShamanHouse", "AssassinHouse", "DruidHouse", "SpellcannonHouse", "PhantomleechHouse"],
                BattleWinner: ["Unconcluded", "TeamRight", "TeamLeft"],
                ResourceType: ["Gold", "Wood", "Stone", "Iron", "Sugar"],
                MapType: ["Warzone", "Grasslands", "MagicForest", "Mountains", "VillageSpooncity", "VillageForktown", "Spooncity", "Forktown"],
                RarityType: ["Gray", "Green", "Blue", "Purple", "Unique"],
                CallToArmsStatus: ["NotInvited", "PendingInvite", "Accepted"],
                ArmyState: ["Idle", "Fighting"],
                SiegeStage: ["Gates", "Courtyard", "ThroneHall", "Conquered"],
                ArtilleryType: ["KebabRocket", "MustardGas", "FatMandarin"],
                // @ts-expect-error: Type instantiation is excessively deep and possibly infinite.
                ItemType: [
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
                ], //while adding items remeber to sort them correctly (i.e. instant effect items first)
                StructureType: ["None", "Lumberyard", "Quarry", "IronMine", "Scavenger", "Reforger", "RiceFields", "PerpetualStew"],
            },

            tables:
            {
                TeamLeft: {
                    schema: {
                        warId: "uint32",
                        bombHouseLevel: "uint32",
                        blockerHouseLevel: "uint32",
                        archerHouseLevel: "uint32",
                        squireHouseLevel: "uint32",
                        healerHouseLevel: "uint32",
                        mageHouseLevel: "uint32",
                        barbarianHouseLevel: "uint32",
                        alchemistHouseLevel: "uint32",
                        butcherHouseLevel: "uint32",
                        shamanHouseLevel: "uint32",
                        assassinHouseLevel: "uint32",
                        druidHouseLevel: "uint32",
                        spellcannonHouseLevel: "uint32",
                        phantomleechHouseLevel: "uint32",
                    },
                    key: ["warId"],
                },
                TeamRight: {
                    schema: {
                        warId: "uint32",
                        bombHouseLevel: "uint32",
                        blockerHouseLevel: "uint32",
                        archerHouseLevel: "uint32",
                        squireHouseLevel: "uint32",
                        healerHouseLevel: "uint32",
                        mageHouseLevel: "uint32",
                        barbarianHouseLevel: "uint32",
                        alchemistHouseLevel: "uint32",
                        butcherHouseLevel: "uint32",
                        shamanHouseLevel: "uint32",
                        assassinHouseLevel: "uint32",
                        druidHouseLevel: "uint32",
                        spellcannonHouseLevel: "uint32",
                        phantomleechHouseLevel: "uint32",
                    },
                    key: ["warId"],
                },

                PlayerBattleStats: {
                    schema: {
                        player: "address",
                        battleId: "bytes32",
                        unitsPlaced: "uint32",
                    },
                    key: ["player", "battleId"],
                },


                Lootboxes: {
                    schema: {
                        owner: "address",
                        commitBlock: "uint256",
                    },
                    key: ["owner"],
                },
                Units: {
                    schema: {
                        id: "bytes32",
                        battleId: "bytes32",
                        unitType: "UnitType",
                        x: "uint32",
                        y: "uint32",
                        hp: "int32",
                        maxHp: "int32",
                        mana: "int32",
                        manaRegen: "int32",
                        castMana: "int32",
                        maxMana: "int32",
                        isTeamRight: "bool",
                        owner: "address",
                        level: "uint32",
                        title: "string",
                    },
                    key: ["id"],
                },


                UnitConstants: {
                    schema: {
                        unitType: "UnitType",
                        hp: "int32",
                        mana: "int32",
                        manaRegen: "int32",
                        castMana: "int32",
                        maxMana: "int32",
                        meleeDamage: "int32",
                        rangeDamage: "int32",
                        critDamage: "int32",
                        critChance: "uint32",
                        gateDamage: "int32",
                        attackRange: "uint32",
                    },
                    key: ["unitType"],
                },

                MapUnits: {
                    schema: {
                        battleId: "bytes32",
                        x: "uint32",
                        y: "uint32",
                        unitId: "bytes32",
                    },
                    key: ["battleId", "x", "y"],
                },

                LeftQueue: {
                    schema: {
                        id: "uint32",
                        battleId: "bytes32",
                        unitId: "bytes32",
                    },
                    key: ["id", "battleId"],
                },

                RightQueue: {
                    schema: {
                        id: "uint32",
                        battleId: "bytes32",
                        unitId: "bytes32"
                    },
                    key: ["id", "battleId"],
                },

                //========= War tables ====================================================================

                Players: {
                    schema: {
                        player: "address",
                        isTeamRight: "bool",
                        lootboxes: "uint32",
                        ArmyGeneral: "bytes32",
                        latestWarId: "uint32",
                        votingPowerSpent: "uint256",
                        warPrisoners: "uint32",
                        title: "string",
                        items: "uint32[69]",
                        resources: "uint256[5]",
                        units: "uint32[14]",
                        ArmyCaptain: "bytes32[]",
                    },
                    key: ["player"],
                },

                Rewards: {
                    schema: {
                        player: "address",
                        lootboxes: "uint32",
                        battleRewards: "uint256[5]",
                    },
                    key: ["player"],
                },

                Army: {
                    schema: {
                        armyId: "bytes32",
                        warId: "uint32",
                        size: "uint32",
                        armyState: "ArmyState", //Idle, Fighting
                        captains: "address[]", //captains[0] is the army leader, the only person that can disband the army
                        pendingInvitations: "address[]",
                    },
                    key: ["armyId"],
                },

                Captain: {
                    schema: {
                        player: "address",
                        armyId: "bytes32",
                        commitedUnits: "uint32[14]",
                        reservesUnits: "uint32[14]",
                    },
                    key: ["player", "armyId"],
                },


                Locations: {
                    schema: {
                        id: "uint32",
                        isTeamRight: "bool",
                        hp: "int32",
                        maxHp: "int32",
                        width: "uint32",
                        height: "uint32",
                        resource: "ResourceType",
                        lastClaimVp: "uint256",
                        mapType: "MapType",
                        neighbours: "uint32[]",
                        ongoingBattles: "bytes32[]",
                    },
                    key: ["id"],
                },

                Battles: {
                    schema: {
                        id: "bytes32",
                        warId: "bytes32",
                        winner: "BattleWinner",
                        initTime: "uint256",
                        battleState: "BattleState",
                        leftGateHp: "int32",
                        rightGateHp: "int32",
                        gateBleed: "int32",
                        location: "uint32",
                        defenderUnitPlaced: "bool",
                        attackingArmy: "bytes32",
                        defendingArmy: "bytes32", //0 if public defense
                        leftReady: "bool",
                        rightReady: "bool",
                        publicDefenders: "address[]", //length 0 if private defense
                    },
                    key: ["id"],
                },

                //========= EVENTS ============================================================================== 

                LocationBattleFinished: {
                    schema: {
                        locationId: "uint32",
                        battleId: "bytes32",
                        damageDealt: "int32",
                    },
                    type: "offchainTable",
                    key: [],
                },


                PlanningPhase: {
                    schema: {
                        planningId: "uint32"
                    },
                    type: "offchainTable",
                    key: [],
                },

                BattlePhase: {
                    schema: {
                        battleId: "uint32"
                    },
                    type: "offchainTable",
                    key: [],
                },

                UnitSpawned: {
                    schema: {
                        unitId: "bytes32",
                        unitType: "UnitType",
                        x: "uint32",
                        y: "uint32",
                        cost: "uint256",
                    },
                    type: "offchainTable",
                    key: [],
                },

                UnitMoved: {
                    schema: {
                        unitId: "bytes32",
                        x: "uint32",
                        y: "uint32",
                        newX: "uint32",
                        newY: "uint32",
                        isQuiched: "bool",
                    },
                    type: "offchainTable",
                    key: [],
                },

                BattleFinished: { //??????
                    schema: {
                        winner: "uint32"
                    },
                    type: "offchainTable",
                    key: [],
                },

                ProcessingUnit: {
                    schema: {
                        unitId: "bytes32",
                    },
                    type: "offchainTable",
                    key: [],
                },

                IterationFinished: {
                    schema: {
                        leftIndex: "uint32",
                        rightIndex: "uint32",
                    },
                    type: "offchainTable",
                    key: [],
                },

                //lootbox events ==================================================================================

                LootboxOpened: {
                    schema: {
                        player: "address",
                        item0: "uint32",
                        item1: "uint32",
                        item2: "uint32",
                        item3: "uint32",
                    },
                    type: "offchainTable",
                    key: ["player"],
                },

                //reforger event

                ReforgerUsed: {
                    schema: {
                        player: "address",
                        item: "uint32",
                        isSuccess: "bool",
                    },
                    type: "offchainTable",
                    key: [],
                }
            }
        };

        let GRAPHQL_SCHEMA = 'ai_0xf5bc2d28d40cd3cfa98e32f7c709b784b743336a_';

        //  ## Game MUD Config
        //${JSON.stringify(mudConfig)}   
        //         ## Live MUD Tables Fetch from contract
        // eg: Get Player Details
        //   {
        //     resourceId: '0x74620000000000000000000000000000506c6179657273000000000000000000',
        //     type: 'table',
        //     namespace: '',
        //     name: 'Players'
        //   }
        //   let TABLE_ID = resourceToHex({ namespace:'', type: "table", name: "Players" });  
        //   let KEY_TUPLE = [ethers.utils.hexZeroPad(playerAddress, 32)];
        //   let TABLE_SCHEMA = mudConfig.tables.Players;
        //   let record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);
        //   let recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record); 

        function buildPrompt(currentGameState) {
            let prompt = `
# Game Overview

# Game description
Battle for Blockchain (BFB) is an innovative MMO Auto Battler that marks a significant leap in on-chain gaming. Developed by Mintersworld, BFB is a simulation platform for game-like autonomous warfare, powered by socio-economic incentives and integrated with crypto networks. It's a multiplayer experience set in the heart of Culinaris, where every move can alter the fate of kingdoms. As a user you join one of the two Kingdoms Forktown or Spooncity.

# Game information:
  ## Kingdom
    Forktown(teamLeft)
    Spooncity(teamRight)

 ## Locations with location ID
    Forktown: 0
    Ovenburg: 1
    Radish Mine: 2
    Chopship: 3
    Cutlery Conflict Zone: 4
    Frogwise Summit: 5
    Sweetley: 6
    Spooncity: 7      

## Units required at locations for attack or defend
    Forktown: 16
    Ovenburg: 24
    Radish Mine: 16
    Chopship: 16
    Cutlery Conflict Zone: 16
    Frogwise Summit: 16
    Sweetley: 24
    Spooncity: 16


## UnitTypes Internal Names
    Bomb: 0
    Blocker: 1
    Archer: 2
    Squire: 3
    Healer: 4
    Mage: 5
    Barbarian: 6
    Alchemist: 7
    Butcher: 8
    Shaman: 9
    Assassin: 10
    Druid: 11
    Spellcannon: 12
    Phantomleech: 13

## UnitTypes actual names displayed to the user (Maps to actual UnitTypes Internal Names)
    Kabango: 0
    Rootguard: 1
    Gunmak: 2
    Snoodle: 3
    Hechoy: 4
    Boilix: 5
    Hamgar: 6
    Mushie: 7
    Waxon: 8
    Potano: 9
    Roe: 10
    Brocco: 11
    Lager: 12
    Dorayaki: 13            


## Game guidelines:
    
    1. Open Bentobox:
    a. Check Player lootboxes count
    b. Execute commitRevealLootBox, pushBlock, commitRevealLootBox functions to open a single bentobox

    2. Attack Location
    a. Check location can be attacked
    b. See if player ArmyGeneral exists and not in an active battle
    c. Disband Army and Create new Army
    d. Buy units if player is not having the required units to attack
    e. Commit units to the army and attack
    f. Spawn units at player side coords
    g. Check if both players are ready for battle / After 10 minutes battle is ready
    g. Start fighting with toggleBattlePhase
    h. Process the battle with multipleProcessing until battle is complete
    i. Decide who won the battle
    j. Claim rewards

    3. Defend Location
    a. Check location can be defended
    b. On Going battles should exists on a location and battle state should be WaitingForOpponent
    c. See if player ArmyGeneral exists and not in an active battle
    d. Disband Army and Create new Army
    e. Buy units if player is not having the required units to defend
    f. Commit units to the army and defend
    g. Spawn units at player side coords
    h. Check if both players are ready for battle / After 10 minutes battle is ready
    i. Start fighting with toggleBattlePhase
    j. Process the battle with multipleProcessing until battle is complete
    k. Decide who won the battle
    l. Claim rewards

	4. Buying units
Check if it is a valid unit
While buying units use _spendingCap = 2000000000000000000000 as default if not specified.

## Game API and Interface guidelines
1. Unit price is returned in the smallest unit, convert value returned by dividing by 10^18, eg 1000000000000000000 smallest unit = 1 Gold  

2. When interacting with the Contract, depending on the ABI,
a. If the stateMutability is pure or view, use the getContractData function to retrieve data without modifying the blockchain state.
b. If the stateMutability is nonpayable or payable, use the executeTransaction function to modify the contract state or send ETH.
c. Ensure executeTransaction is used when invoking state-changing functions, and payable functions should include an option to specify ETH to send.

# Yeomen Apps
## Based on the user's request, determine the appropriate Yeomen App to execute. Use the following mapping:
   Bento Boxes (AppId: 55): If the user asks to open bento boxes, reveal items, or check contents.
   Attack Strategy (AppId: 59): If the user wants to attack a location, raid, or engage in combat automatically.
   Defend Strategy (AppId: 78): If the user wants to defend a location, fortify, or prevent attacks automatically.
   Execute the corresponding Yeomen App and return a response confirming the action.                
              

# Best Practices
   - Always first use GetPlayer to get the player details.
   - Always validate player_address before querying.


## Game Contracts & ABI
- Contract Address: ${JSON.stringify(contractAddress)}
- Contract ABI: ${JSON.stringify(contractABI)}      


## Graphql Calls Fetch 

- Get Player Details
\`\`\`graphql
    query GetPlayer {
    ${GRAPHQL_SCHEMA}players(where: {player: {_eq: $playerAddress}}) {
        player                    
        is_team_right,
        lootboxes,
        army_general,
        latest_war_id,
        voting_power_spent,
        war_prisoners,
        title,
        items,
        resources,
        units,
        army_captain
    }
    }
\`\`\`           
       


            `;

            return prompt;
        }


        async function sendMessages(messages) {
            const response = await openai.chat.completions.create({
                model: openAiModel,
                messages: messages,
                tools: tools,
            });

            return response.choices[0].message;
        }

        async function getContractData(contractAddress, functionName, args = []) {
            try {
                const iface = new ethers.Interface(contractABI);
                const contract = new ethers.Contract(contractAddress, contractABI, provider);


                // Call the function on the contract
                const result = await contract[functionName](...args);

                console.log(`Result from ${functionName}:`, result);
                return result;
            } catch (error) {
                console.error(`Error calling ${functionName}:`, error);
                throw error;

            }
        }
        async function executeTransaction(transaction) {
            try {

                if (!transaction) {
                    throw new Error('transaction not provided');
                }


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
                //const signedTx = await YeomenAI.signTransaction({ tx: preparedTx, chain, abi });
                //console.log(signedTx)
                //const txResponse = await provider.broadcastTransaction(signedTx);
                const txResponse = await YeomenAI.signBroadcastTransaction({ tx: preparedTx, chain, abi: contractABI });
                console.log("Transaction sent! Hash:", txResponse);
                return txResponse.hash;
            } catch (err) {
                console.log(err)
                throw new Error(err);
            }
        };

        async function executeToolCall(tool) {
            switch (tool.function.name) {
                case "getContractData":
                    try {
                        let contractAddress = JSON.parse(tool.function.arguments).contractAddress;
                        let functionName = JSON.parse(tool.function.arguments).functionName;
                        let args = JSON.parse(tool.function.arguments).args;

                        result = await getContractData(contractAddress, functionName, args); // Blockchain transaction

                        return `${result}`;
                    } catch (err) {
                        return `Get Contract Data failed: ${err.message}`;
                    }
                    break;
                case "executeTransaction":
                    try {

                        let contractAddress = JSON.parse(tool.function.arguments).contractAddress;
                        let functionName = JSON.parse(tool.function.arguments).functionName;
                        let args = JSON.parse(tool.function.arguments).args;
                        let accountAddress = playerAddress;

                        const iface = new ethers.Interface(contractABI);
                        let callData = iface.encodeFunctionData(functionName, [...args]);

                        let transaction = {
                            to: contractAddress,
                            from: accountAddress,
                            data: callData
                        };

                        txHash = await executeTransaction(transaction); // Blockchain transaction

                        return `Transaction was successful: ${txHash}`;
                    } catch (err) {
                        console.log(err)
                        return "Transaction failed: " + err.message;
                    }
                    break;
                case "invokeApp":
                    try {
                        let appId = JSON.parse(tool.function.arguments).appId;
                        let options = JSON.parse(tool.function.arguments).options;
                        await YeomenAI.invokeApp(appId, options);
                        return "App Invoke success";
                    } catch (err) {
                        return "App Invoke failed";
                    }
                    break;
                case "queryGraphQL":
                    try {
                        let query = JSON.parse(tool.function.arguments).query;
                        query = query.replace(/(where:\s*\{[^}]*_eq:\s*")((?:0x|\\x)[a-fA-F0-9]+)"/g, (match, prefix, address) => {
                            return `${prefix}${address.replace(/(0x|\\x)/g, '\\\\x')}"`;
                        });
                        console.log(query)
                        const queryData = await YeomenAI.getQueryData(query);
                        console.log(queryData)
                        return JSON.stringify(queryData);
                    } catch (err) {
                        console.log(err)
                        return "queryGraphQL failed";
                    }


                    break;
                default:
                    return "Unknown tool";
                    break;
            }
            //return "Unknown tool";
        }


        const tools = [
            {
                type: "function",
                function: {
                    name: "queryGraphQL",
                    description: "Queries the GraphQL API for data.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The GraphQL query string."
                            },
                            variables: {
                                type: "object",
                                description: "The GraphQL variables to bind on query.",
                                additionalProperties: true
                            }
                        },
                        required: ["query"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "queryDatabase",
                    description: "Performs a SQL query on the specified database.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The SQL query to execute."
                            },
                            table: {
                                type: "string",
                                description: "The table in which the query will be executed."
                            },
                            filters: {
                                type: "object",
                                description: "Filters for the query (optional).",
                                additionalProperties: true
                            }
                        },
                        required: ["query", "table"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "getContractData",
                    description: "Reads data from a smart contract.",
                    parameters: {
                        type: "object",
                        properties: {
                            contractAddress: {
                                type: "string",
                                description: "The address of the contract to interact with."
                            },
                            functionName: {
                                type: "string",
                                description: "The function name in the contract to call."
                            },
                            args: {
                                type: "array",
                                description: "Arguments for the contract function.",
                                items: {}
                            }
                        },
                        required: ["contractAddress", "functionName", "args"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "executeTransaction",
                    description: "Executes a transaction onto the blockchain.",
                    parameters: {
                        type: "object",
                        properties: {
                            contractAddress: {
                                type: "string",
                                description: "The address of the contract to interact with."
                            },
                            functionName: {
                                type: "string",
                                description: "The function name in the contract to call."
                            },
                            args: {
                                type: "array",
                                description: "Arguments for the contract function.",
                                items: {}
                            }
                        },
                        required: ["contractAddress", "functionName", "args"]
                    }
                }
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
        ];


        let currentGameState = {
            playerAddress
            //playerAddress: '0xa6a9e84c5b63d44cf0d2e2e0119b9f5103075656'
        }
        console.log(currentGameState)
        let prompt = buildPrompt();



        let messages = [
            { role: "system", content: prompt },
            {
                role: "user", content: `
                # Current Game State
                ${JSON.stringify(currentGameState)}
                `}
            // { role: "user", content: userPrompt }

        ];
        let markdown = ``;
        while (true) {
            try {
                //let markdown = ``; // Add extra newline for separation
                await YeomenAI.markdown(markdown);
                const promptData = await YeomenAI.prompt([
                    {
                        type: 'text',
                        id: 'userPrompt',
                        label: 'User Prompt',
                        placeholder: "Enter your prompt",
                        required: true
                    },
                    {
                        type: 'submit',
                        id: 'submit',
                        label: 'Submit'
                    }
                ]);

                const userPrompt = promptData['userPrompt'];

                console.log(`User>\t ${userPrompt}`);
                markdown += `User>\t ${userPrompt} \n\n`;
                await YeomenAI.markdown(markdown);

                messages = [
                    //{ role: "system", content: prompt },
                    ...messages,
                    { role: "user", content: userPrompt }

                ];
                let message = await sendMessages(messages);


                console.log(`Model>\t ${message.content} `);
                markdown += `Model>\t ${message.content || (message.tool_calls?.[0]?.function ? JSON.stringify(message.tool_calls[0].function) : "")} \n\n`;
                await YeomenAI.markdown(markdown);
                messages.push(message);
                console.log(message)
                if (message.tool_calls && message.tool_calls.length > 0) {
                    const tool = message.tool_calls[0]; // Get the first tool call
                    //console.log("Tool call received:", tool);

                    const toolCallResponse = await executeToolCall(tool);
                    console.log(`ToolCallResponse>\t ${toolCallResponse} `);
                    markdown += `ToolCallResponse>\t ${JSON.stringify(toolCallResponse)} \n\n`;
                    await YeomenAI.markdown(markdown);

                    messages.push({ role: "tool", tool_call_id: tool.id, content: toolCallResponse });
                    message = await sendMessages(messages);

                    console.log(`Model>\t ${message.content} `);
                    //YeomenAI.statusMessage(`Model>\t ${message.content}`)

                    markdown += `Model>\t ${message.content} \n\n`;
                    await YeomenAI.markdown(markdown);
                } else {
                    await YeomenAI.markdown(markdown);
                }
                console.log(messages)

                //await YeomenAI.delay(5);

            } catch (err) {
                console.log(err)
                await YeomenAI.delay(5);
            }
        }



    } catch (err) {
        console.log(err)
    }
})()