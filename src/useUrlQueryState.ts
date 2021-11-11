import React from 'react';

import { dateFromString, dateToString, integerFromString, integerToString } from '@kibalabs/core';

export const useUrlQueryState = (name: string, overrideInitialValue?: string | null, defaultValue?: string): [string | null | undefined, (newValue: string | null | undefined) => void] => {
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
    return paramValue === null ? defaultValue : paramValue;
  });

  const setter = React.useCallback((newValue: string | null | undefined): void => {
    const searchParams = new URLSearchParams(window.location.search);
    if (newValue === null || newValue === undefined) {
      searchParams.delete(name);
    } else {
      searchParams.set(name, newValue);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    setValue(newValue === null ? undefined : newValue);
  }, [name]);

  return [value, setter];
};

export const useIntegerUrlQueryState = (name: string, overrideInitialValue?: number, defaultValue?: number): [number | null, (newValue: number | null) => void] => {
  const [value, setValue] = useUrlQueryState(name, integerToString(overrideInitialValue), integerToString(defaultValue));
  return [integerFromString(value) as number | null, ((newValue: number | null): void => setValue(integerToString(newValue) as string | null))];
};

const serializeDateToString = (value: Date | null | undefined, format: string): string | null | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return dateToString(value, format);
};

const serializeDateFromString = (value: string | null | undefined, format: string): Date | null | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return dateFromString(value, format);
};

export const useDateUrlQueryState = (name: string, overrideInitialValue?: Date, defaultValue?: Date, format?: string): [Date | null, (newValue: Date | null) => void] => {
  const [value, setValue] = useUrlQueryState(name, dateToString(overrideInitialValue), dateToString(defaultValue));
  return [serializeDateFromString(value, format) as Date | null, ((newValue: Date | null): void => setValue(serializeDateToString(newValue, format) as string | null))];
};
