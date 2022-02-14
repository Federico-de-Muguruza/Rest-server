const {Schema, model} = require('mongoose');

const productSchema = Schema({
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
    price: {
        type: Number,
        default: 0,
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true,
    },
    description: {
        type: String,
    },
    available: {
        type: Boolean,
        default: true,
    },
    avatar: {
        type: String
    }
});

// Quito la __v y todos los demás datos se almacenan en product
productSchema.methods.toJSON = function() {
    const {__v, state, ...product} = this.toObject();
    return product;
}

module.exports = model('Product', productSchema);