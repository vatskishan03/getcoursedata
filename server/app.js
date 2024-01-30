const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path'); 
const cors = require('cors');

app.use(cors());

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'index.html')); 
});

app.get('/public/style.css', (req, res) => { 
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '..','public', 'style.css')); 
});


app.post('/courses', (req, res) => {
    const { company, difficulty, rating } = req.body;

    const pythonProcess = spawn('python', [path.join(__dirname, 'script.py'), company, difficulty, rating]);

    pythonProcess.on('error', (error) => {
        console.error(`Error initiating Python script: ${error}`);
    });

    let result = '';

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        console.log(result);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json(JSON.parse(result));
        } else {
            res.status(500).send('Error in Python script');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
