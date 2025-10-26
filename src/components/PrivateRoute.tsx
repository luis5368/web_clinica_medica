import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Props {
  children: React.ReactElement; // <-- Cambiado de JSX.Element
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
