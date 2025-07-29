import {BrowserRouter,  Routes, Route} from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
// import Hero from './components/Layout/Hero'
import Home from './pages/Home'
import {Toaster} from "sonner"
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/Products/ProductDetails'
import Checkout from './components/Cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagment from './components/Admin/UserManagment'
import ProductManagment from './components/Admin/ProductManagment'
import EditProductPage from './components/Admin/EditProductPage'
import OrderManagment from './components/Admin/OrderManagment'

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right"/>
      <Routes>
        <Route path='/' element={<UserLayout />}>{/* user layout */}
          <Route index element={<Home />}></Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />}/>
          <Route path="collections/:collection" element={<CollectionPage />}/>
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path='checkout' element={<Checkout /> } />
          <Route path='order-confirmation' element={<OrderConfirmationPage />}/>
          <Route path='order/:id' element={<OrderDetailsPage />}/>
          <Route path='my-orders' element={<MyOrdersPage />}/>
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          {/* admin layout */}
          <Route index element={<AdminHomePage />}/>
          <Route path='users' element={<UserManagment />}/>
          <Route path='products' element={<ProductManagment />}/>
          <Route path='products/:id/edit' element={<EditProductPage />}/>
          <Route path='orders' element={<OrderManagment />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App