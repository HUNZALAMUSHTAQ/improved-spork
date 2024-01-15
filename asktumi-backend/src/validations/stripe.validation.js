const Joi = require('joi');

const checkoutSession = {
  body: Joi.object().keys({
    paymentType: Joi.string().valid('oneTime', 'monthly').required(),
    paymentPlan: Joi.string().required(),
  }),
};

module.exports = {
  checkoutSession,
};
