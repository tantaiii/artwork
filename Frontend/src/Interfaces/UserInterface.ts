import { Irole } from "./RoleInterfaces";

export interface GoogleUser {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: GLfloat;
}

export interface Account {
  //CẦN XÓA
  accountId: string;
  userName: String;
  roleID: string;
  password: string;
  email: string;
  status: boolean;
}

export interface Creator {
  //CẦN XÓA
  userId: number | undefined;
  accountId: number | "0";
  CreatorId: number | "0";
  coins: string | number;
  userName: string | "";
  profilePicture: string | "";
  backgroundPicture: string | "";
  firstName: string | "";
  lastName: string | "";
  address: string | "";
  phoneNumber: string | "0";
  lastLogin: string | undefined;
  CreateAt: string | undefined;
  dateOfBirth: string | undefined;
  allowCommission: boolean | false;
  biography: string | "";
  followCounts: number | 0;
  followerCount: number | 0;
  email: string;
  RankID: number;
  RoleID: number;
  vip: boolean;
  TypeOfRank: string;
  nameOfRank: string;
  amountArtworks: number;
}

export interface User {
  _id: number | undefined | string;
  coins: string | number;
  profilePicture: string | "";
  backgroundPicture: string | "";
  firstName: string | "";
  lastName: string | "";
  address: string | "";
  phoneNumber: string | "0";
  lastLogin: string | undefined;
  CreateAt: string | undefined;
  dateOfBirth: string | undefined;
  allowCommission: boolean; 
  biography: string | "";
  followCounts: number | 0;
  followerCount: number | 0;
  email: string;
  password: string;
  roleID: string | Irole;
  // SQL Server migration: `roleID` is now always the raw role id string; the
  // populated role object (with `.name`) is returned separately as `role`.
  role?: Irole;
  loginFailedCounts: number;
  loginFailedTime: Date | undefined;
  isActive: boolean;
}
