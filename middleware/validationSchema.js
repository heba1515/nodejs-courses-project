const {body} = require('express-validator');

const validationSchema = ()=>{
    return [
                body('title')
                    .notEmpty()
                    .withMessage('title not provided'),
                body('price')
                    .notEmpty()
                    .withMessage('price not provided')
            ]
}

module.exports = {
    validationSchema
}