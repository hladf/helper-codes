import React from 'react'
import { FlexProps } from './interfaces'
import { FlexStyled } from './styles'

const FlexDefaultProps: FlexProps = {
  direction: 'row',
  distribution: 'flex-start',
  align: 'stretch',
  wrap: 'nowrap',
}

export function Flex({ children, ...props }: FlexProps = FlexDefaultProps) {
  return <FlexStyled {...props}>{children}</FlexStyled>
}
