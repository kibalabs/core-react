import React from 'react';

import { useEventListener, useInitialization } from '.';

export type WindowSize = {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
  });

  const onWindowResized = React.useCallback((): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEventListener(window, 'resize', onWindowResized);

  useInitialization((): void => {
    onWindowResized();
  });

  return windowSize;
};
