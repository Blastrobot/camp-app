const baseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (Joi) => ({
    type: "string",
    base: Joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value })
                return clean;
            }
        }
    }
})

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
})

// First require and then min, max, other way around, the rating does not go through validation, because there will always be missing data
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})