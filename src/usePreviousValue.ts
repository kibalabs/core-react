import React from 'react';

export const usePreviousValue = <ValueType>(value: ValueType): ValueType => {
  const ref = React.useRef(value);
  React.useEffect((): void => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
