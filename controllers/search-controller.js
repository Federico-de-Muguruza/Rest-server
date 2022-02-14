const {ObjectId} = require('mongoose').Types;
const {User, Categorie, Product} = require('../models');

const availablesCollections = [
    'users',
    'products',
    'categories',
    'roles'
];

const search = (req, res) => {

    const {collection, term} = req.params;

    if ( ! availablesCollections.includes(collection)) {
        return res.status(400).json({
            msg: 'Las colecciones permitidas son: ' + availablesCollections,
        });
    }

    switch(collection) {
        case 'users':
            searchUsers(term, res);
        break;
        case 'products':
            searchProducts(term, res);
        break;
        case 'categories':
            searchCategories(term, res);
        break;
        default:
            res.status(500).json({
                msg: 'Esta búsqueda no está implementada'
            });
    }
}

const searchProducts = async(term, res) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const product = await Product.findById(term).populate('categorie', 'name');
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({name: regex, state: true}).populate('categorie', 'name');

    res.json({
        results: products
    })
}

const searchCategories = async(term, res) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const categorie = await Categorie.findById(term);
        return res.json({
            results: (categorie) ? [categorie] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Categorie.find({name: regex, state: true});

    res.json({
        results: categories
    })
}

const searchUsers = async(term, res) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    // regex insensible a las mayúsculas y minúsculas
    const regex = new RegExp(term, 'i');
    // Busca por nombre o por correo y que el estado sea true
    const users = await User.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{state: true}]
    });
    res.json({
        results: users
    });
}

module.exports = {
    search
}