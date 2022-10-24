const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_PORT || 42069;
const getFiles = require("./get-files");
const cors = require("cors");
const path = require("path");
const clc = require("cli-color");

app.use(express.json());
app.use(cors())

app.get('*', (req, res) => {
    if(/\.[a-z]+$/.test(req.originalUrl)) {
        // console.log(req.originalUrl, path.join(__dirname, '../../', req.originalUrl));
        res.sendFile(path.join(__dirname, '../../', req.originalUrl.replace(/^src\/?/, '')));
    } else {
        const files = getFiles('./src' + req.originalUrl);
        res.status(200)
            .send(files);
    }
})

app.listen(PORT, () => {
    const color = clc.bgXterm(238).black
    console.log(color(`                                                                 `));
    console.log(color(`   [WireframeEngine -> File Manager] - Listening on port ${PORT}   `));
    console.log(color(`                                                                 `));
})