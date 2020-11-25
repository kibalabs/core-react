import React from 'react';

export const useRenderedRef = <T extends HTMLElement>(handler: (event: Event) => void): [React.RefObject<T>, boolean] => {
  const ref = React.useRef<T | null>(null);
  const [hasRendered, setHasRendered] = React.useState<boolean>(false);
  React.useLayoutEffect(() => {
    setHasRendered(true);
  });
  return [ref, hasRendered];
}
