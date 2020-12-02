export type ProductType = {
  name: string;
  originalPrice: number;
  slug: string;
  price: number;
  stock: StockType;
  uuid: string;
  images?: Array<ImageType>;
  isOnOffer: boolean;
  detail?: ProductDetailType;
  meta?: ProductMetaType
};

type ProductDetailType = {
  size: number;
  sizeCountry: string;
  sex: "M" | "F";
}

type ProductMetaType = {
  style: string;
  condition: string;
}

export type StockType = {
  usersCount: number;
  adminCount: number;
};

export type ImageType = {
  url: string;
  thumbnailUrl: string;
};

export type CartType = {
  id: string;
  total: number;
  count: number;
  items: Array<CartItemType>;
};

export interface CartItemType extends ProductType {
  name: string;
  quantity: number;
  price: number;
  stock: number;
  uuid?: string;
  productId: string;
  thumbnailUrl: string;
  parentProduct?: ProductType;
}

export interface OrderType {
  status: string;
  orderNo: string;
  uuid: string;
  cart: CartType;
  products?: Array<ProductType>;
}

export interface AuthenticatedUser {
  tokenType: TokenType;
  id: number;
  username: string;
  isVerified: boolean;
  role: string;
  tokenId: string;
  iat: number;
  exp: number;
  aud: [string];
  iss: string;
  jti: string;
  userId: string;
}

export interface SchemaProps {
  [key: string]: {
    [key: string]: any;
  };
}
