import React from 'react';

import { Location } from 'history';
import { Outlet, Route as ReactRoute, Routes, useNavigate, useLocation as useReactLocation, useParams as useRouterParams } from 'react-router';
import { BrowserRouter, Link as ReactLink } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { ErrorBoundary } from './errorBoundary';
import { IMultiChildProps } from './parentComponentProps';

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

export interface IRouterAuthManager {
  getIsUserLoggedIn: () => boolean;
}

export const RouterAuthManagerContext = React.createContext<IRouterAuthManager | undefined>(undefined);

export const CoreRoutingEnabledContext = React.createContext<boolean | undefined>(true);

export const useIsCoreRoutingEnabled = (): boolean | undefined=> {
  const coreRoutingEnabled = React.useContext(CoreRoutingEnabledContext);
  return coreRoutingEnabled;
};

export const useRouterAuthManager = (): IRouterAuthManager | undefined => {
  const authManager = React.useContext(RouterAuthManagerContext);
  return authManager;
};

export interface IRouteProps<PagePropsType = Record<string, string>> extends IMultiChildProps<IRouteProps> {
  path?: string;
  default?: boolean;
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
  page?: React.ComponentType<PagePropsType>;
  pageElement?: React.ReactElement<PagePropsType>;
}

export const Route = (props: IRouteProps): React.ReactElement | null => {
  const params = useRouterParams();
  const authManager = useRouterAuthManager();
  const navigator = useNavigator();
  if (!props.page && !props.pageElement) {
    throw new Error('One of {page, pageElement} must be passed into each Route');
  }
  if (props.page && props.pageElement) {
    throw new Error('Only ONE of {page, pageElement} must be passed into each Route');
  }
  if (props.redirectIfNoAuth) {
    if (!authManager) {
      throw new Error('Cannot use redirectIfNoAuth since an authManager has not ben provided to the router');
    }
    if (!authManager.getIsUserLoggedIn()) {
      navigator.navigateTo(props.redirectIfNoAuth);
      return null;
    }
  }
  if (props.redirectIfAuth) {
    if (!authManager) {
      throw new Error('Cannot use redirectIfAuth since an authManager has not ben provided to the router');
    }
    if (authManager.getIsUserLoggedIn()) {
      navigator.navigateTo(props.redirectIfAuth);
      return null;
    }
  }

  return (
    <ReactRoute
      path={props.default ? '*' : props.path}
      element={(
        <ErrorBoundary>
          {props.page && <props.page {...params} />}
          {props.pageElement && React.cloneElement(props.pageElement, params)}
        </ErrorBoundary>
      )}
    />
  );
};

export interface ISubRouterProps extends IMultiChildProps<IRouteProps<unknown>> {
}

export const SubRouter = (props: ISubRouterProps): React.ReactElement => {
  return (
    <Routes>
      { props.children }
    </Routes>
  );
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
    <RouterAuthManagerContext.Provider value={props.authManager}>
      <SubRouter>
        { props.children }
      </SubRouter>
    </RouterAuthManagerContext.Provider>
  );

  return props.staticPath ? (

    <StaticRouter location={props.staticPath}>
      <CoreRoutingEnabledContext.Provider value={true}>
        {internals}
      </CoreRoutingEnabledContext.Provider>
    </StaticRouter>
  ) : (

    <BrowserRouter>
      {internals}
    </BrowserRouter>

  );
};

export interface ILinkProps {
  target: string;
  text: string;
}

export const Link = (props: ILinkProps): React.ReactElement => {
  return (
    <ReactLink to={props.target}>{props.text}</ReactLink>
  );
};
