import React from 'react';
import {
  type Location,
  type NavigateFunction,
  type Params,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

// Define the shape of the router props
export interface RouterProps {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
}

// Define the props for the wrapped component, including the injected router prop
export interface WithRouterProps {
  router: RouterProps;
}

export function withRouter<T>(Component: React.ComponentType<T & WithRouterProps>) {
  function ComponentWithRouterProp(props: Omit<T, keyof WithRouterProps>) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const router = { location, navigate, params };

    // Cast props to T to satisfy the component's expected props
    return <Component {...(props as T)} router={router} />;
  }

  return ComponentWithRouterProp;
}
