const isAdmin = (req, res, next) => {
    
    if ( ! req.user) {
        return res.status(500).json({
            msg: 'No hay un usuario'
        });
    }

    const {role, name} = req.user;

    if (role !== 'ADMIN') {
        return res.status(401).json({
            msg: 'No eres administrador'
        });
    }

    next();
}

// Para recibir argumentos en un middleware necesitás retornar una función 
const hasRole = (...rols) => {

    return (req, res, next) => {

        if ( ! req.user) {
            return res.status(500).json({
                msg: 'No hay un usuario'
            });
        }

        if ( ! rols.includes(req.user.role)) {
            return res.status(401).json({
                msg: 'No estás autorizado para hacer eso'
            });
        }
        next();
    }
}

module.exports = {
    isAdmin,
    hasRole
}