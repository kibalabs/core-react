import React from 'react';

import { booleanFromString, booleanToString, LocalStorageClient, objectFromString, objectToString, stringListFromString, stringListToString } from '@kibalabs/core';

import { useValueSync } from './useValueSync';

export class MockStorage implements Storage {
  private storage: Map<string, string>;

  public constructor() {
    this.storage = new Map<string, string>();
  }

  public setItem(key: string, value: string | null | undefined): void {
    this.storage.set(key, value || '');
  }

  public getItem(key: string): string | null {
    return this.storage.has(key) ? this.storage.get(key) || null : null;
  }

  public removeItem(key: string): void {
    this.storage.delete(key);
  }

  public get length(): number {
    return this.storage.size;
  }

  public key(index: number): string | null {
    const keys = Object.keys(this.storage);
    return keys[index] || null;
  }

  public clear(): void {
    this.storage.clear();
  }
}

export const useLocalStorageState = (name: string, localStorageClient: LocalStorageClient, overrideInitialValue?: string | null): [string | null, (newValue: string | null) => void] => {
  const [value, setValue] = React.useState<string | null>((): string | null => {
    if (overrideInitialValue !== undefined) {
      localStorageClient.setValue(name, overrideInitialValue);
    }
    return localStorageClient.getValue(name);
  });

  const valueSetter = (newValue: string | null): void => {
    localStorageClient.setValue(name, newValue);
    setValue(newValue);
  };

  return [value, valueSetter];
};

export const useBooleanLocalStorageState = (name: string, localStorageClient: LocalStorageClient, overrideInitialValue?: boolean): [boolean | null, (newValue: boolean | null) => void] => {
  const [value, setValue] = useLocalStorageState(name, localStorageClient, booleanToString(overrideInitialValue));
  return [booleanFromString(value) as boolean | null, ((newValue: boolean | null): void => setValue(booleanToString(newValue) as string | null))];
};

export const useObjectLocalStorageState = (name: string, localStorageClient: LocalStorageClient, overrideInitialValue?: Record<string, unknown>): [Record<string, unknown> | null, (newValue: Record<string, unknown> | null) => void] => {
  const [value, setValue] = useLocalStorageState(name, localStorageClient, objectToString(overrideInitialValue));
  const [objectValue, setObjectValue] = React.useState<Record<string, unknown> | null>(objectFromString(value) as Record<string, unknown> | null);
  useValueSync(objectValue, ((newValue: Record<string, unknown> | null): void => setValue(objectToString(newValue) as string | null)));
  return [objectValue, setObjectValue];
};

export const useStringListLocalStorageState = (name: string, localStorageClient: LocalStorageClient, overrideInitialValue?: string[] | null, delimiter = ','): [string[] | null, (newValue: string[] | null) => void] => {
  const [value, setValue] = useLocalStorageState(name, localStorageClient, stringListToString(overrideInitialValue));
  return [stringListFromString(value, delimiter) as string[] | null, ((newValue: string[] | null): void => setValue(stringListToString(newValue, delimiter) as string | null))];
};
