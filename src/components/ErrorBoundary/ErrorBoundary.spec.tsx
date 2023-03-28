import React, { ReactNode } from 'react'
import { render, screen } from '@/tests'
import { ErrorBoundary } from './ErrorBoundary'

const FakeComponent = ({ forceError = false }) => {
  React.useEffect(() => {
    if (forceError) {
      throw new Error()
    }
  }, [])

  return <span>Lets break this code!</span>
}

describe('<ErrorBoundary />', () => {
  it('Should show error message when children breaks with an error', () => {
    render(
      <ErrorBoundary>
        <FakeComponent forceError />
      </ErrorBoundary>
    )

    expect(
      screen.getByText('Something went wrong. Try to reload the page.')
    ).toBeTruthy()
  })

  it('Should render children without error', () => {
    render(
      <ErrorBoundary>
        <FakeComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Lets break this code!')).toBeTruthy()
  })
})
