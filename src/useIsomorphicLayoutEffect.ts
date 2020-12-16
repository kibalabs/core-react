import React from 'react';

import { getIsRunningOnBrowser } from './browserUtil';

export const useIsomorphicLayoutEffect = getIsRunningOnBrowser() ? React.useLayoutEffect : React.useEffect;
