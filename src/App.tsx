import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/project/ProjectsPage';
import ProjectDetailsPage from './pages/project/ProjectDetailsPage';
import CreateProjectPage from './pages/project/CreateProjectPage';
import CompaniesPage from './pages/company/CompaniesPage';
import CompanyDetailsPage from './pages/company/CompanyDetailsPage';
import CreateCompanyPage from './pages/company/CreateCompanyPage';
import CreateTaskPage from './pages/task/CreateTaskPage';
import DemoPage from './pages/DemoPage';
import Profile from './components/Profile';
import ProfilePage from './pages/ProfilePage';


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/projects"
          element={
            <ProjectsPage />
          }
        />
        <Route
          path="/companies"
          element={
            <CompaniesPage />
          }
        />
        <Route
          path="/companies/:companyId"
          element={
            <CompanyDetailsPage />
          }
        />
        <Route
          path="/companies/create"
          element={
            <CreateCompanyPage />
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProjectDetailsPage />
          }
        />
        <Route
          path="/companies/:companyId/projects/create"
          element={
            <CreateProjectPage />
          }
        />
        <Route
          path="/projects/:projectId/tasks/create"
          element={
            <CreateTaskPage />
          }
        />
        <Route
          path="/demo"
          element={
            <DemoPage />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage />
          }
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
