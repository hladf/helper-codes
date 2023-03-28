import { FC, ReactNode } from 'react';

/** Functional component with optional `children` prop */
export type FCC<T = unknown> = FC<
  {
    children?: ReactNode;
  } & T
>;

/** Used for dropdown components */
export type IOption = {
  label: string;
  value: string;
};

export type GenericObjectType = {
  [key: string]: unknown;
};
