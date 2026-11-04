import axios from 'axios'
import { useApiService } from "../../service/api.tsx";


const commissionBaseUrl = `${process.env.REACT_APP_API_URL}/commissions`;
const headers = {
    'Content-Type': 'application/json',
};

export const CommissionPostAPI = () => {
  const apiService = useApiService();

  const createCommission = async (receiverId: string, formData: any) => {
    try {
      const response = await apiService.post(`/v1/users/commission/${receiverId}`, formData);
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  return { createCommission };
};

// 🟢 Hàm lấy `commissionID`
export async function GetCommissionID() {
    try {
        const response = await axios.post(`${commissionBaseUrl}/request`);  // 🛠 Đảm bảo gọi đúng API lấy ID
        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi khi lấy CommissionID:", error);
        return null;
    }
}

// 🟢 Hàm tạo mới Commission
export async function CreateCommissionForm(value) {
    try {
        const response = await axios.post(`${commissionBaseUrl}/request`, value, { headers });  // 🛠 Gửi đúng API
        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi khi tạo Commission:", error);
        return null;
    }
}
