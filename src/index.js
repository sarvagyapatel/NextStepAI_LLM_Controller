import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import cors from 'cors';
import { generateAptitudeQuestions, generateSkillQuestions } from './controller/questionsController.js';
import { generateCareerPath } from './controller/careerPathController.js';
import { evaluateAnswers } from './controller/evaluationController.js';
import { chatController } from './controller/chatController.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if(data.type==='generateCareerPath'){
            generateCareerPath(data.content, ws);
        }else if(data.type==='generateaptitudeQuestions'){
            console.log(data)
            generateAptitudeQuestions( ws);
        }else if(data.type==='generateskillsQuestions'){
            console.log(data)
            generateSkillQuestions(data.content, ws);
        }else if(data.type==='evaluation'){
            evaluateAnswers(data.content, ws);
        }else if(data.type==='chat'){
            console.log(data.content)
            chatController(data.content, ws);
        }else{
            ws.send('Error: Invalid JSON format');
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



	 				

