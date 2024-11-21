import { spawn } from "child_process";

const generateCareerPath = (message, ws) => {
  try {
    const process = spawn("bash", ["-c", "ollama run gemma2:9b"]);

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
    // Send a message to the process
    // process.stdin.write('i want to become a fullsatack developer give me a career path\n');  // Sending 'hi' followed by a newline character
    process.stdin.write(`
Name: ${message.fullname}
Education: ${message.education}
Interest: ${message.interests}
Ambition: ${message.ambitions}
Skills: ${message.skills}

Aptitude Evaluation Summary:
${message.aptitudeEvaluation.join(" ")}

Skill Evaluation Summary:
${message.skillEvaluation.join(" ")}

Personalized Career Path for ${message.fullname}:

Current Skill Set and Education:
Analyze ${message.fullname}'s current skills and educational background (${message.education}). Align these skills with ${message.ambitions} and explain how ${message.fullname} can leverage their education, experience, and strengths highlighted in the **skill evaluation summary**. Highlight areas that are particularly strong or directly relevant to achieving the goal of becoming ${message.ambitions}.

Aptitude Insights:
Use insights from the **aptitude evaluation summary** to assess how ${message.fullname}'s aptitude strengths and weaknesses impact their readiness for ${message.ambitions}. Suggest ways to leverage strengths while addressing areas for improvement, based on the provided evaluation.

Skill Gaps:
Identify any key skill gaps from the **skill evaluation summary** and knowledge gaps from the **aptitude evaluation summary** that ${message.fullname} needs to address to succeed in reaching ${message.ambitions}. For each gap, provide examples of how these missing skills could impact progress toward ${message.ambitions}.

Steps to Overcome Gaps:

1. **Courses and Certifications**:
Recommend specific courses, certifications, or training programs that ${message.fullname} can take to bridge these gaps, focusing on both their aptitude and skill gaps.

2. **Practical Experiences**:
Suggest relevant projects, internships, or hands-on job roles. Include advice on how these experiences will develop key skills needed for ${message.ambitions}.

3. **Resources**:
Provide a list of valuable resources—books, articles, online platforms, or study guides—tailored to the specific skills ${message.fullname} needs to acquire based on both evaluations.

4. **Networking**:
Offer strategies for ${message.fullname} to connect with mentors and professional networks that align with their skills and ambitions.

Career Milestones:
Define specific career milestones to mark ${message.fullname}'s progress. Provide a detailed breakdown for each milestone, considering both the **aptitude** and **skill evaluations**.

1. **Objectives**: Focus on key achievements that ${message.fullname} should target at each stage.
2. **Impact**: Explain how each milestone moves ${message.fullname} closer to their goal of becoming ${message.ambitions}.
3. **Indicators of Success**: Offer measurable indicators based on their evaluations to evaluate progress.

Long-term Strategy:
Encourage ${message.fullname} to stay ahead of industry trends relevant to ${message.ambitions}. Leverage their strengths from both the **aptitude** and **skill evaluations** to overcome future challenges and remain adaptable.

Personalization & Mentorship:
Use a motivational tone, providing personalized guidance for ${message.fullname}. Acknowledge their strengths and challenges, and offer support for maintaining focus and enthusiasm on their path to becoming ${message.ambitions}.

 \n`);
    // Optionally, close stdin if no further input is required
    process.stdin.end();
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send("Error handling request");
  }
};

export { generateCareerPath };

