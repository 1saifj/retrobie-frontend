import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import WrapPageElement from '../helpers/wrapPageElement';
import Loading from '../components/loading';
import AdminDashboard from '../pages/admin/dashboard';

const Cart = lazy(() => import('../pages/cart'));
const App = lazy(() => import('../App'));
const HowItWorks = lazy(() => import('../pages/how-it-works'));
const Cookies = lazy(() => import('../pages/cookies'));
const Blog = lazy(() => import('../pages/blog'));
const About = lazy(() => import('../pages/about'));
const Tos = lazy(() => import('../pages/terms-of-service'));
const Product = lazy(() => import('../pages/product'));
const Support = lazy(() => import('../pages/support/support'));
const Checkout = lazy(() => import('../pages/checkout'));
const Shipping = lazy(() => import('../pages/shipping'));
const NotFound = lazy(() => import('../pages/notfound'));
const Returns = lazy(() => import('../pages/support/returns'));
const CustomRequests = lazy(() => import('../pages/support/custom-requests'));
const Other = lazy(() => import('../pages/support/other'));
const PayingForAnOrder = lazy(() => import('../pages/support/paying-for-an-order'));
const MakingAnOrder = lazy(() => import('../pages/support/making-an-order'));
const Delivery = lazy(() => import('../pages/support/delivery'));

//Admin
const AdminLogin = lazy(() => import('../pages/admin/login'));
const AdminHome = lazy(() => import('../pages/admin/home'));
const AdminProductsHome = lazy(() => import('../pages/admin/products'));
const AdminAllProducts = lazy(() => import('../pages/admin/products/AllProductsAdmin'));
const AdminCreateProduct = lazy(() => import('../pages/admin/products/add-product'));
const AdminSingleProduct = lazy(() => import('../pages/admin/products/SingleProductAdmin'));

const AdminOrders = lazy(() => import('../pages/admin/orders/view-orders'));
const AdminSingleOrder = lazy(() => import('../pages/admin/orders/single'));
const AdminBrands = lazy(() => import('../pages/admin/brands/AllBrands'));
const AdminBrandProducts = lazy(() => import('../pages/admin/brands/BrandProducts'));
const MiscPages = lazy(() => import('../pages/admin/misc'));

const AdminSingleBrand = lazy(() => import('../pages/admin/brands/Brand'));
const BrandsPage = lazy(() => import('../pages/brands/AllBrands'));

const SingleBrand = lazy(() => import('../pages/brands/Brand'));
// User
const UserDashboard = lazy(() => import('../pages/user/dashboard'));
const UserProfile = lazy(() => import('../pages/accounts/me'));

const UserSingleOrder = lazy(() => import('../pages/orders/single-order'));
// auth
const RegisterUser = lazy(() => import('../pages/accounts/register'));
const LoginUser = lazy(() => import('../pages/accounts/login'));
const ForgotPassword = lazy(() => import('../pages/accounts/forgot-password'));
const ResetPassword = lazy(() => import('../pages/accounts/reset-password'));

const VerifyAccount = lazy(() => import('../pages/accounts/verify'));

function Routes() {
  const AdminRoute = function({component: Component, ...rest}) {
    return (
      <Route
        {...rest}
        render={props => (
          <AdminDashboard {...props}>
            <Component {...props} />
          </AdminDashboard>
        )}
      />
    );
  };
  return (
    <BrowserRouter>
      <Route
        render={props => {
          return (
            <WrapPageElement
              props={props}
              element={
                <Suspense fallback={<Loading message={false} />}>
                  <Switch>
                    <Route exact path="/" component={App} />
                    <Route exact path="/accounts/register" component={RegisterUser} />
                    <Route exact path="/accounts/login" component={LoginUser} />
                    <Route exact path="/accounts/forgot-password" component={ForgotPassword} />
                    <Route exact path="/accounts/reset-password" component={ResetPassword} />
                    <Route exact path="/accounts/verify" component={VerifyAccount} />
                    <Route exact path="/accounts/me" component={UserProfile} />

                    <Route path="/orders/mine/:orderId" component={UserSingleOrder} />

                    <Route exact path="/cart" component={Cart} />
                    <Route exact path="/company/about" component={About} />
                    <Route exact path="/company/blog" component={Blog} />
                    <Route exact path="/dashboard" component={UserDashboard} />

                    <Route exact path="/how-it-works" component={HowItWorks} />
                    <Route exact path="/support" component={Support} />
                    <Route exact path="/privacy/cookies" component={Cookies} />
                    <Route exact path="/privacy/terms-and-conditions" component={Tos} />
                    <Route exact path="/checkout" component={Checkout} />
                    <Route path="/checkout/shipping/:orderId" component={Shipping} />
                    <Route path={'/product/:id'} component={Product} />
                    <Route exact path="/support/returns" component={Returns} />
                    <Route exact path="/support/custom-requests" component={CustomRequests} />
                    <Route exact path="/support/get-in-touch" component={Other} />
                    <Route exact path="/support/paying-for-an-order" component={PayingForAnOrder} />
                    <Route exact path="/support/making-an-order" component={MakingAnOrder} />
                    <Route exact path="/support/delivery" component={Delivery} />

                    <Route exact path="/brands/" component={BrandsPage} />
                    <Route exact path="/brands/:brand" component={SingleBrand} />
                    <Route exact path="/brands/:brand/:id" component={Product} />

                    {/*Admin*/}
                    <Route exact path="/company/admin/login" component={AdminLogin} />

                    <AdminRoute exact path="/company/admin/dashboard/home" component={AdminHome} />
                    <AdminRoute exact path="/company/admin/dashboard/" component={AdminHome} />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/products"
                      component={AdminProductsHome}
                    />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/products/all"
                      component={AdminAllProducts}
                    />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/products/create"
                      component={AdminCreateProduct}
                    />
                    <AdminRoute
                      path="/company/admin/dashboard/products/single/:id"
                      component={AdminSingleProduct}
                    />
                    <AdminRoute
                      path="/company/admin/dashboard/product/:id"
                      component={AdminSingleProduct}
                    />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/orders/all"
                      component={AdminOrders}
                    />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/orders/"
                      component={AdminOrders}
                    />
                    <AdminRoute
                      path="/company/admin/dashboard/order/:id"
                      component={AdminSingleOrder}
                    />
                    <AdminRoute
                      path="/company/admin/dashboard/orders/single/:id"
                      component={AdminSingleOrder}
                    />

                    <AdminRoute exact path="/company/admin/dashboard/misc" component={MiscPages} />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/brands"
                      component={AdminBrands}
                    />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/brands/:id"
                      component={AdminSingleBrand}
                    />
                    <AdminRoute
                      exact
                      path="/company/admin/dashboard/brands/:id/products"
                      component={AdminBrandProducts}
                    />
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              }
            />
          );
        }}
      />
    </BrowserRouter>
  );
}

export default Routes;
