import { ICommissionForm, IExtraCommissionForm } from "../../Interfaces/CommissionForm"
import axios from 'axios'
import { GetUserNameById } from "../UserAPI/GET.tsx"
import { useApiService } from "../../service/api.tsx";

const commissionV1Url = `v1/commissions/`;

export const useCommissionGetAPI = () => {
  const apiService = useApiService();

  const getCommissionByRecieverId = async (id: string) => {
    try {
      const response = await apiService.get(`${commissionV1Url}receiver/${id}`);
      console.log("🟢 API trả về danh sách commission:", response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getCommissionByRequestorId = async () => {
    try {
      const response = await apiService.get(`${commissionV1Url}requestor`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  return { getCommissionByRecieverId, getCommissionByRequestorId };
}
export async function GetCommissionRequestorById(id: string) {
  try {
    const response = await axios.get(getcommissionrequestorurl + id);
    console.log("🟢 API trả về danh sách commission:", response.data);

    // Duyệt từng commission và thêm artworkURL
    const formattedData: IExtraCommissionForm[] = await Promise.all(
      response.data.map(async (comm: any) => {
        let userName = "Unknown User"; // Giá trị mặc định
        let receiverUserName = "Unknown User"; // Giá trị mặc định
        try {
          userName = await GetUserNameById(comm.receiver); // Gọi API lấy username từ firstName + lastName
          receiverUserName = await GetUserNameById(comm.requestor); // Gọi API lấy username từ firstName + lastName
        } catch (error) {
          console.error(`⚠️ Không lấy được userName cho requestorID: ${comm.requestor}`, error);
        }

        return {
          commissionID: comm.commissionID,
          receiverID: comm.receiver,
          requestorID: comm.requestor,
          description: comm.description,
          accept: comm.accept !== undefined ? comm.accept : null,
          progress: comm.progress,
          requestorEmail: comm.email,
          requestorPhone: comm.phoneNumber,
          receiverUserName: userName, // Đã lấy từ API
          creationDate: comm.creationDate,
          acceptanceDate: comm.acceptanceDate,
          completionDate: comm.completionDate,
          requetorUserName: receiverUserName,
          artworkURL: comm.artworkURL || null, // Đảm bảo artworkURL có giá trị hợp lệ
        };
      })
    );

    return formattedData;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API GetCommissionRequestorById:", err);
    return [];
  }
}



export async function GetCommissionRecieverById() {
  try {
    const response = await axios.get(getAllCommission);
    console.log("🟢 API trả về danh sách commission:", response.data);

    // Duyệt từng commission và thêm artworkURL
    const formattedData: IExtraCommissionForm[] = await Promise.all(
      response.data.map(async (comm: any) => {
        let userName = "Unknown User"; // Giá trị mặc định
        let receiverUserName = "Unknown User"; // Giá trị mặc định
        try {
          userName = await GetUserNameById(comm.receiver); // Gọi API lấy username từ firstName + lastName
          receiverUserName = await GetUserNameById(comm.requestor); // Gọi API lấy username từ firstName + lastName
        } catch (error) {
          console.error(`⚠️ Không lấy được userName cho requestorID: ${comm.requestor}`, error);
          console.error(`⚠️ Không lấy được userName cho requestorID: ${comm.receiver}`, error);
        }

        return {
          commissionID: comm.commissionID,
          receiverID: comm.receiver,
          requestorID: comm.requestor,
          description: comm.description,
          accept: comm.accept !== undefined ? comm.accept : null,
          progress: comm.progress,
          requestorEmail: comm.email,
          requestorPhone: comm.phoneNumber,
          receiverUserName: userName, // Đã lấy từ API
          creationDate: comm.creationDate,
          acceptanceDate: comm.acceptanceDate,
          completionDate: comm.completionDate,
          requetorUserName: receiverUserName,
          artworkURL: comm.artworkURL || null, // Đảm bảo artworkURL có giá trị hợp lệ
        };
      })
    );

    return formattedData;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API GetCommissionRequestorById:", err);
    return [];
  }
}