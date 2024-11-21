import { spawn } from "child_process";

const evaluateAnswers = (message, ws) => {
  try {
    const process = spawn("bash", ["-c", "ollama run gemma2:2b"]);
    let stdoutBuffer = "";

    process.stdout.on("data", (data) => {
      stdoutBuffer += data.toString();

      if (data.toString().includes("\n")) {
        ws.send(`${stdoutBuffer}`);
        console.log(`${stdoutBuffer}`);
        stdoutBuffer = ""; // Clear buffer after sending
      }
    });

    process.on("close", (code) => {
      if (stdoutBuffer) {
        console.log(`stdout: ${stdoutBuffer}`);
      }
      console.log(`Process exited with code ${code}`);
      ws.close(1000, "close");
      process.stdin.write(`/bye\n`);
      process.stdin.end();
    });

    // Convert message to string if it's an object or array (JSON format)
    let correct = 0,
      incorrect = 0;
    function count(message) {
      message.forEach((element) => {
        if (element.assessment === "correct") correct += 1;
        if (element.assessment === "incorrect") incorrect += 1;
      });
    }
    count(message);
    correct = correct.toString();
    incorrect = incorrect.toString();
    const questionsAndResults = JSON.stringify(message, null, 2);

    // Send input to the spawned process
    process.stdin.write(
      `You are an AI specialized in assessing candidate performance based on provided answers to MCQ questions. Below is an array of questions and their corresponding assessments ('correct' or 'incorrect'). Generate a detailed assessment for the candidate that covers the following aspects: 
      correct answers : ${correct} , incorrect answers: ${incorrect}.
      Questions and Results: ${questionsAndResults}

Overall Performance: Provide a summary of the candidate’s accuracy rate. How many questions were answered correctly and incorrectly?

Strengths: Identify the topics or question types where the candidate performed well, explaining why these areas might be their strengths.

Weaknesses: Highlight the topics where the candidate struggled. Provide insights into common mistakes or misconceptions for these questions.

 \n`
    );

    process.stdin.end();
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send("Error handling request");
  }
};

export { evaluateAnswers };

// Suggestions for Improvement: Based on the candidate’s incorrect answers, offer detailed advice on how they can improve in the specific areas they performed poorly in. Include learning resources or strategies that may help.
// Future Potential: Assess the candidate’s potential in terms of problem-solving and critical thinking based on their overall performance. Suggest what type of roles or fields might align with their current skill level.
