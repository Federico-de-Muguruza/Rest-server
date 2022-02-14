const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Se ha establecido la conexión a la base de datos.');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión con la base de datos.');
    }
}

module.exports = {
    dbConnection
}