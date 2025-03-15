import Joi from "joi";

export const dogValidation = Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    nickname: Joi.string().max(30).allow("").optional(),
    breed: Joi.string().min(3).max(50).optional(),
    age: Joi.number().integer().min(0).max(30).optional(),
    sex: Joi.string().valid("male", "female").optional(),
    image: Joi.string().uri().allow("").optional(),
});
