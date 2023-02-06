import {
  Navigate
} from 'react-router-dom';
const Protected = ({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: any;
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;