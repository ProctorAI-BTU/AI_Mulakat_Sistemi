import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import RiskCharts from './RiskCharts'

vi.mock('react-chartjs-2', () => ({
  Doughnut: ({ data }) => (
    <div data-testid="doughnut-chart">
      {data.labels.join(', ')}
    </div>
  ),
  Bar: ({ data }) => (
    <div data-testid="bar-chart">
      {data.labels.join(', ')}
    </div>
  ),
}))

describe('RiskCharts Component', () => {

  test('grafik başlıklarını render etmeli', () => {
    render(<RiskCharts />)

    expect(screen.getByText('Risk Seviyesi Dagilimi')).toBeInTheDocument()
    expect(screen.getByText('Sinav Bazli Ortalama Risk')).toBeInTheDocument()
  })

  test('grafik açıklamalarını render etmeli', () => {
    render(<RiskCharts />)

    expect(screen.getByText('Aktif oturumlardaki ogrenci dagilimi')).toBeInTheDocument()
    expect(screen.getByText('Aktif sinavlardaki risk skorlari')).toBeInTheDocument()
  })

  test('doughnut ve bar chart render edilmeli', () => {
    render(<RiskCharts />)

    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  test('doughnut chart risk seviyelerini içermeli', () => {
    render(<RiskCharts />)

    const doughnutChart = screen.getByTestId('doughnut-chart')

    expect(doughnutChart).toHaveTextContent('Normal')
    expect(doughnutChart).toHaveTextContent('Orta Risk')
    expect(doughnutChart).toHaveTextContent('Yuksek Risk')
    expect(doughnutChart).toHaveTextContent('Kritik')
  })

  test('bar chart sınav isimlerini içermeli', () => {
    render(<RiskCharts />)

    const barChart = screen.getByTestId('bar-chart')

    expect(barChart).toHaveTextContent('Matematik Vize')
    expect(barChart).toHaveTextContent('Fizik Final')
    expect(barChart).toHaveTextContent('Kimya Vize')
    expect(barChart).toHaveTextContent('Biyoloji Quiz')
    expect(barChart).toHaveTextContent('Tarih Vize')
  })

})