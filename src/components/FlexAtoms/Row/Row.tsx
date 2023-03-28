import React from 'react'

import { RowContainer, RowProps } from './styles'

export const Row: React.FC<React.HTMLAttributes<HTMLDivElement> & RowProps> = ({
  children,
  mb,
  mt,
  distribution,
  ...rest
}) => {
  return (
    <RowContainer distribution={distribution} mb={mb} mt={mt} {...rest}>
      {children}
    </RowContainer>
  )
}
