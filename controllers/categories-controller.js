const {Categorie} = require('../models');

const saveCategorie = async(req, res) => {

    const name = req.body.name.toUpperCase();
    const data = {
        name,
        user: req.user._id
    }

    try {
        const categorieExists = await Categorie.findOne({name});
        
        if (categorieExists) {
            return res.status(400).json({
                msg: 'La categoría ya existe'
            });
        }
        
        const categorie = new Categorie(data);
        await categorie.save();
        // await new Categorie(data).save();
        res.status(201).json({
            categorie
        });
    } catch (err) {
        res.json(err);
    }
}

const deleteCategorie = async(req, res) => {
    const id = req.params.id;

    const categorie = await Categorie.findByIdAndUpdate(id, {state: false}, {new: true});

    res.json(categorie);
}

const getCategories = async(req, res) => {
    const {limit = 5, from = 0} = req.query;
    if (limit > 0 && from >= 0) {
        const filter = {state: true};

        // Utilizamos Promise.all para que cada búqueda a la base da datos sea asíncrona y no dependa una de la otra
        // Desestructuramos el arreglo y la primera posición hace referencia a la primera promesa y la segunda a la segunda promesa
        const [total, categories] = await Promise.all([
            Categorie.countDocuments(filter),
            // Busca los usuarios con el state en true, o sea activos y hacemos un paginado
            Categorie.find(filter).populate('user', 'name').skip(Number (from)).limit(Number (limit))
        ]);

        res.json({
            total,
            categories
        });
    } else {
        res.json('El paginado no ha encontrado datos');
    }
}

const getCategorie = async(req, res) => {
    const {id} = req.params;

    const categorie = await Categorie.findById(id).populate('user', 'name');

    res.json(categorie);
}

const modifyCategorie = async(req, res) => {
    const {id} = req.params;
    // Guardo todo menos el state y el user en un objeto data
    const {state, user, ...data} = req.body;
    const name = req.body.name;
    try {
        const existsCategorie = await Categorie.findOne({name});
        if (existsCategorie) {
            return res.status(400).json({
                msg: 'El nombre de la categoría ya existe'
            });
        }
        
        // Edito los atributos del objeto data
        data.name = name.toUpperCase();
        data.user = req.user._id;
        // el new true sirve para reflejar en la respuesta el dato actualizado
        const categorie = await Categorie.findByIdAndUpdate(id, data, {new: true});
        res.json(categorie);
    } catch (err) {
        res.json(err);
    }
}

module.exports = {
    saveCategorie,
    deleteCategorie,
    getCategories,
    getCategorie,
    modifyCategorie
}