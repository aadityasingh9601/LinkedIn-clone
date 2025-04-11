import Joi from "joi";

const signupSchema = Joi.object({
  signupData: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required().min(3).max(16),
  }).required(),
});

const loginSchema = Joi.object({
  loginData: Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required().min(3).max(16),
  }).required(),
});

const postSchema = Joi.object({
  postData: Joi.object({
    content: Joi.string().min(50).required(),
    media: Joi.any(),
    category: Joi.string().required(),
    postType: Joi.string(),
    date: Joi.string(),
    time: Joi.string(),
  }).required(),
});

export { signupSchema, loginSchema, postSchema };
