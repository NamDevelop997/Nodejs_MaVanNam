const { check, body, validationResult }     = require('express-validator');


let validationFormUsers = () => {
    return [
        check('name', 'Name is required!').notEmpty(),
        check('name', 'Name is more than 6 degits!').isLength({min: 6}),
        check('status',"please select status!").notEmpty(),
        check('ordering', 'At least 1').isNumeric({min: 1}),
        check('content', 'Content is required!').notEmpty(),
        check('group_acp', 'Choice group-ACP!').notEmpty(),
    ];
}
module.exports = {
    validatorUsers :  validationFormUsers
}