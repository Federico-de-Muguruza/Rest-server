const {Router} = require('express');
const {check} = require('express-validator');
const {login, googleSignIn} = require('../controllers/auth-controller');
const { fieldValidation } = require('../middlewares/fields-validation');

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldValidation
], login);

router.post('/google', [
    check('id_token', 'El token de Google es requerido').not().isEmpty(),
    fieldValidation
], googleSignIn);

module.exports = router;