const feedTime = parseInt(formFields['feedTime']);
const kamiId = formFields['kamiId'];
const objectId = formFields['objectId'];

if (!feedTime || !kamiId || !objectId) {
    YeomenAI.statusMessage('Please check params to be filled', YeomenAI.MESSAGE_TYPES.ERROR);
    YeomenAI.exit(1);
}


const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');


            try {
                YeomenAI.statusMessage(`Feed Kami`);
                await YeomenAI.sendTransaction('executeTyped', [BingInt(kamiId), BigInt(objectId)]);
                YeomenAI.statusMessage(`Successfully executed feed kami `, YeomenAI.MESSAGE_TYPES.SUCCESS);
                break;
            } catch (err) {
                YeomenAI.statusMessage(`Failed executing feed kami: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            }



        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);


    // Schedule the next execution after `feedTime` minutes
    YeomenAI.statusMessage(`Scheduled to feed kami after ${feedTime} minutes`);
    setTimeout(simulateGame, feedTime * 60 * 1000);
};

// Call the simulateGame function
simulateGame();

