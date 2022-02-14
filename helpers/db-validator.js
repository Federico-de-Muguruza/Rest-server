const {Role, User, Categorie, Product} = require('../models');

const isValidRole = async(role = '') => {
    const existsRole = await Role.findOne({role});
    if ( ! existsRole)
        throw new Error('El rol no es correcto');
}

const existsEmail = async(email = '') => {
    const emailExists = await User.findOne({email});
    if (emailExists) 
        throw new Error('El correo ya está registrado');
}

const existsUser = async(id = '') => {
    const user = await User.findById(id);
    if ( ! user)
        throw new Error('El usuario no existe');
}

const existsCategorie = async(id = '') => {
    const categorie = await Categorie.findById(id);
    if ( ! categorie)
        throw new Error('La categoría no existe');
}

const existsProductByName = async(name = '') => {
    name = name.toUpperCase();
    const product = await Product.findOne({name});
    if (product)
        throw new Error('El producto ya existe');
}

const existsProductById = async(id = '') => {
    const product = await Product.findById(id);
    if ( ! product)
        throw new Error('El producto no existe');
}

const availableCollections = (collection = '', collections = []) => {

    const isIncluded = collections.includes(collection);

    if ( ! isIncluded)
        throw new Error(`La colección ${collection} no está permitida`);

    return true;
}

module.exports = {
    isValidRole,
    existsEmail,
    existsUser,
    existsCategorie,
    existsProductByName,
    existsProductById,
    availableCollections,
}