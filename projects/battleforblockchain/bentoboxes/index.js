

async function getPlayerRecord(playerAddress) {

    TABLE_ID = '0x74620000000000000000000000000000506c6179657273000000000000000000';

    KEY_TUPLE = [ethers.utils.hexZeroPad(playerAddress, 32)];
    TABLE_SCHEMA = {
        schema: {
            player: "address",
            isTeamRight: "bool",
            lootboxes: "uint32",
            ArmyGeneral: "bytes32",
            latestWarId: "uint32",
            votingPowerSpent: "uint256",
            warPrisoners: "uint32",
            warPermitBalance: "uint256",
            title: "string",
            items: "uint32[]",
            resources: "uint256[]",
            units: "uint32[]",
            ArmyCaptain: "bytes32[]",
        },
        key: ["player"],
    };
    record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);


    recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);

    return recordDecoded;
}

(async function () {
    // Log that our Yeoman worker has started
    YeomenAI.statusMessage("BentoBox Auto-Open Worker started", YeomenAI.MESSAGE_TYPES.INFO);

    // A helper function to check how many unopened BentoBoxes (lootboxes) exist,
    // and call `commitRevealLootBox` if there are any.
    async function checkAndOpenBentoBoxes() {
        try {

            let playerAddress = (YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address).toLowerCase();

            let playerRecord = await getPlayerRecord(playerAddress);

            let lootboxCount = playerRecord.lootboxes;

            // Log how many we have
            YeomenAI.statusMessage(`Found ${lootboxCount} BentoBoxes (lootboxes) to open`, YeomenAI.MESSAGE_TYPES.INFO);

            if (lootboxCount > 0) {
                // Open them all, one at a time
                for (let i = 0; i < lootboxCount; i++) {
                    // This contract call opens one lootbox
                    await YeomenAI.sendTransaction('pushBlock', []);
                    await YeomenAI.delay(2);
                    await YeomenAI.sendTransaction('commitRevealLootBox', []);
                    await YeomenAI.delay(2);
                    await YeomenAI.sendTransaction('pushBlock', []);
                    await YeomenAI.delay(2);
                    await YeomenAI.sendTransaction('commitRevealLootBox', []);
                    await YeomenAI.delay(2);
                    YeomenAI.statusMessage(`Opened a BentoBox (Lootbox #${i + 1})!`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                }
            } else {
                YeomenAI.statusMessage("No BentoBoxes to open right now.", YeomenAI.MESSAGE_TYPES.INFO);
            }
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage(
                `Error checking or opening BentoBoxes: ${err.message || err}`,
                YeomenAI.MESSAGE_TYPES.ERROR
            );
        }
    }

    // Our infinite loop: check every 10 minutes.
    while (true) {
        // 1) Check and open boxes
        await checkAndOpenBentoBoxes();

        // 2) Wait 10 minutes
        // YeomenAI provides a `delay(seconds)` helper
        YeomenAI.statusMessage("Waiting 10 minutes before next check...", YeomenAI.MESSAGE_TYPES.INFO);
        await YeomenAI.delay(60 * 10);
    }
})();
