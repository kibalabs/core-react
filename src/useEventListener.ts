import React from 'react';

export const useEventListener = (element: HTMLElement | Document | Window | null, eventName: string, handler: (event: Event) => void, dependencies: React.DependencyList = []): void => {
  const savedHandler = React.useRef<(event: Event) => void>(handler);

  React.useEffect((): void => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(
    (): void | (() => void) => {
      if (!element || !element.addEventListener) {
        return;
      }
      const eventListener = (event: Event): void => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      // TODO(krishan711): figure out why this lint disable is needed!
      // eslint-disable-next-line consistent-return
      return (): void => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventName, element, ...dependencies],
  );
};
