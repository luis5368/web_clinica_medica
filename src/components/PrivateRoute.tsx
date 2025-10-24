import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { token } = useAuth();

  // Si no hay token, redirige a login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, muestra el contenido
  return children;
};

export default PrivateRoute;
