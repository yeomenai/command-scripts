
const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');

        let counter;

        counter = await YeomenAI.getContractData('getCount');
        YeomenAI.statusMessage(`Counter before start: ${counter}`);

        await YeomenAI.delay(20);

        try {
            YeomenAI.statusMessage('Increment counter');
            await YeomenAI.sendTransaction('increment');
            YeomenAI.statusMessage(`Successfully incremented counter`, YeomenAI.MESSAGE_TYPES.SUCCESS);
        } catch (err) {
            YeomenAI.statusMessage(`Failed to increment counter: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
        }

        await YeomenAI.delay(20);

        counter = await YeomenAI.getContractData('getCount');
        YeomenAI.statusMessage(`Counter after increment: ${counter}`);

        await YeomenAI.delay(20);

        try {
            YeomenAI.statusMessage('Decrement counter');
            await YeomenAI.sendTransaction('decrement');
            YeomenAI.statusMessage(`Successfully decremented counter`, YeomenAI.MESSAGE_TYPES.SUCCESS);
        } catch (err) {
            YeomenAI.statusMessage(`Failed to decrement counter: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
        }

        await YeomenAI.delay(20);

        counter = await YeomenAI.getContractData('getCount');
        YeomenAI.statusMessage(`Counter after decrement: ${counter}`);

        YeomenAI.statusMessage('Running code script completed');
        YeomenAI.exit(0);
    } catch (err) {
        console.log(err);
        YeomenAI.statusMessage('Running code script failed');
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
