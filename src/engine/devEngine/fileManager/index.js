const express = require('express');
const app = express();
const PORT = process.env.EXPRESS_PORT || 42069;
const getFiles = require("./get-files");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors())

app.get('*', (req, res) => { 
    const files = getFiles('./src/static' + req.originalUrl);
    res.status(200).send(files);
})

app.listen(PORT, () => {
    console.log(`[Engine -> FileManager] - File manager is online`);
})
