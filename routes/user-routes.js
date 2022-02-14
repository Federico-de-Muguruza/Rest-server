const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');
const {getUsers, postUser, putUser, deleteUser} = require('../controllers/user-controller');
const {isValidRole, existsEmail, existsUser} = require('../helpers/db-validator');
// Va a buscar el index.js automáticamente
const {fieldValidation, jwtValidation, hasRole} = require('../middlewares')

router.get('/', getUsers);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 5 carácteres').isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(), 
    check('email').custom(existsEmail),
    check('role').custom(isValidRole),
    fieldValidation
], postUser);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsUser),
    check('name', 'El nombre es obligatorio').not().isEmpty().optional(),
    check('password', 'La contraseña debe tener más de 5 carácteres').isLength({min: 6}).optional(),
    check('email', 'El correo no es válido').isEmail().optional(), 
    check('email').custom(existsEmail).optional(),
    check('role').custom(isValidRole).optional(),
    fieldValidation
], putUser);

router.delete('/:id', [
    jwtValidation,
    hasRole('ADMIN', 'SELLER'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsUser),
    fieldValidation
], deleteUser);

module.exports = router;