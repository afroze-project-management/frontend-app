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
import CreateCompanyPage from './pages/CreateCompanyPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import { ApplicationUser } from './types/ApplicationUser';


function App() {
  const { isAuthenticated }: Auth0ContextInterface<ApplicationUser> = useAuth0();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/projects"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <ProjectsPage />
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
          path="/companies/edit/:companyId"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <CompanyDetailsPage />
            </Protected>
          }
        />
        <Route
          path="/companies/create"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <CreateCompanyPage />
            </Protected>
          }
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
