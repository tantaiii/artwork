import {Router} from 'express';
import withdrawRouter from '../../modules/withdraw/withdraw.routes';

const router = Router();
router.use('/withdraws', withdrawRouter);

export default router;