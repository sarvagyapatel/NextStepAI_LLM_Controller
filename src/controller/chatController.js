
import { spawn } from "child_process";

function generateScript(chat) {
    return chat.map(entry => {
        const speaker = entry.type === "AI" ? "AI" : "User";
        return `${speaker}: ${entry.message}`;
    }).join("\n");
}

const chatController = (chat ,ws) => {
    try {
        const process = spawn("bash", ["-c", "ollama run gemma2:2b"]);
    
        // Buffer to accumulate the stdout data
        let stdoutBuffer = "";
    
        // Handle stdout data
    
        process.stdout.on("data", (data) => {
          // if((!data.toString().includes('[')) || data.toString().size()>2)
          stdoutBuffer += data.toString();
          // // Log the full output once the process exits
          if (data.toString().includes("\n")) {
            ws.send(`${stdoutBuffer}`);
            console.log(`${stdoutBuffer}`);
    
            stdoutBuffer = ""; // Clear buffer after logging
          }
        });
    
        // Handle process exit
        process.on("close", (code) => {

          if (stdoutBuffer) {
            // Log any remaining data in the buffer
            console.log(`stdout: ${stdoutBuffer}`);
          }
          console.log(`Process exited with code ${code}`);
          ws.close(1000, 'close');
    
          // After the first command completes, send the "/bye" command
          process.stdin.write(`/bye\n`);
    
          // Close stdin if no further input is required
          process.stdin.end();
        });


    const conversationScript = generateScript(chat);
    const lastQuery = chat[chat.length - 1].message;
            

    // Send the initial message to the spawned process
    process.stdin.write(
      `You are an AI assistant responding to user queries. Here is the context of our previous conversation:
      ${conversationScript}
      Use the entire conversation history above as context. Focus on understanding the user's last question and provide an appropriate response. Your output must only be the message itself and nothing else. Do not include any additional explanations or formatting.
      Respond concisely to the user's last query: *${lastQuery}* \n`
    );

    process.stdin.end();
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send("Error handling request");
  }
};

export {chatController}