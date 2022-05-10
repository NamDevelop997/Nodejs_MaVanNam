const { check, body, validationResult }     = require('express-validator');


let validationFormCategory = () => {
    return [
        check('name', 'Name is required!').notEmpty(),
        check('name', 'Name is more than 6 degits!').isLength({min: 6}),
        check('slug', 'Slug is more than 3 degits!').isLength({min: 3}),
        check('slug', 'Slug is required!').notEmpty(),
        check('status',"please select status!").notEmpty(),
        check('ordering', 'At least 1').isNumeric({min: 1}),
        check('content', 'Content is required!').notEmpty(),

    ];
}
module.exports = {
    validatorCategory :  validationFormCategory
}