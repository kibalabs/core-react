import React from 'react';

import { useDeepCompareRef } from './useDeepCompareRef';

export const useDeepCompareMemo = <T>(callback: () => T, dependencies: unknown[]): T => {
  return React.useMemo(callback, useDeepCompareRef(dependencies));
};
