export interface ICommissionForm {
  commissionID: number | 0,
  receiverID: string | number, // Giữ nguyên để tương thích, nhưng API dùng "receiver"
  requestorID: string | number, // Giữ nguyên để tương thích, nhưng API dùng "requestor"
  description: string | "",
  accept: boolean | null,
  progress: number | 0,
}

export interface IExtraCommissionForm {
  commissionID: number | 0,
  receiverID: string | number, // Giữ nguyên để tương thích, nhưng API dùng "receiver"
  requestorID: string | number, // Giữ nguyên để tương thích, nhưng API dùng "requestor"
  description: string | "",
  accept: boolean | null,
  progress: number | 0,
  requestorEmail: string,
  requestorPhone: string,
  requestorUserName: string,
  receiverUserName: string,
  creationDate: string | null, // Thêm từ API
  acceptanceDate: string | null, // Thêm từ API
  completionDate: string | null, // Thêm từ API
}
export interface ICommissionID {
  commissionID: number | 0, // Chỉ giữ commissionID nếu cần thiết cho GetCommissionID
}