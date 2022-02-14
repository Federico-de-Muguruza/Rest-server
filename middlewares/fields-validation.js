const {validationResult} = require('express-validator');

const fieldValidation = (req, res, next) => {
    const errors = validationResult(req);
    if ( ! errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    // Si llega a este punto es porque no hay errores por lo que el next le dice que prosiga 
    next();
}

module.exports = {
    fieldValidation
}
