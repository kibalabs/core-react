import React from 'react';

import { useDeepCompareRef } from './useDeepCompareRef';

export const useDeepCompareCallback = <T extends (...args: unknown[]) => unknown>(callback: T, dependencies: unknown[]): T => {
  // NOTE(krishan711): we purposefully don't include the callback itself as a dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(callback, useDeepCompareRef(dependencies));
};
