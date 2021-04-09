import React from 'react';

export const useDebouncedCallback = (delayMillis = 30000): [(callback: (() => void)) => void, () => void] => {
  const timeoutRef = React.useRef<number | null>(null);
  const callbackRef = React.useRef<(() => void) | null>(null);

  const clearCallback = React.useCallback((): void => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callbackRef.current = null;
    }
  }, []);

  const setCallback = React.useCallback((callback: (() => void)): void => {
    clearCallback();
    callbackRef.current = callback;
    timeoutRef.current = window.setTimeout((): void => {
      if (callbackRef.current) {
        callbackRef.current();
      }
      timeoutRef.current = null;
      callbackRef.current = null;
    }, delayMillis);
  }, [delayMillis, clearCallback]);

  return [setCallback, clearCallback];
};