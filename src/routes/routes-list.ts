import {lazy} from 'react';

const Cart = lazy(() => import('../pages/cart'));
const Landing = lazy(() => import('../pages/landing/LandingPage'));
const HowItWorks = lazy(() => import('../pages/how-it-works'));
const Blog = lazy(() => import('../pages/blog'));
const Category = lazy(() => import('../pages/category/CategoryPage'));
const Collection = lazy(() => import('../pages/collections'));
const About = lazy(() => import('../pages/about'));
const Product = lazy(() => import('../pages/product/ProductPage'));

const TermsOfService = lazy(() => import('../pages/policies/terms-of-service'));
const CookiePolicy = lazy(() => import('../pages/policies/privacy-and-cookie-policy'));
const ReturnsPolicy = lazy(() => import('../pages/policies/returns-policy'));
const ClaimsPolicy = lazy(() => import('../pages/policies/claims-policy'));
const ExchangePolicy = lazy(() => import('../pages/policies/exchange-policy'));
const RefundPolicy = lazy(() => import('../pages/policies/refund-policy'));
const ShippingPolicy = lazy(() => import('../pages/policies/shipping-policy'));

const Support = lazy(() => import('../pages/support'));
const CustomRequests = lazy(() => import('../pages/support/custom-requests'));
const Other = lazy(() => import('../pages/support/other'));
const PayingForAnOrder = lazy(() => import('../pages/support/orders/paying-for-an-order'));
const MakingAnOrder = lazy(() => import('../pages/support/orders/making-an-order'));
const CancellingAnOrder = lazy(() => import('../pages/support/orders/cancelling-an-order'));
const SupportMaps = lazy(() => import('../pages/support/shipping/maps'));

const Checkout = lazy(() => import('../pages/checkout/CheckoutPage'));
const Shipping = lazy(() => import('../pages/shipping/ShippingPage'));
const OrderCompleted = lazy(() => import('../pages/shipping/OrderCompletedPage'));

//Admin
const AdminLogin = lazy(() => import('../pages/admin/login'));
const AdminHome = lazy(() => import('../pages/admin/home'));
const AdminProductTypesCreate = lazy(() => import('../pages/admin/productTypes/CreateProductTypePage'));
const AdminProductTypesList = lazy(() => import('../pages/admin/productTypes/ViewAllProductTypesPage'));
const AdminProductTypesDetail = lazy(() => import('../pages/admin/productTypes/ViewSingleProductTypePage'));
const AdminAllProducts = lazy(() => import('../pages/admin/products/ViewAllProductsPage'));
const AdminDeliveries = lazy(() => import('../pages/admin/deliveries'));
const AdminSingleProduct = lazy(() => import('../pages/admin/products/ViewSingleProductPage'));

const AdminOrders = lazy(() => import('../pages/admin/orders/view-orders'));
const AdminCategories = lazy(() => import('../pages/admin/categories'));
const AdminSingleCategory = lazy(() => import('../pages/admin/categories/SingleCategory'));

const AdminSingleOrder = lazy(() => import('../pages/admin/orders/single'));
const AdminBrands = lazy(() => import('../pages/admin/brands/AllBrands'));
const MiscPages = lazy(() => import('../pages/admin/misc'));

const AdminSingleBrand = lazy(() => import('../pages/admin/brands/Brand'));
const BrandsPage = lazy(() => import('../pages/brands/AllBrandsPage'));

const SingleBrand = lazy(() => import('../pages/brands/BrandProductsPage'));
// User
const UserProfile = lazy(() => import('../pages/accounts/me'));
const UserOrders = lazy(() => import('../pages/orders'));

const UserSingleOrder = lazy(() => import('../pages/orders/single-order'));
// auth
const RegisterUser = lazy(() => import('../pages/accounts/register'));
const LoginUser = lazy(() => import('../pages/accounts/login'));
const ForgotPassword = lazy(() => import('../pages/accounts/forgot-password'));
const ResetPassword = lazy(() => import('../pages/accounts/reset-password'));

const VerifyAccount = lazy(() => import('../pages/accounts/verify'));

const regularRoutes = [
  {
    path: '/',
    exact: true,
    component: Landing,
  },
  {
    path: '/accounts/register',
    exact: true,
    component: RegisterUser,
  },
  {
    path: '/accounts/login',
    exact: true,
    component: LoginUser,
  },
  {
    path: '/accounts/verify',
    exact: true,
    component: VerifyAccount,
  },
  {
    path: '/accounts/me',
    exact: true,
    component: UserProfile,
  },
  {
    path: '/accounts/forgot-password',
    exact: true,
    component: ForgotPassword,
  },
  {
    path: '/accounts/reset-password',
    exact: true,
    component: ResetPassword,
  },
  {
    path: '/accounts/me/orders',
    exact: true,
    component: UserOrders,
  },
  {
    path: '/orders/mine/:orderId',
    component: UserSingleOrder,
  },
  {
    path: '/company/about',
    exact: true,
    component: About,
  },
  {
    path: '/company/blog',
    exact: true,
    component: Blog,
  },
  {
    path: '/cart',
    component: Cart,
    exact: true,
  },
  {
    path: '/checkout/shipping/order-completed/:orderId',
    component: OrderCompleted,
  },
  {
    path: '/checkout/shipping/:orderId',
    component: Shipping,
  },
  {
    path: '/checkout/:cartId',
    component: Checkout,
  },
  {
    path: '/privacy/privacy-and-cookie-policy',
    exact: true,
    component: CookiePolicy,
  },
  {
    path: '/privacy/terms-of-service',
    exact: true,
    component: TermsOfService,
  },
  {
    path: '/product/:slug',
    component: Product,
  },
  {
    path: '/policies/returns-policy',
    exact: true,
    component: ReturnsPolicy,
  },
  {
    path: '/policies/claims-policy',
    exact: true,
    component: ClaimsPolicy,
  },
  {
    path: '/policies/refund-policy',
    exact: true,
    component: RefundPolicy,
  },
  {
    path: '/policies/exchange-policy',
    exact: true,
    component: ExchangePolicy,
  },
  {
    path: '/policies/shipping-policy',
    exact: true,
    component: ShippingPolicy,
  },
  {
    path: '/support',
    exact: true,
    component: Support,
  },
  {
    path: '/support/custom-requests',
    exact: true,
    component: CustomRequests,
  },
  {
    path: '/support/shipping/maps',
    exact: true,
    component: SupportMaps,
  },
  {
    path: '/support/delivery/maps',
    exact: true,
    component: SupportMaps,
  },
  {
    path: '/support/get-in-touch',
    exact: true,
    component: Other,
  },
  {
    path: '/support/paying-for-an-order',
    exact: true,
    component: PayingForAnOrder,
  },
  {
    path: '/support/making-an-order-for-shoes-sneakers-nairobi',
    exact: true,
    component: MakingAnOrder,
  },
  {
    path: '/support/cancelling-an-order',
    exact: true,
    component: CancellingAnOrder,
  },
  {
    path: '/brands/',
    exact: true,
    component: BrandsPage,
  },
  {
    path: '/brands/:brand/:slug',
    component: Product,
  },
  {
    path: '/brands/:brand',
    component: SingleBrand,
  },
  {
    path: '/category/:id/',
    component: Category,
  },
  {
    path: '/collection/:id/',
    component: Collection,
  },
  {
    path: '/company/admin/login',
    exact: true,
    component: AdminLogin,
  },
];

const adminRoutes = [
  {
    path: '/company/admin/dashboard/',
    exact: true,
    component: AdminHome,
  },
  {
    path: '/company/admin/dashboard/product-types',
    exact: true,
    component: AdminProductTypesList,
  },
  {
    path: '/company/admin/dashboard/product-types/create',
    exact: true,
    component: AdminProductTypesCreate,
  },
  {
    path: '/company/admin/dashboard/product-types/:slug',
    exact: true,
    component: AdminProductTypesDetail,
  },
  {
    path: '/company/admin/dashboard/products',
    exact: true,
    component: AdminAllProducts,
  },
  {
    path: '/company/admin/dashboard/deliveries',
    exact: true,
    component: AdminDeliveries,
  },
  {
    path: '/company/admin/dashboard/products/:slug',
    component: AdminSingleProduct,
  },
  {
    path: '/company/admin/dashboard/orders/',
    exact: true,
    component: AdminOrders,
  },
  {
    path: '/company/admin/dashboard/categories',
    exact: true,
    component: AdminCategories,
  },
  {
    path: '/company/admin/dashboard/categories/:slug',
    component: AdminSingleCategory,
  },
  {
    path: '/company/admin/dashboard/orders/:id',
    component: AdminSingleOrder,
  },
  {
    path: '/company/admin/dashboard/brands',
    exact: true,
    component: AdminBrands,
  },
  {
    path: '/company/admin/dashboard/brands/:id',
    exact: true,
    component: AdminSingleBrand,
  },
  {
    path: '/company/admin/dashboard/misc',
    exact: true,
    component: MiscPages,
  },
];

export {adminRoutes, regularRoutes};
