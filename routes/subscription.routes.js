import Router from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription,getAllSubscriptions, getUserSubscriptions, updateSubscription, deleteSubscription,cancelSubscription,getUpcomingRenewals} from '../controllers/subscription.controller.js';
const subscriptionRouter = Router();

subscriptionRouter.get('/',authorize,getAllSubscriptions);
subscriptionRouter.get('/:id',authorize,getUserSubscriptions);
subscriptionRouter.post('/',authorize,createSubscription); // validate before they implement just call teh authorize

subscriptionRouter.put('/:id',authorize,updateSubscription);
subscriptionRouter.delete('/',authorize,deleteSubscription);
subscriptionRouter.get('/user/:id',authorize,getUserSubscriptions);

subscriptionRouter.put('/:id/cancel',authorize,cancelSubscription);
subscriptionRouter.get('/upcoming-renewals',authorize,getUpcomingRenewals);
export default subscriptionRouter;