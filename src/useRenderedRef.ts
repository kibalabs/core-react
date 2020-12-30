import React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useRenderedRef = <T extends HTMLElement>(): [React.RefObject<T>, boolean] => {
  const ref = React.useRef<T | null>(null);
  const [hasRendered, setHasRendered] = React.useState<boolean>(false);
  useIsomorphicLayoutEffect((): void => {
    setHasRendered(true);
  });
  return [ref, hasRendered];
}
