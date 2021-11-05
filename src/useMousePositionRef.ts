import React from 'react';

import { ORIGIN_POINT, Point } from './pointUtil';
import { useEventListener } from './useEventListener';

export const useMousePositionRef = (elementRef: React.RefObject<HTMLElement>): React.MutableRefObject<Point> => {
  const mousePositionRef = React.useRef<Point>(ORIGIN_POINT);

  const handleMouseMove = React.useCallback((event: Event) => {
    if (elementRef.current) {
      mousePositionRef.current = {
        // @ts-ignore
        x: event.clientX - elementRef.current.offsetLeft,
        // @ts-ignore
        y: event.clientY - elementRef.current.offsetTop,
      };
    }
  }, [elementRef]);

  useEventListener(elementRef.current, 'mousemove', handleMouseMove);

  return mousePositionRef;
};
