import React from 'react'

import { GlobalStyles } from '.'
import { render } from '@/tests'

describe('<GlobalStyles />', () => {
  it('Should render without breaking', async () => {
    const { container, unmount } = render(<GlobalStyles />)
    expect(container).toBeTruthy()
    unmount()
  })
})
