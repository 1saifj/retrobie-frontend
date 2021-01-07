import { UserInfoType } from '../state/reducers/userReducers';

export type DescriptionType = {
  long: string
  short: string
  copy: string
}

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
  description?: DescriptionType
  currency?: string
};

type ProductDetailType = {
  size: number;
  sizeCountry: string;
  sex: "M" | "F";
  primaryColor?: string
  secondaryColor?: string
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

export type PromiseThunk<T> = (payload) => Promise<T>

export type AddressType = {
  placeId?: string
  location?: string;
  lat: number;
  lng: number;
}

export interface BrandType {
  name: string
  description?: {
    long: string
  }
}

export type DeliveryType = {
  address: AddressType;
  cost: number;
  courierOrderNo?: string
}

export interface CheckoutType extends CartType {
  delivery: DeliveryType
  meta?: {
    zoomLevel?: number
  }
}

export interface CartItemType extends ProductType {
  name?: never;
  productName: string;
  quantity: number;
  price: number;
  stock: number;
  uuid?: string;
  productId: string;
  thumbnailUrl: string;
  parentProduct?: ProductType;
}

export type OrderStatus = 'incomplete' |
  'refunded' |
  'refunded_partially' |
  'declined' |
  'disputed' |
  'pending_payment' |
  'pending_confirmation' |
  'pending_dispatch' |
  'in_transit' |
  'delivered' |
  'cancelled';

export interface OrderType {
  status: OrderStatus,
  orderNo: string;
  uuid: string;
  cart: CartType;
  products?: Array<ProductType>;
  customer?: UserInfoType
  delivery?: DeliveryType
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

export type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
  avatar: ImageType
}
