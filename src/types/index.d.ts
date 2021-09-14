import {UserInfoType} from '../state/reducers/userReducers';

export type DescriptionType = {
  long: string;
  short: string;
  seo: string;
};

export type ProductType = {
  name: string;
  originalPrice: number;
  slug: string;
  price: number;
  inStock: number;
  uuid: string;
  brands?: Array<BrandType>;
  images?: Array<ImageType>;
  isOnOffer: boolean;
  detail?: ProductDetailType;
  meta?: ProductMetaType;
  description?: DescriptionType;
  defaultVariant?: VariantType
  variants?: VariantType[]
  currency?: string;
  stock?: StockType
  adminProduct?
};

// This is the ProductType as represented/provided
// by Meilisearch
export type FilteredProduct = {
  price: number;
  originalPrice: number;
  sex: 'M' | 'F';
  size: number;
  style: string;
  slug: string;
  isInStock: boolean;
  quantity?: number
  condition: string;
  uuid: string;
  url: string;
  name: string;
  thumbnailUrl: string;
  brands?: BrandType;
  description?: string;
};

type ProductDetailType = {
  size: number;
  sizeCountry: string;
  sex: 'M' | 'F';
  primaryColor?: string;
  secondaryColor?: string;
};

type ProductMetaType = {
  style: string;
  condition: string;
};

export interface VariantType {
  optionValues?: Array<ProductTypeOptionValue>;
  uuid?: string;
  slug?: string;
  name?: string
  originalPrice: number;
  id?: number;
  productId?: number;
  images?: ImageType[];
  categories?: CategoryType[];
  product?: ProductType;
  description?: DescriptionType;
  stock?: StockType
}

export interface StockType {
  uuid?: string
  warehouse?: WarehouseType
  quantity?: number
}

export interface WarehouseType {
  id?: number
  uuid?: string
  address?: AddressType
}


export type ImageType = {
  fileId?: string;
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

export type PromiseThunk<T> = (payload) => Promise<T>;

export type AddressType = {
  latLng?: [number, number];
  placeId?: string;
  location?: string;
  lat: number;
  lng: number;
};

export interface CategoryType {
  name: string;
  slug: string;
  uuid: string;
  landingImage: ImageType;
  description: DescriptionType;
  products?: Array<ProductType>;
}

export interface BrandType {
  uuid: string;
  name: string;
  slug: string;
  logo: ImageType;
  description?: DescriptionType;
}

export interface ProductTypeType {
  uuid: string;
  name: string;
  options: ProductTypeOption[];
  slug?: string;
}

export interface ProductTypeOption {
  uuid: string;
  name: string;
  values: ProductTypeOptionValue[];
}

export interface ProductTypeOptionValue {
  uuid: string;
  value: string;
  option?: ProductTypeOption
}

export type DeliveryType = {
  address: AddressType;
  cost: number;
  courierOrderNo?: string;
};

export interface CheckoutType extends CartType {
  delivery: DeliveryType;
  meta?: {
    zoomLevel?: number;
  };
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

export type OrderStatus =
  | 'incomplete'
  | 'refunded'
  | 'refundedPartially'
  | 'declined'
  | 'disputed'
  | 'pendingPayment'
  | 'pendingConfirmation'
  | 'pendingDispatch'
  | 'inTransit'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'initiated' | 'processed' | 'cancelled' | 'errored';

export interface OrderType {
  status: OrderStatus;
  orderNo: string;
  uuid: string;
  cart: CartType;
  products?: Array<ProductType>;
  payment?: PaymentType;
  paymentType?: string;
  paymentMethod?: string;
  customer?: any;
  delivery?: DeliveryType;
}

export interface PaymentType {}

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
  isVerified: boolean;
  message?: string;
};

export type RoleType = 'ROLE_USER' | 'ROLE_ADMIN';
