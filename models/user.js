const {Schema, model} = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio.']
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'USER', 'SELLER']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

// Quito la __v y el password y todos los demás datos se almacenan en user
userSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', userSchema);