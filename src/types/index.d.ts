import { UserInfoType } from '../state/reducers/userReducers';

export type DescriptionType = {
  long: string
  short: string
  seo: string
}

export type ProductType = {
  name: string;
  originalPrice: number;
  slug: string;
  price: number;
  inStock: number;
  uuid: string;
  brands?: Array<BrandType>
  images?: Array<ImageType>;
  isOnOffer: boolean;
  detail?: ProductDetailType;
  meta?: ProductMetaType
  description?: DescriptionType
  currency?: string
  adminProduct?: {
    inStock: number
  }
};

// This is the ProductType as represented/provided
// by Meilisearch
export type FilteredProduct = {
  price: number,
  sex: "M" | "F",
  size: number,
  style: string,
  slug: string,
  condition: string,
  uuid: string
  url: string,
  name: string
  thumbnailUrl: string
  brands?: BrandType,
  description?: string
}

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

export type ImageType = {
  fileId?: string
  url: string;
  thumbnailUrl: string;
};

export type CartType = {
  id: string;
  total: number;
  count: number;
  items: Array<CartItemType>;
};

export type ServerCartType = {
  id?: number;
  uuid: string;
  total: number;
  count: number;
  cartItems: Array<CartItemType>;
};

export type PromiseThunk<T> = (payload) => Promise<T>

export type AddressType = {
  latLng?: [number, number]
  placeId?: string
  location?: string;
  lat: number;
  lng: number;
}

export interface CategoryType {
  name: string;
  slug: string;
  uuid: string;
  landingImage: ImageType
  description: string
  products?: Array<ProductType>
}

export interface BrandType {
  uuid: string;
  name: string
  logo: ImageType
  description?: DescriptionType
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
  inStock: number;
  uuid?: string;
  productId: string;
  thumbnailUrl: string;
  parentProduct?: ProductType;
}

export type OrderStatus = 'incomplete' |
  'refunded' |
  'refundedPartially' |
  'declined' |
  'disputed' |
  'pendingPayment' |
  'pendingConfirmation' |
  'pendingDispatch' |
  'inTransit' |
  'delivered' |
  'cancelled';

export type PaymentStatus = 'initiated' |
  'processed' |
  'cancelled' |
  'errored'

export interface OrderType {
  status: OrderStatus,
  orderNo: string;
  uuid: string;
  cart: CartType;
  products?: Array<ProductType>;
  payment?: PaymentType
  paymentType?: string
  paymentMethod?: string
  customer?: UserInfoType
  delivery?: DeliveryType
}

export interface PaymentType {

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
  avatar: ImageType;
  isVerified: boolean
  message?: string
}

export type RoleType = 'ROLE_USER' | 'ROLE_ADMIN'
