import React from 'react';

import { useEventListener } from './useEventListener';

export const useWindowScroll = (handler: (sizeScrolled: number, factorScrolled: number) => void): void => {
  const onScrolled = React.useCallback((): void => {
    const size = document.body.scrollHeight - window.innerHeight;
    const position = window.pageYOffset;
    handler(position, position / size);
  }, [handler]);

  useEventListener(window, 'scroll', onScrolled);
};
