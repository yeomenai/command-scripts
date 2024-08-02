const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');
            
            const intruders = await YeomenAI.getContractData('getIntruders', []);

            for (const intruder of intruders) {
                try {
                    YeomenAI.statusMessage(`Hit Intruder ${intruder}`);
                    await YeomenAI.sendTransaction('hitIntruder', [intruder]);
                    YeomenAI.statusMessage(`Successfully hitIntruder ${intruder}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    break;
                } catch (err) {
                    YeomenAI.statusMessage(`Failed to hitIntruder  ${intruder}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
            }

            await YeomenAI.delay(10);

        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (true);
};

// Call the simulateGame function
simulateGame();   