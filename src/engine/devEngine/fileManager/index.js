const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_PORT || 42069;
const getFiles = require("./get-files");
const cors = require("cors");
const path = require("path");
const nodeFetch = require('node-fetch');

app.use(express.json());
app.use(cors())

app.get('*', (req, res) => {
    if(/\.[a-z]+$/.test(req.originalUrl)) {
        nodeFetch(path.join(__dirname, '../../', req.originalUrl.replace(/^src\/?/, '')))
            .then(async(data) => {
                const imgBody = `data:${data.headers.get('content-type')};base64,${(await data.arrayBuffer()).toString('base64')}`
                res.send(imgBody)
            }).catch(err => console.error('nodeFetch error:', err.message))
    } else {
        const files = getFiles('./src' + req.originalUrl);
        res.status(200)
            .send(files);
    }
})

app.listen(PORT, () => {
    console.log(`[WireframeEngine -> Back-end] - File manager is online`);
})