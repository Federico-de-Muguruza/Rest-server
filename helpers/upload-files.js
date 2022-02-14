const path = require('path');
const {v4: uuidv4} = require('uuid');

const uploadFile = (files, availableExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {
        const {firstFile} = files;
        const firstFileSplit = firstFile.name.split('.');
        const extension = firstFileSplit[firstFileSplit.length - 1];
        
        if ( ! availableExtensions.includes(extension)) {
            reject(`No es una extensión válida, las extensiones válidas son: ${availableExtensions}`)
        }
        
        const fileNameTmp = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, `../uploads/`, folder, fileNameTmp);
        
        firstFile.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }
            resolve(fileNameTmp);
        });
    });
}

module.exports = {
    uploadFile,
}