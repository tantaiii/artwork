export interface Report {
  reportId?: number;
  reporterId: number;
  reportedId: number;
  artworkId?: number;
  description: string;
  createdDate?: string;
  status: number;
}
