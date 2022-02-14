const {Router} = require('express');
const {check} = require('express-validator');
const { fieldValidation, jwtValidation, hasRole } = require('../middlewares');
const {getProducts, saveProduct, getProduct, deleteProduct, modifyProduct} = require('../controllers/products-controller');
const {existsProductById, existsProductByName, existsCategorie} = require('../helpers/db-validator');

const router = Router();

/**
 * {{url}}/api/products
 */

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existsProductById),
    fieldValidation
], getProduct);

router.post('/', [
    jwtValidation,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categorie', 'La categoría es obligatoria').not().isEmpty(),
    check('categorie', 'No es un id válido').isMongoId(),
    check('categorie', 'No existe la categoría').custom(existsCategorie),
    check('name').custom(existsProductByName),
    fieldValidation
], saveProduct);

router.put('/:id', [
    jwtValidation,
    check('id', 'El id no es válido').isMongoId(),
    check('name', 'Debes introducir un nombre').optional().not().isEmpty(),
    check('price', 'Debes introducir un precio').optional().not().isEmpty(),
    check('available', 'Debes fijar si está disponible').optional().isBoolean(),
    check('categorie', 'Debes introducir una categoría').optional().not().isEmpty(),
    check('categorie', 'No es un id válido').optional().isMongoId(),
    hasRole('ADMIN'),
    check('id').custom(existsProductById),
    fieldValidation
], modifyProduct);

router.delete('/:id', [
    jwtValidation,
    check('id', 'El id no es válido').isMongoId(),
    hasRole('ADMIN'),
    check('id').custom(existsProductById),
    fieldValidation
], deleteProduct);

module.exports = router;