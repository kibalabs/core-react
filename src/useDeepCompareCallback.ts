import React from 'react';

import { useDeepCompareRef } from './useDeepCompareRef';

export const useDeepCompareCallback = <T extends (...args: unknown[]) => unknown>(callback: T, dependencies: unknown[]): T => {
  return React.useCallback(callback, useDeepCompareRef(dependencies));
};
