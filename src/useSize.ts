import React from 'react';

import { useEventListener } from './useEventListener';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface ISize {
  width: number;
  height: number;
  scrollWidth: number;
  scrollHeight: number;
}

export const useSize = <T extends HTMLElement>(node: T | null): ISize | null => {
  const [size, setSize] = React.useState<ISize | null>(null);

  const measure = (): void => {
    if (node) {
      window.requestAnimationFrame((): void => {
        setSize({ width: node.clientWidth, height: node.clientHeight, scrollHeight: node.scrollHeight, scrollWidth: node.scrollWidth });
      });
    }
  };

  useIsomorphicLayoutEffect((): void => {
    measure();
  }, [node]);

  useEventListener(window, 'resize', measure);
  useEventListener(window, 'scroll', measure);

  return size;
};

export const useSizingRef = <T extends HTMLElement>(): [ISize | null, React.RefObject<T | null>] => {
  const sizingRef = React.useRef<T | null>(null);
  const size = useSize(sizingRef.current);
  return [size, sizingRef];
};
