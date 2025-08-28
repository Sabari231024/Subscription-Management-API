import { workflowclient } from "../config/upstash.js";
import Subscriptions from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";


export const createSubscription = async (req,res,next) => {
    try{
        const subscription = await Subscriptions.create(
            {
                ...req.body,// should come after auth route
                user:req.user._id // to know which user tried to create the subscription
            }
        );
        await workflowclient.trigger({
            url:`${SERVER_URL}`,

        })
        res.status(201).json({
            success:true,
            data:subscription
        })
    }catch(error)
    {
        next(error);
    }
}

export const getUserSubscriptions = async (req,res,next) => {
    try{
        if(req.user.id != req.params.id){ // check if the user in the request is same as who logged in
            const error = new Error('You are not the owner of the account');
            error.status = 401;
            throw error; 
        }
        const subscriptions = await Subscriptions.find({user:req.params.id});
        res.status(200).json({success:true,data:subscriptions});
    }catch(error){
        next(error);
    }
}
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscriptions.find().populate("user", "email");
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    Object.assign(subscription, req.body); // merge updates
    await subscription.save();

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await subscription.deleteOne();
    res.status(200).json({ success: true, message: "Subscription deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (subscription.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Subscription already cancelled" });
    }

    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const renewals = await Subscriptions.find({
      renewalDate: { $gte: today, $lte: nextWeek },
      status: "active",
    });

    res.status(200).json({ success: true, data: renewals });
  } catch (error) {
    next(error);
  }
};
