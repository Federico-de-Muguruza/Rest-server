const dbValidator = require('./db-validator');
const googleValidator = require('./google-validator');
const jwtGenerator = require('./jwt-generator');
const uploadFiles = require('./upload-files');

module.exports = {
    ...dbValidator,
    ...googleValidator,
    ...jwtGenerator,
    ...uploadFiles
}