import React from 'react';

import { Location } from 'history';
import { Navigate, Outlet, useNavigate, useLocation as useReactLocation, useRoutes as useReactRoutes, useParams as useRouterParams } from 'react-router';
import { BrowserRouter, Link as ReactLink, RouteObject as ReactRouteObject } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { ErrorBoundary } from './errorBoundary';
import { IMultiAnyChildProps } from './parentComponentProps';

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

export const useRouteParams = (): Readonly<Record<string, string | undefined>> => {
  const params = useRouterParams();
  return params;
};

export const useRouteParam = (key: string): string | undefined => {
  const params = useRouteParams();
  return params[key];
};

export const useStringRouteParam = (key: string): string => {
  const params = useRouteParams();
  if (params[key] === undefined) {
    throw Error(`Key ${key} not found in route params: ${params}`);
  }
  return params[key] as string;
};

export const useNumberRouteParam = (key: string): number => {
  const param = useStringRouteParam(key);
  const value = Number(param);
  if (Number.isNaN(value)) {
    throw Error(`route param for key ${key} cannot be parsed into a number: ${param}`);
  }
  return value;
};

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

export const Redirect = (props: IRedirectProps): React.ReactElement => {
  return <Navigate to={props.target} replace={props.shouldReplace} />;
};

export interface IAuthResolverProps extends IMultiAnyChildProps {
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
}

export const AuthResolver = (props: IAuthResolverProps): React.ReactElement => {
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
};

export interface IRoute<IGlobals> {
  path: string;
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
  page?: React.ComponentType;
  pageElement?: React.ReactElement;
  subRoutes?: IRoute<IGlobals>[];
  getPageData?: (globals: IGlobals, params: Record<string, string>) => Promise<unknown | null>;
}

const routeToReactRoute = <IGlobals, >(route: IRoute<IGlobals>): ReactRouteObject => {
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
    children: route.subRoutes ? route.subRoutes.map((subRoute: IRoute<IGlobals>): ReactRouteObject => routeToReactRoute(subRoute)) : [],
  };
};

export interface ISubRouterProps<IGlobals> {
  routes: IRoute<IGlobals>[];
}

export const SubRouter = <IGlobals, >(props: ISubRouterProps<IGlobals>): React.ReactElement | null => {
  const routes = React.useMemo((): ReactRouteObject[] => {
    return props.routes.map((route: IRoute<IGlobals>): ReactRouteObject => {
      return routeToReactRoute(route);
    });
  }, [props.routes]);

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

export interface IRouterProps<IGlobals> extends IMultiAnyChildProps {
  authManager?: IRouterAuthManager;
  staticPath?: string;
  routes?: IRoute<IGlobals>[];
  basePath?: string;
}

export const Router = <IGlobals, >(props: IRouterProps<IGlobals>): React.ReactElement => {
  const internals = (
    <CoreRoutingEnabledContext.Provider value={true}>
      <RouterAuthManagerContext.Provider value={props.authManager}>
        {props.routes && (
          <SubRouter routes={props.routes} />
        )}
        {props.children}
      </RouterAuthManagerContext.Provider>
    </CoreRoutingEnabledContext.Provider>
  );

  return props.staticPath ? (
    <StaticRouter basename={props.basePath} location={props.staticPath}>
      {internals}
    </StaticRouter>
  ) : (
    <BrowserRouter basename={props.basePath}>
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
