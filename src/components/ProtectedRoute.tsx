import type { ReactNode } from "react";
import { Redirect, Route, type RouteProps } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

interface ProtectedRouteProps extends RouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  ...routeProps
}) => {
  const { isAuthenticated, isReady } = useAuth();

  return (
    <Route
      {...routeProps}
      render={({ location }) =>
        !isReady ? null : isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
