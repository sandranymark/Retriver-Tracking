import Joi from "joi";

export const dogValidation = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    nickname: Joi.string().max(30).allow(""),
    breed: Joi.string().min(3).max(50).required(),
    age: Joi.number().integer().min(0).max(30).required(),
    sex: Joi.string().valid("male", "female").required(),
    image: Joi.string().uri().allow(""),
});
