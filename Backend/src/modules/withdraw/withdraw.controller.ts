import { GenericController } from '../../core/controllers/base.controller';
import { IWithdraw } from './withdraw.model';
import { withdrawService } from './withdraw.service';
import jwt from "jsonwebtoken";

export class WithdrawController extends GenericController<IWithdraw> {
    private WithdrawService: withdrawService;
    constructor(withdrawService: withdrawService) {
        super(withdrawService);
        this.WithdrawService = withdrawService;
    }

    getAllWithdraws = async (_req: any, res: any) => {
        try {
            const withdraws = await this.WithdrawService.getAllWithdraws();
            res.json({ status: 'success', message: 'Withdraws fetched successfully', data: withdraws });
        } catch (error: any) {
            res.status(500).json({ status: 'error', message: 'Fetch withdraws failed', data: error.message });
        }
    }

    createWithdraw = async (req: any, res: any) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            const withdraw = req.body;
            withdraw.user = id;
            const savedWithdraw = await this.WithdrawService.createWithdraw(withdraw);
            res.json({ status: 'success', message: 'Withdraw created successfully', data: savedWithdraw });
        } catch (error: any) {
            res.status(500).json({ status: 'error', message: 'Create withdraw failed', data: error.message });
        }
    }

    updateStatus = async (req: any, res: any) => {
        try {
            const { id } = req.params;
            const { status, message } = req.body;
            const updatedWithdraw = await this.WithdrawService.updateStatus(id, status, message);
            res.json({ status: 'success', message: 'Withdraw status updated successfully', data: updatedWithdraw });
        } catch (error: any) {
            res.status(500).json({ status: 'error', message: 'Update withdraw status failed', data: error.message });
        }
    }
}