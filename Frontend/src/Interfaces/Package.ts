export interface Package {
  _id: string;
  name: string;
  price: number;
}

export interface CurrentPackage {
  userID?: string | undefined;
  rankID?: string | undefined;
  dateStartToRent?: Date | undefined;
  dateEndToRent?: Date | undefined;
  limitUpload?: number | undefined;
}
