import { render, screen } from '@testing-library/react'
import StatusIndicator from './StatusIndicator'

describe('StatusIndicator Component', () => {

  test('camera type için doğru label göstermeli', () => {
    render(
      <StatusIndicator
        type="camera"
        status="active"
      />
    )

    expect(
      screen.getByText('Kamera: Aktif')
    ).toBeInTheDocument()
  })

  test('mic type için doğru label göstermeli', () => {
    render(
      <StatusIndicator
        type="mic"
        status="active"
      />
    )

    expect(
      screen.getByText('Mikrofon: Aktif')
    ).toBeInTheDocument()
  })

  test('fullscreen type için doğru label göstermeli', () => {
    render(
      <StatusIndicator
        type="fullscreen"
        status="active"
      />
    )

    expect(
      screen.getByText('Fullscreen: Açık')
    ).toBeInTheDocument()
  })

  test('active status için yeşil dot classı vermeli', () => {
    const { container } = render(
      <StatusIndicator
        type="camera"
        status="active"
      />
    )

    const dot = container.querySelector('.dot')

    expect(dot).toHaveClass('dot--green')
  })

  test('inactive status için kırmızı dot classı vermeli', () => {
    const { container } = render(
      <StatusIndicator
        type="camera"
        status="inactive"
      />
    )

    const dot = container.querySelector('.dot')

    expect(dot).toHaveClass('dot--red')
  })

})