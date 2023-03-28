import React from 'react'
import { fireEvent, render, screen } from '@/tests'
import { CopyToClipboardButton } from './CopyToClipboardButton'

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
})

const renderCopyToClipboardButton = () => {
  const { getByTestId } = render(
    <CopyToClipboardButton text="My text" data-testid="button" />
  )
  fireEvent.click(getByTestId('button'))
}

describe('<CopyToClipboardButton>', () => {
  it('Should copy to clipboard when button is clicked', async () => {
    const mockedWriteText = jest.fn()
    jest
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementation(mockedWriteText)
    renderCopyToClipboardButton()
    expect(mockedWriteText.mock.calls[0][0]).toBe('My text')
  })
})
