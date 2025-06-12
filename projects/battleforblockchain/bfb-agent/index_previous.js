(async () => {
    try {
        importScripts(`${self.location.origin}/libraries/ethers6.umd.min.js`);
        importScripts(`${self.location.origin}/libraries/yeomenAIPlanner.js`);


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
        let contractABI = (() => { try { return JSON.parse(documents['yeomen/bfb_abi']) } catch { return null } })();

        let mudConfig = (() => { try { return JSON.parse(documents['yeomen/bfb_mud_config']) } catch { return null } })();

        let GRAPHQL_SCHEMA = 'ai_0xf5bc2d28d40cd3cfa98e32f7c709b784b743336a_';



        let GAME_DOCUMENT = documents['yeomen/bfb_kb'] || null;
        if (!GAME_DOCUMENT)
            throw new Error('Game document not provided')


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