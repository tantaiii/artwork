import { User } from "./UserInterface";
import { Tag } from "./TagInterface";

export interface ImageFile {
  imageFileFE: String;
  preview: string;
  image: string;
}

export interface Artwork {
  _id?: string;
  artworkName: string;
  description: string;
  likes: number;
  purchasable: boolean;
  price: number;
  imageFile: ImageFile;
  userID: string | User;
  status: string;
  views: number;
  comments: number;
  favorites: number;
  dateCreated: Date;
  tagID: String[] | Tag[];
}

export interface ArtworkPaymentStatus {
  status: boolean;
}

export interface DownloadArtwork extends Artwork {
  artworkID: string;
  creatorID: string;
  artworkName: string;
  description: string;
  dateCreated: Date;
  likes: number;
  purchasable: boolean;
  price: number;
  imageFile: ImageFile;
  idDowLoad: string;
  tagID: String[];
}

export interface ArtworkTransaction {
  transactionID: number;
  price: number;
  buyDate: string;
  sellerID: number;
  buyerID: number;
  artworkID: number;
}
