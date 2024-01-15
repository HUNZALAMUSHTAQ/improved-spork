const httpStatus = require('http-status');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { stripeService, userService } = require('../services');

const createCheckoutSession = catchAsync(async (req, res) => {
  const session = await stripeService.createCheckOutSession(req.body, req.user);
  await userService.updateUserById(req.user.id, {
    checkOutSessionId: session.id,
  });
  res.status(httpStatus.CREATED).send({ url: session.url });
});

const updatePaymentPlan = catchAsync(async (userId, sessionID) => {
  let session = null;
  const objectId = mongoose.Types.ObjectId(userId);
  const user = await userService.getUserById(objectId);
  let userUpdateObject = {};
  let totalTokens = user.tokens;
  if (user && sessionID) {
    session = await stripeService.getCheckOutSession(sessionID);
    if (session.payment_status === 'paid') {
      totalTokens = Number(totalTokens || 0) + Number(session?.metadata?.tokenNeedsToAdd || 0);
      userUpdateObject = {
        tokens: totalTokens,
      };
      if (!session.subscription) {
        userUpdateObject = {
          ...userUpdateObject,
          // paymentType: session?.metadata?.paymentType,
          // paymentPlan: session?.metadata?.paymentPlan,
        };
      } else {
        userUpdateObject = {
          stripeSubscription: await stripeService.getSubscription(session.subscription),
          paymentType: session?.metadata?.paymentType,
          paymentPlan: session?.metadata?.paymentPlan,
        };
      }
    }

    await userService.updateUserById(user.id, userUpdateObject);
  }
});

const cancelSubscription = catchAsync(async (req, res) => {
  if (req.user.stripeSubscription) {
    await stripeService.cancelSubscription(req.user.stripeSubscription.id);
    await userService.updateUserById(req.user.id, {
      stripeSubscription: null,
      paymentType: null,
      paymentPlan: null,
    });
  }
  res.status(httpStatus.NO_CONTENT).send();
});
const stripeWebHook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  /* eslint-disable no-case-declarations */
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      updatePaymentPlan(session.metadata.userId, session.id);

      break;
    case 'invoice.paid':
      const invoice = event.data.object;
      // stripeSubscription
      const subscription = await stripeService.getSubscription(invoice.subscription);
      const objectId = mongoose.Types.ObjectId(subscription.metadata.userId);
      const user = await userService.getUserById(objectId);
      if (user?.stripeSubscription?.id) {
        await stripeService.cancelSubscription(user.stripeSubscription.id);
      }
      let userUpdateObject = {};
      let totalTokens = user.tokens;
      totalTokens += Number(subscription?.metadata?.tokenNeedsToAdd || 0);
      userUpdateObject = {
        tokens: totalTokens,
        paymentType: subscription?.metadata?.paymentType,
        paymentPlan: subscription?.metadata?.paymentPlan,
      };
      await userService.updateUserById(user.id, userUpdateObject);

      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      // const portalSession = await stripe.billingPortal.sessions.create({
      //   customer: '{{CUSTOMER_ID}}',
      //   return_url: 'https://example.com/account/overview',
      //   flow_data: {
      //     type: 'payment_method_update',
      //   },
      // });
      break;
    default:
    // Unhandled event type
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).end();
});

module.exports = {
  createCheckoutSession,
  updatePaymentPlan,
  cancelSubscription,
  stripeWebHook,
};
