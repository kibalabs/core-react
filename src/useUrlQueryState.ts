import React from 'react';

import { dateFromString, dateToString, integerFromString, integerToString } from '@kibalabs/core';

export const useUrlQueryState = (name: string, overrideInitialValue?: string | null, defaultValue?: string): [string | null, (newValue: string | null) => void] => {
  const [value, setValue] = React.useState<string | undefined>((): string | undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    if (overrideInitialValue !== undefined) {
      if (overrideInitialValue) {
        searchParams.set(name, overrideInitialValue);
      } else {
        searchParams.delete(name);
      }
    }
    const paramValue = searchParams.get(name);
    return paramValue === null || paramValue === undefined ? defaultValue : paramValue;
  });

  const setter = React.useCallback((newValue: string | null | undefined): void => {
    const searchParams = new URLSearchParams(window.location.search);
    if (newValue === null || newValue === undefined) {
      searchParams.delete(name);
    } else {
      searchParams.set(name, newValue);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    setValue(newValue === null || newValue === undefined ? defaultValue : newValue);
  }, [name]);

  return [value, setter];
};

export const useIntegerUrlQueryState = (name: string, overrideInitialValue?: number): [number | null, (newValue: number | null) => void] => {
  const [value, setValue] = useUrlQueryState(name, integerToString(overrideInitialValue));
  return [integerFromString(value) as number | null, ((newValue: number | null): void => setValue(integerToString(newValue) as string | null))];
};

const serializeDateToString = (value: Date | null | undefined, format?: string): string | null | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return dateToString(value, format);
};

const serializeDateFromString = (value: string | null | undefined, format?: string): Date | null | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return dateFromString(value, format);
};

export const useDateUrlQueryState = (name: string, overrideInitialValue?: Date, format?: string, defaultValue?: Date): [Date | null, (newValue: Date | null) => void] => {
  const [value, setValue] = useUrlQueryState(name, serializeDateToString(overrideInitialValue, format), serializeDateToString(defaultValue, format) as string | undefined);
  const valueMemo = React.useMemo((): Date | null => serializeDateFromString(value, format) as Date | null, [value]);
  return [valueMemo, ((newValue: Date | null): void => setValue(serializeDateToString(newValue, format) as string | null))];
};
