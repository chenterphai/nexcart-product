import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: {
      code: 1,
      status: 'failed',
      msg: 'You have sent too many requests in a given amount of time. Please try againlater.',
    },
  },
});

export default limiter;