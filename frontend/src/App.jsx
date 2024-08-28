import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Dashboard from './views/auth/Dashboard';
import Logout from './views/auth/Logout';
import ForgotPassword from './views/auth/ForgotPassword';
import CreatePassword from './views/auth/CreatePassword';
import MainWrapper from './layouts/MainWrapper';
import StoreHeader from './views/base/StoreHeader';
import StoreFooter from './views/base/StoreFooter';
import Product from './views/store/Product';
import ProductDetail from './views/store/ProductDetail';
import Cart from './views/store/Cart';
import Checkout from './views/store/Checkout';

const App = () => {
  
  return (
    <BrowserRouter>
      <StoreHeader />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-new-password" element={<CreatePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Store Component */}
        <Route path="/" element={<Product />} />S
        <Route path="/detail/:slug/" element={<ProductDetail />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/checkout/:order_oid/" element={<Checkout />} />
      </Routes>
      <StoreFooter />
    </BrowserRouter>
  )
}

export default App;