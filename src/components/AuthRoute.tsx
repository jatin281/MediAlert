// src/components/AuthRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { IonSpinner } from '@ionic/react';

interface AuthRouteProps extends RouteProps {
  requiresAuth: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ requiresAuth, ...routeProps }) => {
  const { isAuthenticated, loading, initialAuthCheckDone } = useAuth();

  if (!initialAuthCheckDone || loading) {
    return (
      <div className="ion-text-center ion-padding">
        <IonSpinner />
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (!requiresAuth && isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return <Route {...routeProps} />;
};

export default AuthRoute;