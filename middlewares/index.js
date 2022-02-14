// Aquí se guardará una referencia a todos los middlewares para que las importaciones sean más limpias
const fieldValidation = require('../middlewares/fields-validation');
const jwtValidation = require('../middlewares/jwt-validation');
const hasRole = require('../middlewares/role-validation');
const uploads = require('./uploads-validation');

module.exports = {
    ...fieldValidation,
    ...jwtValidation,
    ...hasRole,
    ...uploads
}