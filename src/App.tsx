import { Auth0ContextInterface, useAuth0 } from '@auth0/auth0-react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import Protected from './components/Protected';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailsPage from './pages/EditCompanyPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import { ApplicationUser } from './types/ApplicationUser';



function App() {
  const { isAuthenticated }: Auth0ContextInterface<ApplicationUser> = useAuth0();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <ProductsPage />
            </Protected>
          }
        />
        <Route
          path="/companies"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <CompaniesPage />
            </Protected>
          }
        />
        <Route
          path="/companies/:companyId"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <CompanyDetailsPage />
            </Protected>
          }
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
