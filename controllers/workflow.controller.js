import {createRequire} from 'module';
import Subscriptions from '../models/subscription.model.js';
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';
const require = createRequire(import.meta.url)
const serve = require('@upstash/workflow/express'); //written in commong js so import won't work
const REMINDERS = [7,5,2,1];
export const sendreminders = serve(async (context) => { //quite different from the normal req, res -> serve comes fromt he upstash
    const subscriptionId = context.requestPayload;
    const subscription = await fetchSubscription(context,subscriptionId);
    if(!subscription || subscription.status != 'active') return; //kill it and directly return since no subscription found
    const renewalDate = dayjs(subscription.renewalDate);// some date operations are there so use dayjs - this is same as new Date(subscriptions.renewableDate) - dayjs offers more functionalities
    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }
for(const daysBefore of REMINDERS){
    const reminderDate = renewalDate.subtract(daysBefore,'day');
    if(reminderDate.isAfter(dayjs())){
        //put it to sleep until th eevent comes
        await sleepUntilreminder(context,'Reminder for the subscription that will soon get expired',reminderDate)
    }
    await triggerReminder(context,'reminder to pay guys!!');
}
});
const sleepUntilreminder = async (context,label,date)=>{
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntilreminder(label,date.toDate());
}
const triggerReminder = async (context,label) => {
    return await context.run(label,async ()=>{
        console.log(`Triggering ${label} reminder`);
        //sedn an email , SMS or push notification
        await sendReminderEmail(
            {
                to: Subscriptions.user.email,
                type: Subscriptions.label.subscription,
            }
        )
    });
}
const fetchSubscription = async (context,subscriptionId) => {
    return await context.run("get subscription",async ()=>{
        return Subscriptions.findById(subscriptionId).populate('user','name email');
    })
}