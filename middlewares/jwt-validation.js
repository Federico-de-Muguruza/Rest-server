const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtValidation = async(req = request, res = response, next) => {
    const token = req.header('apikey');

    if ( ! token) {
        return res.status(401).json({
            msg: 'No existe un token'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        if ( ! user || ! user.state) {
            return res.status(401).json({
                msg: 'El usuario se encuentra eliminado'
            });
        }

        // Guardo el usuario en el req para poder usarlo en los siguientes middlewares
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    jwtValidation
}