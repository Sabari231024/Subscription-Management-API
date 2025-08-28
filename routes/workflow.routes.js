import {Router} from 'express';
import { sendreminders } from '../controllers/workflow.controller.js';

const workflowRouter = Router();

workflowRouter.post('/',sendreminders);
export default workflowRouter;
