import { render, screen } from '@testing-library/react'
import AlertFeed from './AlertFeed'

describe('AlertFeed Component', () => {

  test('başlık değerlerini doğru render etmeli', () => {
    render(<AlertFeed />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('48')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  test('istatistik labellarını göstermeli', () => {
    render(<AlertFeed />)

    expect(
      screen.getByText('Bugünkü Aktif Sınavlar')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Aktif Oturumlar')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Kritik Alarm')
    ).toBeInTheDocument()
  })

  test('kritik alarm danger classına sahip olmalı', () => {
    render(<AlertFeed />)

    const criticalAlert = screen.getByText('4')

    expect(criticalAlert).toHaveClass('stat-number--danger')
  })

})