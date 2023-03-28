import styled from 'styled-components'
import { DistributionOptions } from '../interfaces'

export type RowProps = {
  mb?: number | string
  mt?: number | string
  distribution?: DistributionOptions
}

export const RowContainer = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ distribution }) => distribution || 'initial'};
  flex-grow: 1;
  margin-bottom: ${({ mb }) => (typeof mb === 'string' ? mb : mb + 'px') || 0};
  margin-top: ${({ mt }) => (typeof mt === 'string' ? mt : mt + 'px') || 0};
`
