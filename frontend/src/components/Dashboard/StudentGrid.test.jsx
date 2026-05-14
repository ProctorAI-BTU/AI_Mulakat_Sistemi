import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentGrid from './StudentGrid'

describe('StudentGrid Component', () => {

  test('öğrenci bilgilerini render etmeli', () => {
    render(<StudentGrid onNavigate={() => {}} />)

    expect(screen.getByText('Ali Yılmaz')).toBeInTheDocument()
    expect(screen.getByText('Ayşe Demir')).toBeInTheDocument()

    expect(screen.getByText('Matematik Vize')).toBeInTheDocument()
    expect(screen.getByText('Fizik Final')).toBeInTheDocument()
  })

  test('risk durumlarını göstermeli', () => {
    render(<StudentGrid onNavigate={() => {}} />)

    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('78')).toBeInTheDocument()

    expect(screen.getByText('Normal')).toBeInTheDocument()
    expect(screen.getByText('Yüksek Risk')).toBeInTheDocument()
  })

  test('rapor butonuna tıklanınca onNavigate çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(<StudentGrid onNavigate={mockNavigate} />)

    const reportButton = screen.getByText('📄 Rapor')

    await userEvent.click(reportButton)

    expect(mockNavigate).toHaveBeenCalledTimes(1)

    expect(mockNavigate).toHaveBeenCalledWith('report')
  })

})