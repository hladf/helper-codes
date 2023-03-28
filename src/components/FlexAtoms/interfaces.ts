import React from 'react'

export type DirectionOptions =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse'
export type DistributionOptions =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export type WrapOptions = 'nowrap' | 'wrap' | 'wrap-reverse'
export type AlignOptions =
  | 'stretch'
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'baseline'

export type FlexProps = {
  children?: React.ReactNode
  direction?: DirectionOptions
  distribution?: DistributionOptions
  align?: AlignOptions
  wrap?: WrapOptions
  hasColumns?: boolean
  slots?: number
} & React.HtmlHTMLAttributes<HTMLDivElement>
