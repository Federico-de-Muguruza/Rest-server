const Auth = require('./auth-controller');
const Categories = require('./categories-controller');
const User = require('./user-controller');
const Products = require('./products-controller');
const Search = require('./search-controller');

module.exports = {
    ...Auth,
    ...Categories,
    ...User,
    ...Products,
    ...Search
}