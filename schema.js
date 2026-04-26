const Joi = require("joi");
const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    image: Joi.object({
        url: Joi.string().allow("", null),
        filename: Joi.string().allow("", null)
    }),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});


module.exports = listingSchema;