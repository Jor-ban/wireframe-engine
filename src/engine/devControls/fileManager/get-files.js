const fs = require('fs');

module.exports = function getFiles(dir, files_ = []){
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files){
        let path = String(dir + '/' + files[i]).replaceAll('//', '/');
        if (fs.statSync(path).isDirectory()){
            files_.push({
                name: files[i],
                path: path,
                isFolder: true,
            })
        } else {
            files_.push({
                name: files[i],
                path: path,
                isFolder: false,
            });
        }
    }
    return files_;
}