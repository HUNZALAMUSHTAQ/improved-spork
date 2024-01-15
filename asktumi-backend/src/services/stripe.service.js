const httpStatus = require('http-status');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const ApiError = require('../utils/ApiError');

const paymentPlans = {
  oneTime: {
    plan100: {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'leXos 100',
        },
        // 100 dollar
        unit_amount: 10000,
      },
      quantity: 1,
    },
    plan200: {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'leXos 200',
        },
        // 200 dollar
        unit_amount: 20000,
      },
      quantity: 1,
    },
  },
  monthly: {
    plan300: {
      price: process.env.STRIPE_PRODUCT_1,
      quantity: 1,
    },
    plan400: {
      price: process.env.STRIPE_PRODUCT_2,
      quantity: 1,
    },
  },
};

const getPlanTokens = {
  plan100: 100,
  plan200: 200,
  plan300: 300,
  plan400: 500,
};

const getPaymentMode = {
  plan100: 'payment',
  plan200: 'payment',
  plan300: 'subscription',
  plan400: 'subscription',
};
/**
 * Create a Customer
 * @param {Object} customerDetails
 * @returns {Promise<Customer>}
 */

const createCustomer = async (customerDetails) => {
  const customer = await stripe.customers.create({
    name: customerDetails.name,
    email: customerDetails.email,
    description: customerDetails.description,
  });

  return customer;
};

/**
 * Create a Checkout Session
 * @param {Object} userBody
 * @returns {Promise<string>}
 */
const createCheckOutSession = async (userBody, user) => {
  let selectedPlan = {};
  if (paymentPlans[userBody.paymentType] && paymentPlans[userBody.paymentType][userBody.paymentPlan]) {
    selectedPlan = paymentPlans[userBody.paymentType][userBody.paymentPlan];
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment plan not found');
  }

  const sessionObj = {
    billing_address_collection: 'auto',
    line_items: [{ ...selectedPlan }],
    customer: user.stripeCustomer.id,
    metadata: {
      userId: user.id,
      paymentType: userBody.paymentType,
      paymentPlan: userBody.paymentPlan,
      tokenNeedsToAdd: getPlanTokens[userBody.paymentPlan],
    },
    mode: getPaymentMode[userBody.paymentPlan],
    success_url: `${process.env.FRONTEND_BASE_URL}/pages/payment/success?paymentType=${userBody.paymentType}&paymentPlan=${userBody.paymentPlan}&currentToken=${user.tokens}&addToken=${getPlanTokens[userBody.paymentPlan]}`,
    cancel_url: `${process.env.FRONTEND_BASE_URL}/pages/payment/fail?paymentType=${userBody.paymentType}&paymentPlan=${userBody.paymentPlan}`,
  };
  if (sessionObj.mode === 'subscription') {
    // sessionObj.payment_intent_data = {
    //   metadata: sessionObj.metadata,
    // }
    sessionObj.subscription_data = {
      metadata: sessionObj.metadata,
    };
  }
  const session = await stripe.checkout.sessions.create(sessionObj);
  return session;
};

const getCheckOutSession = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

const getSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
};

const cancelSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
};

module.exports = {
  createCheckOutSession,
  createCustomer,
  getCheckOutSession,
  getSubscription,
  cancelSubscription,
};
