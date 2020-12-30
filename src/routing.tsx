import React from 'react';

import { createHistory as createReachHistory, createMemorySource as createReachMemorySource, History as ReachHistory, Link as ReachLink, LocationProvider as ReachLocationProvider, Redirect as ReachRedirect, Router as ReachRouter, useParams as useReachParams } from '@reach/router';

import { ErrorBoundary } from './errorBoundary';
import { IMultiChildProps } from './parentComponentProps';

export type IHistory = ReachHistory;

export const HistoryContext = React.createContext<IHistory | null>(null);

interface IHistoryProviderProps {
  history: IHistory;
  children: React.ReactChild;
}

export const HistoryProvider = (props: IHistoryProviderProps): React.ReactElement => (
  <HistoryContext.Provider value={props.history}>
    <ReachLocationProvider history={props.history}>
      {props.children}
    </ReachLocationProvider>
  </HistoryContext.Provider>
);

export const useHistory = (): IHistory => {
  const history = React.useContext(HistoryContext);
  if (!history) {
    throw new Error('Cannot use useHistory since HistoryContext has not ben provided');
  }
  return history;
};

export interface IRouterAuthManager {
  getIsUserLoggedIn: () => boolean;
}

export const RouterAuthManagerContext = React.createContext<IRouterAuthManager | undefined>(undefined);

export const useRouterAuthManager = (): IRouterAuthManager => {
  const authManager = React.useContext(RouterAuthManagerContext);
  return authManager;
};

export interface IRouteProps<PagePropsType = Record<string, unknown>> {
  path?: string;
  default?: boolean;
  uri?: string;
  redirectIfAuth?: string;
  redirectIfNoAuth?: string;
  page?: React.ComponentType<PagePropsType>;
  pageElement?: React.ComponentClass<PagePropsType>;
}

export const Route = (props: IRouteProps): React.ReactElement => {
  const params = useReachParams();
  const authManager = useRouterAuthManager();
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
      // TODO(krish): using history.navigate would be preferable here but it didn't work, figure out why
      return <ReachRedirect noThrow to={props.redirectIfNoAuth} />;
    }
  }
  if (props.redirectIfAuth) {
    if (!authManager) {
      throw new Error('Cannot use redirectIfAuth since an authManager has not ben provided to the router');
    }
    if (authManager.getIsUserLoggedIn()) {
      // TODO(krish): using history.navigate would be preferable here but it didn't work, figure out why
      return <ReachRedirect noThrow to={props.redirectIfAuth} />;
    }
  }
  return (
    <ErrorBoundary>
      {props.page && <props.page {...params} />}
      {props.pageElement && React.cloneElement(props.pageElement, params)}
    </ErrorBoundary>
  );
};

export interface IRouterProps extends IMultiChildProps<IRouteProps<unknown>> {
  authManager?: IRouterAuthManager;
  history?: IHistory;
}

export const Router = (props: IRouterProps): React.ReactElement => {
  const historyRef = React.useRef(props.history || createReachHistory(window));
  return (
    <HistoryProvider history={historyRef.current}>
      <RouterAuthManagerContext.Provider value={props.authManager}>
        <ReachRouter style={{ width: '100%', height: '100%' }}>
          { props.children }
        </ReachRouter>
      </RouterAuthManagerContext.Provider>
    </HistoryProvider>
  );
};

export interface ILinkProps {
  target: string;
  text: string;
}

export const Link = (props: ILinkProps): React.ReactElement => {
  return (
    <ReachLink to={props.target}>{props.text}</ReachLink>
  );
};

export const createStaticHistory = (path: string): IHistory => {
  return createReachHistory(createReachMemorySource(path));
};
