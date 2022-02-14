const {Router} = require('express');
const {check} = require('express-validator');
const { fieldValidation, jwtValidation, hasRole } = require('../middlewares');
const {saveCategorie, deleteCategorie, getCategories, getCategorie, modifyCategorie} = require('../controllers/categories-controller');
const {existsCategorie} = require('../helpers/db-validator');

const router = Router();

/**
 * {{url}}/api/categories
 */

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existsCategorie),
    fieldValidation
], getCategorie);

router.post('/', [
    jwtValidation,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldValidation
], saveCategorie);

router.put('/:id', [
    jwtValidation,
    check('id', 'El id no es válido').isMongoId(),
    hasRole('ADMIN'),
    check('id').custom(existsCategorie),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldValidation
], modifyCategorie);

router.delete('/:id', [
    jwtValidation,
    check('id', 'El id no es válido').isMongoId(),
    hasRole('ADMIN'),
    check('id').custom(existsCategorie),
    fieldValidation
], deleteCategorie);

module.exports = router;