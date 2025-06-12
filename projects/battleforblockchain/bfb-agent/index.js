(async () => {
    try {
        importScripts(`${self.location.origin}/libraries/ethers6.umd.min.js`);
        importScripts(`${self.location.origin}/libraries/yeomenAIPlanner/v1/yeomenAIPlanner.js`);

        const rpcEndpoint = "https://jsonrpc-bfb-1.anvil.europe-west.initia.xyz";

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


        let playerAddress = (YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address).toLowerCase();
        let delegatorAddress = YeomenAI.ACCOUNT.delegator ? YeomenAI.ACCOUNT.delegator.toLowerCase() : null;
        let delegateeAddress = YeomenAI.ACCOUNT.address ? YeomenAI.ACCOUNT.address.toLowerCase() : null;



        let contractAddress = '0x7c662e41fb224629c54f5c3c049cd24d5cad672d';
        let contractABI = (() => { try { return JSON.parse(documents['yeomen/bfb_abi']) } catch { return null } })();

        let mudConfig = (() => { try { return JSON.parse(documents['yeomen/bfb_mud_config']) } catch { return null } })();

        //let GRAPHQL_SCHEMA = 'ai_0x9c949ad820cf974e1ba8526a7849070abc389123_';
        //const GRAPHQL_URL = 'https://graphql-api.yeomen.ai/v1';


        let GAME_KB = documents['yeomen/bfb_kb'] || null;
        if (!GAME_KB)
            throw new Error('Game document not provided')




        const memory = new YeomenMemoryDB();

        await memory.storeDocument({
            title: "Game Knowledgebase",
            content: GAME_KB,
            category: "rules",
            tags: ["game-mechanics", "rules"],
            lastUpdated: new Date(),
        });

        // await memory.storeDocument({
        //     title: "Game ABI",
        //     content: contractABI,
        //     category: "abi",
        //     tags: ["abi"],
        //     lastUpdated: new Date(),
        // });

        // await memory.storeDocument({
        //     title: "Game MUD Config",
        //     content: mudConfig,
        //     category: "config",
        //     tags: ["mud_config"],
        //     lastUpdated: new Date(),
        // });


        const yeomenAIPlanner = YeomenAI.planner = new YeomenAIPlanner(
            memory,
            {
                worldState: `
                ${GAME_KB}
                
                ${JSON.stringify({
                    playerAddress,
                    delegatorAddress,
                    delegateeAddress
                })}
                
                `,
            });


        let markdown = ``;
        yeomenAIPlanner.on('*', async (event, data) => {
            console.log(`${event} ->`, data);

            await YeomenAI.emitPlanner(event, data)

            switch (event) {
                case 'goal:created':
                    YeomenAI.statusMessage(`Goal Created: ${data.description}`);
                    markdown += `🎯 Goal Created: ${data.description}   \n\n`;
                    break;

                case 'step:':
                    if (YeomenAI.DEVELOPER_MODE) {
                        if (payload.type === 'planning') {
                            YeomenAI.statusMessage(`Step Planned: ${data.content}`);
                            markdown += `📝 Step Planned: ${data.content}   \n\n`;
                        } else if (payload.type === 'task') {
                            YeomenAI.statusMessage(`Task: ${data.content}`);
                            markdown += `📝 Task: ${data.content}   \n\n`;
                        } else if (payload.type === 'action') {
                            YeomenAI.statusMessage(`Action Executing: ${data.content}`);
                            markdown += `🔄 Action Executing: ${data.content}   \n\n`;
                        } else if (payload.type === 'system') {
                            YeomenAI.statusMessage(`System Event: ${data.content}`);
                            markdown += `✅ System Event: ${data.content}   \n\n`;
                        }
                    }
                    break;

                case 'goal:started':
                    YeomenAI.statusMessage(`Goal Started: ${data.description}`);
                    markdown += `🚀 Goal Started: ${data.description}   \n\n`;
                    break;

                case 'think:start':
                    if (YeomenAI.DEVELOPER_MODE) {
                        YeomenAI.statusMessage(`Think Start: ${data.query}`);
                        markdown += `💭 Think Start: ${data.query}   \n\n`;
                    }
                    break;

                case 'action:start':
                    YeomenAI.statusMessage(`Action Started: ${data.action.context}`);
                    markdown += `🚀 Action Started: ${data.action.context}   \n\n`;
                    break;

                case 'action:complete':
                    YeomenAI.statusMessage(`Action Completed: ${data.action.context}`);
                    markdown += `✅ Action Completed: ${data.action.context}   \n\n`;
                    if (YeomenAI.DEVELOPER_MODE) {
                        markdown += `   Result: ${data.result}   \n\n`;
                    }
                    break;

                case 'goal:completed':
                    YeomenAI.statusMessage(`Goal Completed: ${data.description}`);
                    markdown += `🏆 Goal Completed: ${data.description}   \n\n`;
                    markdown += `   Result: ${data.result}   \n\n`;
                    break;

                case 'goal:validated':
                    if (YeomenAI.DEVELOPER_MODE) {
                        YeomenAI.statusMessage(`Goal Validated: ${data.result}`);
                        markdown += `🔍 Goal Validated: ${data.result}   \n\n`;
                    }
                    break;

                case 'think:complete':
                    if (YeomenAI.DEVELOPER_MODE) {
                        YeomenAI.statusMessage(`Think Complete: ${data.query}`);
                        markdown += `💭 Think Complete: ${data.query}   \n\n`;
                    }
                    break;

                case 'memory:experience_stored':
                    if (YeomenAI.DEVELOPER_MODE) {
                        YeomenAI.statusMessage(`Experience Stored : ${data.experience.action}`);
                        markdown += `💭 Experience Stored : ${data.experience.action}   \n\n`;
                    }
                    break;

                case 'analyse:started':
                    YeomenAI.statusMessage(`Analysis Started: ${data.objective}`);
                    markdown += `🔍 Analysis Started: ${data.objective}   \n\n`;
                    break;

                case 'analyse:completed':
                    YeomenAI.statusMessage(`Analysis Completed: ${data.objective}`);
                    markdown += `✅ Analysis Completed: ${data.objective}   \n\n`;
                    markdown += `**Mode:** ${data.response.mode}  \n`;
                    markdown += `**Reason:** ${data.response.reason}   \n\n`;
                    break;

                case 'explain:started':
                    YeomenAI.statusMessage(`Explain Started: ${data.objective}`);
                    markdown += `🛠️ Explain Started: ${data.objective}   \n\n`;
                    break;

                case 'explain:completed':
                    YeomenAI.statusMessage(`Explain Completed: ${data.objective}`);
                    markdown += `🎯 Explain Completed: ${data.objective}   \n\n`;
                    markdown += `**Summary:** ${data.response.summary}  \n`;
                    markdown += `**Explanation:** ${data.response.explanation}  \n\n`;
                    //markdown += `**Confidence:** ${data.response.confidence * 100}%   \n\n`;
                    break;
                default:
                    if (event.endsWith(':error')) {
                        markdown += `❌ ${event}: ${JSON.stringify(data)}   \n\n`;
                    } else {
                        if (YeomenAI.DEVELOPER_MODE) {
                            markdown += `🔹 ${event}: ${JSON.stringify(data, null, 2)}  \n\n`;
                        }
                    }
                    break;
            }

            await YeomenAI.markdown(markdown);
        });



        // Register available actions

        yeomenAIPlanner.registerOutput({
            name: "getContractData",
            role: HandlerRole.OUTPUT,
            handler: async (data) => {
                const { contractAddress, functionName, args = [] } = data.payload ?? {};
                try {
                    const iface = new ethers.Interface(contractABI);
                    const contract = new ethers.Contract(contractAddress, contractABI, provider);

                    async function callContractFunction(contract, functionName, args) {
                        const fragments = contract.interface.fragments.filter(
                            (fragment) => fragment.type === "function" && fragment.name === functionName
                        );

                        if (fragments.length === 0) {
                            throw new Error(`Function ${functionName} not found in contract ABI.`);
                        }

                        if (fragments.length === 1) {
                            const fullSignature = fragments[0].format();
                            return await contract[fullSignature](...args);
                        }

                        let candidates = fragments.filter(
                            (fragment) => fragment.inputs.length === args.length
                        );

                        if (candidates.length === 1) {
                            const fullSignature = candidates[0].format();
                            return await contract[fullSignature](...args);
                        }

                        candidates = candidates.filter((fragment) => {
                            return fragment.inputs.every((input, index) => {
                                const arg = args[index];
                                if (input.type === "address") {
                                    return typeof arg === "string" && /^0x[a-fA-F0-9]{40}$/.test(arg);
                                }
                                if (input.type === "bytes32") {
                                    return typeof arg === "string" && arg.startsWith("0x") && arg.length === 66;
                                }
                                if (input.type.startsWith("uint") || input.type.startsWith("int")) {
                                    return typeof arg === "number" || (typeof arg === "string" && !isNaN(arg));
                                }
                                return true;
                            });
                        });

                        if (candidates.length === 1) {
                            const fullSignature = candidates[0].format();
                            return await contract[fullSignature](...args);
                        }

                        if (candidates.length === 0) {
                            throw new Error(`No matching overload for ${functionName} with provided arguments: ${args}.`);
                        }

                        throw new Error(
                            `Ambiguous function call for ${functionName} with provided arguments: ${args}. Candidates: ${candidates.map((f) => f.format()).join(", ")}`
                        );
                    }

                    const result = await callContractFunction(contract, functionName, args);

                    const resultJson = result;

                    const resultStr = [
                        `contractAddress: ${contractAddress}`,
                        `functionName: ${functionName}`,
                        `args: ${JSON.stringify(args, JSONBigNumberReplacer, 2)}`,
                        `result: ${JSON.stringify(resultJson, JSONBigNumberReplacer, 2)}`,
                    ].join("\n\n");

                    return `Contract data fetched successfully: ${resultStr}`;

                } catch (error) {
                    console.error("❌ Contract data error:", error.message);
                    return `❌ Contract data fetch failed: ${error.message}`;
                }
            },
            schema: z
                .object({
                    contractAddress: z.string().describe("The address of the contract to fetch data"),
                    functionName: z.string().describe("The function to call on the contract"),
                    args: z.array(z.any()).optional().describe("The args to pass to the function"),
                })
                .describe("The payload to execute the transaction, never include slashes or comments"),
        });

        yeomenAIPlanner.registerOutput({
            name: "executeTransaction",
            role: HandlerRole.OUTPUT,
            handler: async (data) => {
                const { contractAddress, functionName, args = []/*, systemId*/ } = data.payload ?? {};
                try {
                    const iface = new ethers.Interface(contractABI);
                    let callData = iface.encodeFunctionData(functionName, [...args]);

                    // if (delegatorAddress) {
                    //     callData = iface.encodeFunctionData('callFrom', [delegatorAddress, systemId, callData]);
                    // } else {
                    //     callData = iface.encodeFunctionData('call', [systemId, callData]);
                    // }

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
                        gasLimit: gasEstimate + 20000n,
                        gasPrice: feeData.gasPrice ?? 1000000000n,
                        gas: gasEstimate + 20000n,
                        nonce: nonce,
                        value: 0n
                    };

                    const txHash = await YeomenAI.signBroadcastTransaction({ tx: preparedTx, chain, abi: contractABI });

                    const resultStr = [
                        `contractAddress: ${contractAddress}`,
                        `functionName: ${functionName}`,
                        `args: ${JSON.stringify(args, JSONBigNumberReplacer, 2)}`,
                        `result: ${txHash}}`,
                    ].join("\n\n");

                    return `Transaction executed successfully: ${resultStr}`;

                } catch (error) {
                    console.error("❌ Transaction execution error:", error.message);
                    return `❌ Transaction execution failed: ${error.message}`;
                }
            },
            schema: z
                .object({
                    contractAddress: z.string().describe("The address of the contract to execute the transaction on"),
                    functionName: z.string().describe("The function name to call on the contract"),
                    args: z.array(z.any()).describe("The args to pass to the function"),
                    //systemId: z.string().describe("The unique identifier for the system where the transaction is being executed"),
                })
                .describe("The payload to execute the transaction, never include slashes or comments"),
        });

        yeomenAIPlanner.registerOutput({
            name: "getMUDTableData",
            role: HandlerRole.OUTPUT,
            handler: async (data) => {
                let { TABLE_ID, TABLE_SCHEMA, KEY_TUPLE = [] } = data.payload ?? {};
                try {
                    console.log('reccc', data)
                    KEY_TUPLE = KEY_TUPLE.map((key) => {
                        // 1. If it's already a bytes32 string (hex string, length 66 including '0x')
                        if (typeof key === 'string' && key.startsWith('0x') && key.length === 66) {
                            return key;
                        }

                        let hexValue;

                        // 2. If the key is a number or numeric string, convert to BigInt -> toBeHex
                        if (!isNaN(key)) {
                            hexValue = ethers.toBeHex(BigInt(key));
                        } else {
                            // 3. If it's a normal string, hash it to bytes32
                            hexValue = ethers.id(key); // ethers.id() hashes the UTF-8 string to keccak256 (bytes32)
                        }

                        // 4. Pad it to bytes32 length
                        return ethers.zeroPadValue(hexValue, 32);
                    });



                    console.log('after', KEY_TUPLE)

                    const record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);

                    const recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);

                    return recordDecoded;


                } catch (error) {
                    console.error("❌ MUD Table Data Fetch Error:", error.message);
                    return `❌ Failed to fetch data: ${error.message}`;
                }
            },
            schema: z
                .object({
                    TABLE_ID: z.string()
                        .describe("The table ID to fetch data from (hex string). Example: '0x7462...0000'"),
                    TABLE_SCHEMA: z.object({
                        schema: z.record(z.any()),  // e.g., { player: "address", isTeamRight: "bool", ... }
                        key: z.array(z.string())    // keys like ['player']
                    })
                        .describe("The table schema definition including 'schema' and 'key' fields. Example: { schema: {...}, key: [...] }"),
                    KEY_TUPLE: z.array(z.any())
                        .describe("Optional array of keys used to identify the specific record . Example: [...]"),
                })
                .describe("Fetches a decoded MUD table record from a given table ID with an optional key tuple."),
        });

        yeomenAIPlanner.registerOutput({
            name: "getAllLocations",
            role: HandlerRole.OUTPUT,
            handler: async () => {
                try {
                    // 1. Define your TABLE_ID and TABLE_SCHEMA (hardcoded or imported)
                    const TABLE_ID = "0x746200000000000000000000000000004c6f636174696f6e7300000000000000"; // <-- Replace with your table ID
                    const TABLE_SCHEMA = {
                        schema: {
                            id: "uint32",
                            isSiegeLocation: "bool",
                            isTeamRight: "bool",
                            hp: "int32",
                            maxHp: "int32",
                            width: "uint32",
                            height: "uint32",
                            resource: "uint256",
                            tier: "uint256",
                            lastClaimVp: "uint256",
                            repairCostTier: "uint32",
                            mapType: "uint256",
                            neighbours: "uint32[]",
                            ongoingBattles: "bytes32[]",
                        },
                        key: ["id"],
                    };

                    // 2. Define your list of LOCATION IDs (keys)
                    const locationIds = [
                        1,   // RACCOONBURY
                        2,   // CIVICADIA
                        3,   // OVENBURG
                        4,   // INERIAL QUARRY
                        5,   // MINA BOSS
                        6,   // ECHELON FIELDS
                        7,   // BFBULLISH
                        8,   // MULTICHAIN GARDEN
                        9,   // BLACK CAVERN
                        10,  // LUNCH HAVEN
                        11,  // RENA LAIR
                        12,  // MILKYLAND
                        13,  // INTEROP ZONE
                        14,  // INFINITY GROUND
                        15,  // CELESTIAL MAMMOTHS
                        16,  // SPOOKY RAVE
                        17,  // INTERPORTAL
                        18,  // FLAMES OF EMBR
                        19,  // TUZI MOONWOODS
                        20,  // GALAXY ENTRANCE
                        21,  // CABAL SUMMIT
                        22,  // ZAARLEY
                        23,  // CITRUS SANCTUM
                        24,  // CONTREA
                        1001, // GATE I
                        1002, // GATE II
                        1003, // GATE III
                        1004, // INNER CITY I
                        1005, // INNER CITY II
                        1006  // THRONEROOM
                    ];

                    // 3. Loop through each locationId and fetch its record
                    const locations = [];

                    for (const locationId of locationIds) {
                        let key = locationId;

                        // Handle key transformation (to bytes32)
                        let hexKey;

                        if (typeof key === 'string' && key.startsWith('0x') && key.length === 66) {
                            hexKey = key;
                        } else if (!isNaN(key)) {
                            hexKey = ethers.toBeHex(BigInt(key));
                        } else {
                            hexKey = ethers.id(key);
                        }

                        const KEY_TUPLE = [ethers.zeroPadValue(hexKey, 32)];

                        // Fetch the record and decode it
                        const record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);
                        const recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);

                        locations.push(recordDecoded);
                    }

                    return locations;

                } catch (error) {
                    console.error("❌ Get All locations Fetch Error:", error.message);
                    return `❌ Failed to Get All locations data: ${error.message}`;
                }
            },
            schema: z
                .object({})
                .describe("Fetches and returns all location records in the game world without requiring any input. " +
                    "Internally loops through a predefined list of location IDs, queries their data from the MUD table, decodes the records, " +
                    "and returns the complete list of location details. No external payload or input is necessary."),
        });


        yeomenAIPlanner.registerOutput({
            name: "getGameState",
            role: HandlerRole.OUTPUT,
            handler: async ({ playerAddress=null, battleId=null }) => {
                try {
                    return await new Promise((resolve, reject) => {
                        const ws = new WebSocket('wss://multiflexer.prod.siusia.com');

                        ws.onopen = () => {
                            const request = {
                                type: "get",
                                group: ["Map", "Default", "Battle", "Users", "War", "Battles"],
                            };

                            if (playerAddress) request.address = playerAddress;
                            if (battleId !== undefined) request.battleId = battleId;

                            ws.send(JSON.stringify(request));
                        };

                        ws.onmessage = (msg) => {
                            try {
                                const data = JSON.parse(msg.data);

                                if (data.type === 'connected') {
                                    console.log("Connected to server, waiting for data...");
                                    return;
                                }

                                console.log("Received data:", data);
                                resolve(data.updates || []);
                                ws.close();
                            } catch (error) {
                                console.error("Failed to parse message:", error);
                                resolve(null);
                            }
                        };

                        ws.onerror = (error) => {
                            console.error("WebSocket error:", error);
                            resolve(null);
                        };

                        ws.onclose = () => {
                            console.log("WebSocket connection closed");
                        };
                    });
                } catch (error) {
                    console.error("❌ getGameState Error:", error.message);
                    return `❌ Failed to getGameState data: ${error.message}`;
                }
            },
            schema: z.object({
                playerAddress: z.string().optional().describe("Optional player address for User-specific records (hex string), required for 'Users' group."),
                battleId: z.number().optional().describe("Optional battle ID for Battle-specific records (number), required for 'Battle' group."),
            }).describe("Fetches the latest game state data. player address and battle ID are optional. Returns the most recent decoded data needed for the front-end at game entrance."),
        });



        // yeomenAIPlanner.registerOutput({
        //     name: "fetchGraphql",
        //     role: HandlerRole.OUTPUT,
        //     handler: async (data) => {
        //         const { query, variables } = data.payload ?? {};
        //         try {
        //             const result = await fetch(GRAPHQL_URL + "/graphql", {
        //                 method: "POST",
        //                 headers: {
        //                     "Content-Type": "application/json"
        //                 },
        //                 body: JSON.stringify({
        //                     query,
        //                     variables
        //                 })
        //             });

        //             const resultJson = await result.json();

        //             const resultStr = [
        //                 `query: ${query}`,
        //                 `result: ${JSON.stringify(resultJson, null, 2)}`,
        //             ].join("\n\n");

        //             return `GraphQL data fetched successfully: ${resultStr}`;

        //         } catch (error) {
        //             console.error("❌ GraphQL data error:", error.message);
        //             return `❌ GraphQL data fetch failed: ${error.message}`;
        //         }
        //     },
        //     schema: z
        //         .object({
        //             query: z.string().describe(`"query GetRealmInfo { eternumRealmModels(where: { realm_id: 42 }) { edges { node { ... on eternum_Realm { entity_id level } } } } }"`),
        //             variables: z.record(z.any()).optional()
        //         })
        //         .describe("The payload to fetch data from the GraphQL API, never include slashes or comments"),
        // });


        yeomenAIPlanner.registerOutput({
            name: "invokeApp",
            role: HandlerRole.OUTPUT,
            handler: async (data) => {
                const { appId, options } = data.payload ?? {};
                console.log(`Invoke App: "${appId}"`, options);
                try {
                    const { invokedId, isLongRunning } = await YeomenAI.invokeApp2(appId, options);
                    console.log('invokeApp response', invokedId, isLongRunning);

                    const resultStr = [
                        `Invoke App: ${appId}`,
                        `Options: ${JSON.stringify(options, JSONBigNumberReplacer)}`,
                        `Status: ${isLongRunning ? 'completed' : 'processing'}`,
                        `Note: ${isLongRunning ? 'The app is now running in the background.' : 'The app is now running and will return success or failure later.'}`,
                    ].join("\n\n");

                    return {
                        success: true,
                        message: `App invoked successfully: ${resultStr}`,
                        invokedId,
                        processing: isLongRunning ? false : true,
                    };
                } catch (error) {
                    console.error("❌ Invoke app error:", error.message);
                    return {
                        success: false,
                        message: `Error invoking app: ${error.message}`,
                    };
                }
            },
            schema: z.object({
                appId: z.number().describe("The AppId of the Yeomen app to create and invoke."),
                options: z.record(z.unknown()).optional()
                    .describe("Optional parameters to configure the app instance upon invocation."),
            }).describe("Payload to invoke the Yeomen app with optional configuration options."),
        });

        yeomenAIPlanner.registerOutput({
            name: "getInvokedApps",
            role: HandlerRole.OUTPUT,
            handler: async () => {
                try {
                    const invokedApps = await YeomenAI.getInvokedApps();
                    console.log('getInvokedApps', invokedApps);

                    return {
                        success: true,
                        message: `Retrieved invoked apps successfully`,
                        invokedApps,
                    };
                } catch (error) {
                    console.error("❌ Get invoked apps error:", error.message);
                    return {
                        success: false,
                        message: `Error retrieving invoked apps: ${error.message}`,
                    };
                }
            },
            schema: z.object({}).describe("Retrieves a list of all currently invoked Yeomen apps that belong to this game, with their unique identifiers."),
        });

        yeomenAIPlanner.registerOutput({
            name: "startInvokedApp",
            role: HandlerRole.OUTPUT,
            handler: async (data) => {
                const { id } = data.payload ?? {};
                try {
                    const started = await YeomenAI.startInvokedApp(id);
                    console.log('startInvokedApp', started);

                    return {
                        success: true,
                        message: `Started invoked app: ${id}`,
                        started,
                    };
                } catch (error) {
                    console.error("❌ Start invoked app error:", error.message);
                    return {
                        success: false,
                        message: `Error starting invoked app: ${error.message}`,
                    };
                }
            },
            schema: z.object({
                id: z.number().describe("The unique identifier of the invoked Yeomen app to start."),
            }).describe("Starts an already invoked Yeomen app by its unique identifier from the invoked apps list."),
        });

        yeomenAIPlanner.registerOutput({
            name: "stopInvokedApp",
            role: HandlerRole.OUTPUT,
            handler: async (data) => {
                const { id } = data.payload ?? {};
                try {
                    const stopped = await YeomenAI.stopInvokedApp(id);
                    console.log('stopInvokedApp', stopped);

                    return {
                        success: true,
                        message: `Successfully stopped and permanently removed invoked app: ${id}`,
                        stopped,
                    };
                } catch (error) {
                    console.error("❌ Stop and remove invoked app error:", error.message);
                    return {
                        success: false,
                        message: `Error stopping and removing invoked app: ${error.message}`,
                    };
                }
            },
            schema: z.object({
                id: z.number().describe("The unique identifier of the invoked Yeomen app to stop and permanently remove. This action stops the app if it is running, deletes it from the system, and frees all associated resources."),
            }).describe("Stops and permanently removes an invoked Yeomen app by its unique identifier. This action stops the app (if running), deletes or uninstalls it from the active apps list, frees up all resources, and prevents any future interactions with the app. " +
                "Use this command to stop, delete, remove, erase, uninstall, discard, or permanently eliminate the app instance from the system."),
        });



        while (true) {
            try {

                await YeomenAI.markdown(markdown);
                YeomenAI.statusMessage('Waiting for user input...');
                const promptData = await YeomenAI.prompt([
                    {
                        type: 'text',
                        id: 'userInput',
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

                const userInput = promptData['userInput'];
                YeomenAI.statusMessage(`User input received: "${userInput}". Processing...`);


                try {

                    await yeomenAIPlanner.run(userInput);

                } catch (error) {
                    console.error("Error processing :", error);
                }




            } catch (err) {
                console.error("Error :", error);
                await YeomenAI.delay(5);
            }
        }



    } catch (err) {
        console.log(err)
    }
})()