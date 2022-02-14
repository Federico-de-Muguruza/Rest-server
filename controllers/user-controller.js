const {response} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getUsers = async(req, res = response) => {

    // const {q, name = 'No name', apikey, page = 1, limit} = req.query; 

    const {limit = 5, from = 0} = req.query;
    if (limit > 0 && from >= 0) {
        const filter = {state: true};

        // Utilizamos Promise.all para que cada búqueda a la base da datos sea asíncrona y no dependa una de la otra
        // Desestructuramos el arreglo y la primera posición hace referencia a la primera promesa y la segunda a la segunda promesa
        const [total, users] = await Promise.all([
            User.countDocuments(filter),
            // Busca los usuarios con el state en true, o sea activos y hacemos un paginado
            User.find(filter).skip(Number (from)).limit(Number (limit))
        ]);

        res.json({
            total,
            users
        });
    } else {
        res.json('El paginado no ha encontrado datos');
    }

}

const postUser = async(req, res = response) => {

    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.json({
        user
    });
}

const putUser = async(req, res = response) => {

    const id = req.params.id;
    // Eligo que datos no quiero poner en rest para actualizarlos más abajo
    const {_id, __v, password, google, ...rest} = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json({
        user
    });
}

const deleteUser = async(req, res = response) => {

    const id = req.params.id;

    // Lo borramos
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {state: false});

    res.json(user);
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}