import React from 'react';

export interface ISingleChildProps<PropsType> {
  children: React.ReactElement<PropsType>;
}

// NOTE(krishan711): if a child is optional allow null, boolean and "" so people can do { var && (<Component />) }
export type OptionalProppedElement<PropsType> = React.ReactElement<PropsType> | false | null | undefined | '';

export interface IOptionalSingleChildProps<PropsType> {
  children?: OptionalProppedElement<PropsType>;
}

export interface IMultiChildProps<PropsType> {
  children?: OptionalProppedElement<PropsType> | OptionalProppedElement<PropsType>[] | OptionalProppedElement<PropsType>[][];
}

export interface ISingleAnyChildProps {
  children: React.ReactNode;
}

export interface IOptionalSingleAnyChildProps {
  children?: React.ReactNode;
}

export interface IMultiAnyChildProps {
  children?: React.ReactNode | React.ReactNode[];
}
