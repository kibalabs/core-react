import React from 'react';

import { useDeepCompareRef } from './useDeepCompareRef';

export const useDeepCompareEffect = (callback: () => void, dependencies: unknown[]): void => {
  // NOTE(krishan711): we purposefully don't include the callback itself as a dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(callback, useDeepCompareRef(dependencies));
};
