import styled, { css } from 'styled-components'
import { get } from '@/utils'
import { FlexProps } from './interfaces'

function getProps(
  path: string,
  defaultValue: string | number | undefined,
  parser = (value: any) => value
) {
  return (props: any) => parser(get(props, path, defaultValue))
}

const divide2 = (value: number) => Number(value) / 2

function columnsSize(size?: number) {
  if (size && (!Number.isInteger(size) || size <= 0)) {
    return null
  }
  const grow = size! / 12
  const width = grow * 100
  return css`
    width: ${width}%;
    flex-grow: ${grow};
    flex-basis: 0;
  `
}

function hasColumns() {
  return ({ hasColumns }: { hasColumns?: boolean }) => {
    return (
      hasColumns &&
      css`
        margin-left: -${getProps('theme.grid.gap', 0, divide2)}px;
        margin-right: -${getProps('theme.grid.gap', 0, divide2)}px;
      `
    )
  }
}

function slots(slots: number) {
  if (!Number.isInteger(slots) || slots <= 0) {
    return null
  }
  const grow = 1 / slots
  return (
    slots &&
    css`
      && > * {
        flex-grow: ${grow};
        flex-basis: 0;
      }
    `
  )
}

export const ColumnGap = styled.div`
  margin: 0 ${getProps('theme.grid.gap', 0, divide2)}px;
`

export const ColumnStyled = styled.div<{ size?: number }>`
  ${({ size }) => columnsSize(size)}
`

export const FlexStyled = styled.div<FlexProps>`
  ${hasColumns()}
  display: flex;
  align-items: ${({ align }) => align};
  flex-direction: ${({ direction }) => direction};
  justify-content: ${({ distribution }) => distribution};
  flex-wrap: ${({ wrap }) => wrap};

  > * {
    flex-basis: 0;
  }

  ${getProps('slots', undefined, slots)}

  & + & {
    margin-top: ${getProps('theme.grid.gap', 0, divide2)}px;
  }
`
