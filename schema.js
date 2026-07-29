const Joi = require("joi");

module.exports = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(""),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});