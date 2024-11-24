import { spawn } from "child_process";

const generateAptitudeQuestions = (ws) => {
  try {
    const process = spawn("bash", ["-c", "ollama run gemma2:2b"]);
    let stdoutBuffer = "";
    let jsonStart = -1;
    let jsonEnd = -1;

    // Start timing
    const startDate = Date.now();

    // Handle stdout data
    process.stdout.on("data", (data) => {
      stdoutBuffer += data.toString();

      // Loop to extract JSON objects
      while (true) {
        jsonStart = stdoutBuffer.indexOf("{");
        if (jsonStart === -1) break;

        jsonEnd = stdoutBuffer.indexOf("}", jsonStart);
        if (jsonEnd === -1) break;

        jsonEnd++;

        const jsonString = stdoutBuffer.substring(jsonStart, jsonEnd);
        stdoutBuffer = stdoutBuffer.substring(jsonEnd);

        try {
          const jsonObject = JSON.parse(jsonString);
          console.log(jsonObject);
          // Send the parsed JSON object back to the WebSocket client
          ws.send(JSON.stringify(jsonObject));
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      }
    });

    // Handle process exit
    process.on("close", (code) => {
      const endDate = Date.now();

      if (stdoutBuffer) {
        try {
          const jsonObject = JSON.parse(stdoutBuffer);
          console.log("Remaining JSON:", jsonObject);
        } catch (err) {
          console.error("Error parsing remaining JSON:", err);
        }
      }

      console.log(`Process exited with code ${code}`);
      console.log(`Time taken: ${endDate - startDate} ms`);
    });

    // Handle process errors
    process.on("error", (err) => {
      console.error("Process error:", err);
      ws.send("Error generating questions");
    });

    // Send the initial message to the spawned process
    process.stdin.write(
      `Generate 10 diffcult aptitude related to logical, quantitave and analysis based questions in JSON format. Each question should be a separate JSON object with the following fields: "question", "type", "options if type is mcq", and "hint". Format the output as a JSON array of objects . This has to be the JSON format:
             {
  question: '<question_text>',
  type: '<mcq>',
  options: [
    '<option_1>',
    '<option_2>',
    ...
  ],
  answer: <correct_option>
}
          \n`
    );

    process.stdin.end();
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send("Error handling request");
  }
};

const generateSkillQuestions = (message, ws) => {
  try {
    const process = spawn("bash", ["-c", "ollama run gemma2:2b"]);
    let stdoutBuffer = "";
    let jsonStart = -1;
    let jsonEnd = -1;

    // Start timing
    const startDate = Date.now();

    // Handle stdout data
    process.stdout.on("data", (data) => {
      stdoutBuffer += data.toString();

      // Loop to extract JSON objects
      while (true) {
        jsonStart = stdoutBuffer.indexOf("{");
        if (jsonStart === -1) break;

        jsonEnd = stdoutBuffer.indexOf("}", jsonStart);
        if (jsonEnd === -1) break;

        jsonEnd++;

        const jsonString = stdoutBuffer.substring(jsonStart, jsonEnd);
        stdoutBuffer = stdoutBuffer.substring(jsonEnd);

        try {
          const jsonObject = JSON.parse(jsonString);
          console.log(jsonObject);
          // Send the parsed JSON object back to the WebSocket client
          ws.send(JSON.stringify(jsonObject));
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      }
    });

    // Handle process exit
    process.on("close", (code) => {
      const endDate = Date.now();

      if (stdoutBuffer) {
        try {
          const jsonObject = JSON.parse(stdoutBuffer);
          console.log("Remaining JSON:", jsonObject);
        } catch (err) {
          console.error("Error parsing remaining JSON:", err);
        }
      }

      console.log(`Process exited with code ${code}`);
      console.log(`Time taken: ${endDate - startDate} ms`);
    });

    // Handle process errors
    process.on("error", (err) => {
      console.error("Process error:", err);
      ws.send("Error generating questions");
    });

    // Send the initial message to the spawned process
    process.stdin.write(
      `Generate 10 (based on: ${message}) questions in JSON format. Each question should be a separate JSON object with the following fields: "question", "type", "options if type is mcq", and "hint". Format the output as a JSON array of objects . This has to be the JSON format:
             {
  question: '<question_text>',
  type: '<mcq>',
  options: [
    '<option_1>',
    '<option_2>',
    ...
  ],
  answer: <correct_option>
}
          \n`
    );

    process.stdin.end();
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send("Error handling request");
  }
};

export { generateAptitudeQuestions, generateSkillQuestions };
