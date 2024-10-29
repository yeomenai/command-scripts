importScripts('http://localhost:8080/uploads/wasm/math.js');
const wasmFileUrl = 'http://localhost:8080/uploads/wasm/math.wasm';
Module({
    locateFile: (path) => {      
        if (path.endsWith('.wasm')) {
            // Return the correct path to the .wasm file
            return wasmFileUrl;
        }
        return path; // Use the default for other files
    }
}).then(async(module) => {
    const promptData = await YeomenAI.prompt([
        {
            type: 'number',
            id: 'num1',
            label: 'Number1',
            placeholder: "Enter Number1",
            required: true
        },
        {
            type: 'number',
            id: 'num2',
            label: 'Number2',
            placeholder: "Enter Number2",
            required: true
        },
        {
            type: 'submit',
            id: 'add',
            label: 'Add'
        }

    ]);
   
    const num1 = promptData['num1'];
    const num2 = promptData['num2'];
    YeomenAI.statusMessage(`Adding numbers ${num1} and ${num2}`)
    const sum = module._add_numbers(num1, num2);
    YeomenAI.statusMessage(`Sum ${num1} and ${num2} = ${sum}`)
    console.log(sum)
    const isPrime = module._check_prime(sum);
    YeomenAI.statusMessage(`Sum ${sum} check is prime:${isPrime ? 'YES' : 'NO'}`)
    console.log(isPrime)
}).catch((err) => {
    console.error('Error loading WebAssembly module:', err);
});
