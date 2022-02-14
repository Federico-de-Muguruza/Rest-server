const {response} = require('express');
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const {generateJWT} = require('../helpers/jwt-generator');
const { googleValidator } = require('../helpers/google-validator');

const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        // Verifico que el correo existe y que no esté borrada la cuenta (activa)
        const user = await User.findOne({email});
        if ( ! user || ! user.state) {
            return res.status(400).json({
                msg: 'El usuario no existe'
            });
        }

        // Verifico la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if ( ! validPassword) {
            return res.status(400).json({
                msg: 'La contraseña no es correcta'
            });
        }

        // Genero el JWT
        const token = await generateJWT(user.id);
    
        res.json({
            user, 
            token
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salió mal',
            error
        })
    }
}

const googleSignIn = async(req, res) => {
    const {id_token} = req.body;

    try {
        const {email, name, picture} = await googleValidator(id_token);

        let user = await User.findOne({email});

        // Si caundo logueo con Google y no existe en mi bdd ese usuario
        if ( ! user) {
            const data = {
                name,
                email,
                password: '',
                avatar: picture,
                google: true
            }
            user = new User(data);
            await user.save();
        }

        if ( ! user.state) {
            return res.status(401).json({
                msg: 'El usuario se encuentra bloqueado'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        json.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}