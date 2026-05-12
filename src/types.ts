export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface GalleryImage {
  id?: string;
  imageUrl: string;
  caption?: string;
}

export interface Review {
  id?: string;
  customerName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
