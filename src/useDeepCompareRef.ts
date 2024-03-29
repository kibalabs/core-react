import React from 'react';

import { deepCompare } from '@kibalabs/core';

export const useDeepCompareRef = <T>(value: T): T => {
  const ref = React.useRef<T>(value);
  if (!deepCompare(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
};
