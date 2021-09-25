import React from 'react';

import { useDeepCompareRef } from './useDeepCompareRef';

export const useDeepCompareEffect = (callback: () => void, dependencies: unknown[]): void => {
  React.useEffect(callback, useDeepCompareRef(dependencies));
};
