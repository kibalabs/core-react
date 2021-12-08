import React from 'react';

import { Location } from 'history';
import { Outlet, Route as ReactRoute, Navigate, useRoutes as useReactRoutes, useNavigate, useLocation as useReactLocation, useParams as useRouterParams } from 'react-router';
import { BrowserRouter, Link as ReactLink, RouteObject as ReactRouteObject } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { ErrorBoundary } from './errorBoundary';
import { IMultiAnyChildProps, IMultiChildProps } from './parentComponentProps';

export interface Navigator {
  navigateTo: (target: string, shouldReplace?: boolean) => void;
}

export const useNavigator = (): Navigator => {
  const reactNavigate = useNavigate();
  const navigateTo = React.useCallback((target: string, shouldReplace?: boolean): void => {
    reactNavigate(target, { replace: shouldReplace, state: undefined });
  }, [reactNavigate]);
  return {
    navigateTo,
  };
};

export const useLocation = (): Location => {
  const reactLocation = useReactLocation();
  return reactLocation;
};

export const useRouteParams = (): Record<string, string> => {
  const params = useRouterParams();
  return params;
}

export interface IRouterAuthManager {
  getIsUserLoggedIn: () => boolean;
}

export const RouterAuthManagerContext = React.createContext<IRouterAuthManager | undefined>(undefined);

export const CoreRoutingEnabledContext = React.createContext<boolean | undefined>(undefined);

export const useIsCoreRoutingEnabled = (): boolean => {
  const coreRoutingEnabled = React.useContext(CoreRoutingEnabledContext);
  if (!coreRoutingEnabled) {
    return false;
  }
  return coreRoutingEnabled;
};

export const useRouterAuthManager = (): IRouterAuthManager | undefined => {
  const authManager = React.useContext(RouterAuthManagerContext);
  return authManager;
};

export interface IRedirectProps {
  target: string;
  shouldReplace?: boolean
}

export const Redirect = (props: IRedirectProps): React.ReactElement | null => {
  return <Navigate to={props.target} replace={props.shouldReplace}/>;
}

export interface IAuthResolverProps extends IMultiAnyChildProps {
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
}

export const AuthResolver = (props: IAuthResolverProps): React.ReactElement | null => {
  const authManager = useRouterAuthManager();

  if (props.redirectIfNoAuth) {
    if (!authManager) {
      throw new Error('Cannot use redirectIfNoAuth since an authManager has not been provided to the router');
    }
    if (!authManager.getIsUserLoggedIn()) {
      return <Redirect target={props.redirectIfNoAuth} shouldReplace={true} />;
    }
  }

  if (props.redirectIfAuth) {
    if (!authManager) {
      throw new Error('Cannot use redirectIfAuth since an authManager has not been provided to the router');
    }
    if (authManager.getIsUserLoggedIn()) {
      return <Redirect target={props.redirectIfAuth} shouldReplace={true} />;
    }
  }

  return <React.Fragment>{props.children}</React.Fragment>;
}


export interface IRouteProps<PagePropsType = Record<string, string>> extends IMultiChildProps<IRouteProps> {
  path?: string;
  default?: boolean;
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
  page?: React.ComponentType<PagePropsType>;
  pageElement?: React.ReactElement<PagePropsType>;
}

export const Route = (props: IRouteProps): React.ReactElement | null => {
  const params = useRouteParams();

  const path = props.default ? '*' : props.path
  if (!props.page && !props.pageElement) {
    throw new Error('One of {page, pageElement} must be passed into each Route');
  }
  if (props.page && props.pageElement) {
    throw new Error('ONLY ONE of {page, pageElement} must be passed into each Route');
  }

  return (
    <ReactRoute
      path={path}
      element={(
        <ErrorBoundary>
          <AuthResolver redirectIfAuth={props.redirectIfAuth} redirectIfNoAuth={props.redirectIfNoAuth}>
              {props.page && <props.page {...params} />}
              {props.pageElement && React.cloneElement(props.pageElement, params)}
          </AuthResolver>
        </ErrorBoundary>
      )}
    />
  );
};

export interface IRoute<PagePropsType = Record<string, string>> {
  path: string;
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
  page?: React.ComponentType<PagePropsType>;
  pageElement?: React.ReactElement<PagePropsType>;
  subRoutes?: IRoute[];
}

export interface ISubRouterProps {
  routes: IRoute[];
}

const routeToReactRoute = (route: IRoute): ReactRouteObject => {
  return {
    path: route.path,
    caseSensitive: false,
    element: (
      <ErrorBoundary>
        <AuthResolver redirectIfAuth={route.redirectIfAuth} redirectIfNoAuth={route.redirectIfNoAuth}>
          {route.page && <route.page />}
          {route.pageElement && React.cloneElement(route.pageElement)}
        </AuthResolver>
      </ErrorBoundary>
    ),
    children: route.subRoutes ? route.subRoutes.map((subRoute: IRoute): ReactRouteObject => routeToReactRoute(subRoute)) : [],
  };
}

export const SubRouter = (props: ISubRouterProps): React.ReactElement => {
  const routes = React.useMemo((): ReactRouteObject[] => {
    return props.routes.map((route: IRoute): ReactRouteObject => {
      return routeToReactRoute(route);
    });
  }, props.routes);

  return useReactRoutes(routes);
};

export interface ISubRouterOutletProps {
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const SubRouterOutlet = (props: ISubRouterOutletProps): React.ReactElement => {
  return (
    <Outlet />
  );
};

export interface IRouterProps extends ISubRouterProps {
  authManager?: IRouterAuthManager;
  staticPath?: string;
}

export const Router = (props: IRouterProps): React.ReactElement => {
  const internals = (
    <CoreRoutingEnabledContext.Provider value={true}>
      <RouterAuthManagerContext.Provider value={props.authManager}>
        <SubRouter routes={props.routes} />
      </RouterAuthManagerContext.Provider>
    </CoreRoutingEnabledContext.Provider>
  );

  return props.staticPath ? (
    <StaticRouter location={props.staticPath}>
      {internals}
    </StaticRouter>
  ) : (
    <BrowserRouter>
      {internals}
    </BrowserRouter>
  );
};

export interface ILinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

export const Link = (props: ILinkProps): React.ReactElement => {
  return (
    <ReactLink to={props.href} {...props}>{props.children}</ReactLink>
  );
};
