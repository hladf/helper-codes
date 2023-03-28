import React from 'react'
import { ColumnGap, ColumnStyled } from './styles'

type ColumnProps = {
  children?: React.ReactNode
  size?: number
}

export function Column({ children, size }: ColumnProps) {
  return (
    <ColumnStyled size={size}>
      <ColumnGap>{children}</ColumnGap>
    </ColumnStyled>
  )
}
