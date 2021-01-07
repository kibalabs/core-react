import React from 'react';

export interface ISingleChildProps<PropsType> {
  children: React.ReactElement<PropsType>;
}

export interface IOptionalSingleChildProps<PropsType> {
  children?: React.ReactElement<PropsType>;
}

export interface IMultiChildProps<PropsType> {
  children?: React.ReactElement<PropsType> | React.ReactElement<PropsType>[];
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
