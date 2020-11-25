import React from 'react';

export const useInterval = (delaySeconds: number, callback: () => void, shouldCallImmediately: boolean = true, dependencies: ReadonlyArray<any> = []): void => {
  const savedCallback = React.useRef<() => void>(callback);

  React.useEffect((): void => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect((): (() => void) => {
    if (shouldCallImmediately) {
      savedCallback.current();
    }
    const intervalId = setInterval((): void => {
      savedCallback.current();
    }, delaySeconds * 1000);

    return (): void => clearInterval(intervalId);
  }, dependencies);
};
