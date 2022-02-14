const {Schema, model} = require('mongoose');

const categorieSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatoria'],
        unique: true,
    },
    state: {
        type: Boolean,
        default: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Quito la __v y todos los demás datos se almacenan en categorie
categorieSchema.methods.toJSON = function() {
    const {__v, state, ...categorie} = this.toObject();
    return categorie;
}

module.exports = model('Categorie', categorieSchema);