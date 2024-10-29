
const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');

        const offscreenCanvasData = await YeomenAI.createOffscreenCanvas({width: 1500, height: 500});


        const canvas = offscreenCanvasData.canvas;
        const ctx = canvas.getContext('2d');

        // Text properties
        const text = "Hello, World!";
        const fontSize = 50;
        const textColor = 'blue';
        let x = 0; // Initial x position of the text
        const speed = 2; // Speed at which the text moves

        function animateText() {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set font properties
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = textColor;

            // Draw the text
            ctx.fillText(text, x, canvas.height / 2);

            // Update x position
            x += speed;

            // Reset position if the text moves off-screen
            if (x > canvas.width) {
                x = -ctx.measureText(text).width;
            }

            // Request the next frame
            requestAnimationFrame(animateText);
        }

// Start the animation
        animateText();

        //YeomenAI.statusMessage('Running code script completed');
        //  YeomenAI.exit(0);
    } catch (err) {
        console.log(err);
        YeomenAI.statusMessage('Running code script failed');
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
