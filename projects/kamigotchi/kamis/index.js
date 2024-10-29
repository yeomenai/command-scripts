const address = formFields['address'];

const contract_address = '0x542e70a3491f930b18f4848f9977e6818ac1e63e';

//const baseUrl = 'https://scan.testnet.initia.xyz/preyominet-1';
const baseUrl = `https://maze-rest-sequencer-9ce4b2ff-e329-459d-8baa-ae49f95f33b2.ane1-prod-nocsm.newmetric.xyz`;

const abi = [
    "function executeTyped(uint256, uint32)"
];

// Create an Interface object for decoding (correct syntax for ethers.js v5)
const contractInterface = new ethers.utils.Interface(abi);


const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');


        let results = {};
        async function fetchTransactions(paginationKey = null) {
            //const url = `${baseUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=1000&sort=asc`;
            const url = `${baseUrl}/indexer/tx/v1/txs/by_account/${address}?pagination.limit=10&pagination.reverse=false${paginationKey ? `&pagination.key=${paginationKey}` : ''}`;
            console.log(url)
            try {

                const response = await fetch(url);
                const data = await response.json();


                // Check if data was returned
                if (data.txs && data.txs.length > 0) {
                    //console.log(`Page ${page}:`);
                    data.txs.forEach((tx, index) => {
                        let to_contract_address = tx.tx.body.messages[0].contract_addr || '';
                       
                        if (to_contract_address.toLowerCase() == contract_address.toLowerCase()) {
                            //console.log(`Transaction :`, tx);

                            const callData = tx.tx.body.messages[0].input || '';


                            // Decode the function data (including function name and parameters)
                            const decoded = contractInterface.decodeFunctionData("executeTyped", callData);

                            //console.log("Decoded Function Call:", decoded);

                            const date = new Date(tx.timestamp);

                            const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;

                            const petId = decoded[0].toString();
                            const itemIndex = decoded[1];

                            results[petId] = { timestamp: formattedDate, petId: petId, itemIndex: itemIndex }
                            //results.push({ timestamp: formattedDate, petId: decoded[0].toString(), itemIndex: decoded[1] });
                        }

                    });

                    // If there are more results, call the function recursively with the next page
                    if (data.pagination && data.pagination.next_key) {
                        paginationKey = data.pagination.next_key;
                        await fetchTransactions(paginationKey);
                    }

                } else {
                    //console.log('No more transactions found.');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        }

        // Start fetching transactions from page 1
        await fetchTransactions();

        results = Object.values(results);
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


        await YeomenAI.markdown(null);

        let markdown = `#### Kamis\n`;
        markdown += `| Timestamp            |       | PetId             |       | ItemIndex             |\n`;
        markdown += `|----------------------| ------  |-------------------| ------  |-----------------------|\n`;



        for (let result of Object.values(results)) {
            markdown += `| ${result.timestamp}   |       | ${result.petId}          |      | ${result.itemIndex}            |\n`;
        }

        await YeomenAI.markdown(markdown);

        YeomenAI.statusMessage('Completed simulation');
        YeomenAI.exit(0);
    } catch (err) {
        console.error('Running code script failed:', err);
        YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
