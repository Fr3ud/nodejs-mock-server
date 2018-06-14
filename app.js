const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const apiVersion = require('./package').version;

app.set('port', 5000);

app.listen(app.get('port'), () => {
    console.log(`Node app is running on http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
    res.send(`<html><body><h1>My web app http API! Version ${apiVersion}</h1></body></html>`);
});

app.get('/api/:apiVersion/*', (req, res) => {
    let apiVersion = req.params.apiVersion;
    let filePath = `${req.path}/${req.method.toLowerCase()}.json`;

    filePath = filePath.replace(`/${apiVersion}/`, '/');
    filePath = path.join(__dirname, filePath);

    fs.stat(filePath, (err) => {
        res.set('Content-Type', 'application/json');

        if (err) {
            return res.send({ success: false });
        }
        fs.createReadStream(filePath).pipe(res);
    });
});