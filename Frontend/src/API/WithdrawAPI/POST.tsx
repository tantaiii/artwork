import axios from "axios";
import { WithdrawInterfaces } from "../../Interfaces/WithdrawInterfaces";

export const SendWithdrawForm = async (withdrawData: Partial<WithdrawInterfaces>) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/withdraw`, withdrawData);
    return response.data;
  } catch (error) {
    console.error("Error in SendWithdrawForm:", error);
    throw error;
  }
};
