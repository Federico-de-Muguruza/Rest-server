const {Router} = require('express');
const {check} = require('express-validator');
const { fieldValidation, existsFile } = require('../middlewares');
const {saveFile, modifyAvatarCloudinary, getAvatar} = require('../controllers/uploads');
const {availableCollections} = require('../helpers');

const router = Router();

router.post('/', existsFile, saveFile)

router.put('/:collection/:id', [
    existsFile,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('collection').custom(c => availableCollections(c, ['users', 'products'])),
    fieldValidation
], modifyAvatarCloudinary)

router.get('/:collection/:id', [
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('collection').custom(c => availableCollections(c, ['users', 'products'])),
    fieldValidation
], getAvatar)

module.exports = router;