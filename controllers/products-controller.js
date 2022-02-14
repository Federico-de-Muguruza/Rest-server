const {Product} = require("../models");

const getProducts = async(req, res) => {
    const {limit = 5, from = 0} = req.query;
    if (limit > 0 && from >= 0) {
        const filter = {state: true};

        // Utilizamos Promise.all para que cada búqueda a la base da datos sea asíncrona y no dependa una de la otra
        // Desestructuramos el arreglo y la primera posición hace referencia a la primera promesa y la segunda a la segunda promesa
        const [total, products] = await Promise.all([
            Product.countDocuments(filter),
            // Busca los usuarios con el state en true, o sea activos y hacemos un paginado
            Product.find(filter)
            .populate('user', 'name')
            .populate('categorie', 'name')
            .skip(Number (from))
            .limit(Number (limit))
        ]);

        res.json({
            total,
            products
        });
    } else {
        res.json('El paginado no ha encontrado datos');
    }
}

const saveProduct = async(req, res) => {
    const {state, user, ...data} = req.body;
    data.user = req.user._id;
    data.name = req.body.name.toUpperCase();

    try {
        const product = new Product(data);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({
            msg: 'No se ha podido subir el producto'
        });
    }
}

const getProduct = async(req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id).populate('user', 'name').populate('categorie', 'name');
        res.json(product);
    } catch (err) {
        res.status(400).json({
            msg: 'No se ha encontrado el producto'
        });
    }
}

const deleteProduct = async(req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findByIdAndUpdate(id, {state: false}, {new: true});
        res.json(product);
    } catch (err) {
        res.status(400).json({
            msg: 'No se ha podido borrar'
        });
    }
}

const modifyProduct = async(req, res) => {
    const id = req.params.id;

    const {state, user, ...data} = req.body;
    data.user = req.user._id;

    if (data.name)
        data.name = data.name.toUpperCase();

    try {
        const product = await Product.findOneAndUpdate(id, data, {new: true});
        res.json(product);
    } catch (err) {
        res.status(400).json({
            msg: 'No se ha podido actualizar'
        });
    }
}

module.exports = {
    getProducts,
    saveProduct,
    getProduct,
    deleteProduct,
    modifyProduct
}