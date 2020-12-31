import React from 'react';

export const useInterval = (delaySeconds: number, callback: () => void, shouldCallImmediately = true, dependencies: unknown[] = []): void => {
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

    return (): void => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delaySeconds, shouldCallImmediately, ...dependencies]);
};
