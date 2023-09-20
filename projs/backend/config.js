// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';

dotenv.config();

export default {
   PORT: process.env.PORT || 5000,
   PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
};
