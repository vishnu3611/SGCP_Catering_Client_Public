import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import OrderMenu from "./pages/OrderMenu";
import ReviewOrderMenu_bkp2 from "./pages/ReviewOrderMenu_bkp2";
import LoginForm from "./pages/LoginForm";
import React, {createContext, useEffect, useState} from "react";
import jwt from 'jsonwebtoken';
import OrderTable from "./pages/OrderTable";
import OrderTableSearch from "./pages/OrderTableSearch.js";
import ItemSearch from "./pages/ItemSearch.js";
import AdminDashboard from "./pages/AdminDashboard";
import ProductTable from "./pages/ProductTable";
import { server } from "./constants";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import TrayList from "./pages/TrayList.js";
import CateringDate from "./pages/CateringDate.js";
import MenuEditor from "./pages/MenuEditor";

export const ProductsDataContext = createContext();
const ProductsDataProvider = ({ children }) => {
    const [productsJSON, setProductsJSON] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(server + '/products');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setProductsJSON(data);
                } else {
                    setError('Error fetching JSON data');
                }
            } catch (error) {
                setError('Error fetching JSON data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <ProductsDataContext.Provider value={{ productsJSON}}>
            {children}
        </ProductsDataContext.Provider>
    );
};
const isAuthorized = async (roles) => {
    const jwtToken = localStorage.getItem('jwt');

    if (!jwtToken) {
        return false;
    }

    try {
        const response = await fetch(server + '/user/admin', {
            headers: {
                authorization: `${jwtToken}`,
            },
        });
        if (response.ok) {
            const user = await response.json();
            return roles.includes(user.data);
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};
const ProtectedRoute = ({ children, roles }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      const authorized = await isAuthorized(roles);
      setIsAuth(authorized);
      setIsLoading(false);
    };

    checkAuthorization();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
};
function App() {
  return (
    <ProductsDataProvider>
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<OrderMenu />}/>
        <Route exact path="/trayList" element={<TrayList />}/>
        <Route path="/uid/:orderID/:uniqueId" element={<OrderConfirmationPage />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path='/admin/' element={<ProtectedRoute roles={'admin'}><AdminDashboard /></ProtectedRoute>} />
          <Route exact path='/admin/orders/:orderStatus' element={<ProtectedRoute roles={'admin'}><OrderTable  /></ProtectedRoute>} />
          <Route path='/admin/orderdetail/view/:orderID' element={<ProtectedRoute roles={'admin'}><ProductTable view="true" /></ProtectedRoute>} />
          <Route path='/admin/orderdetail/:orderID' element={<ProtectedRoute roles={'admin'}><ProductTable /></ProtectedRoute>} />
          <Route exact path='/admin/orders/search' element={<ProtectedRoute roles={'admin'}><OrderTableSearch /></ProtectedRoute>} />
          <Route exact path='/admin/orders/view/search' element={<ProtectedRoute roles={'admin'}><OrderTableSearch view="true" /></ProtectedRoute>} />
          <Route exact path='/admin/orders/itemsearch' element={<ProtectedRoute roles={'admin'}><ItemSearch /></ProtectedRoute>} />
          <Route exact path='/admin/menueditor' element={<ProtectedRoute roles={'admin'}><MenuEditor/></ProtectedRoute>} />
          <Route exact path='/admin/cateringdates' element={<ProtectedRoute roles={'admin'}><CateringDate /></ProtectedRoute>} />
        <Route path="*" element={<p>Not Found</p>} />
      </Routes>
    </HashRouter>
    </ProductsDataProvider>
  );
}
export default App;
