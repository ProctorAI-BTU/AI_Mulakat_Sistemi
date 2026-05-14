import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import ExamRoom from './ExamRoom'

describe('ExamRoom Page', () => {

  test('sınav başlığı ve timer render edilmeli', () => {
    render(<ExamRoom onNavigate={() => {}} />)

    expect(screen.getByText('Sınav: Matematik Vize')).toBeInTheDocument()
    expect(screen.getByText('00:42:13')).toBeInTheDocument()
  })

  test('proctoring durumları ve risk bilgisi gösterilmeli', () => {
    render(<ExamRoom onNavigate={() => {}} />)

    expect(screen.getByText('Kamera: Aktif')).toBeInTheDocument()
    expect(screen.getByText('Mikrofon: Aktif')).toBeInTheDocument()
    expect(screen.getByText('Fullscreen: Açık')).toBeInTheDocument()
    expect(screen.getByText('Risk: 24 (Düşük)')).toBeInTheDocument()
  })

  test('soru kartı ve seçenekler render edilmeli', () => {
    render(<ExamRoom onNavigate={() => {}} />)

    expect(screen.getByText('Soru 1 / 2')).toBeInTheDocument()
    expect(screen.getByText('Aşağıdaki integrali çözünüz: ∫x² dx')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  test('uyarı modalı başlangıçta görünmeli', () => {
    render(<ExamRoom onNavigate={() => {}} />)

    expect(screen.getByText('UYARI')).toBeInTheDocument()
    expect(screen.getByText('Tam ekran modundan çıkıldı.')).toBeInTheDocument()
    expect(screen.getByText('İhlal sayısı: 2 / 3')).toBeInTheDocument()
  })

  test('Tam Ekrana Dön butonuna tıklanınca modal kapanmalı', async () => {
    render(<ExamRoom onNavigate={() => {}} />)

    const button = screen.getByText('Tam Ekrana Dön')

    await userEvent.click(button)

    expect(screen.queryByText('UYARI')).not.toBeInTheDocument()
    expect(screen.queryByText('Tam ekran modundan çıkıldı.')).not.toBeInTheDocument()
  })

  test('Sınavı Bitir butonuna tıklanınca onNavigate çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(<ExamRoom onNavigate={mockNavigate} />)

    const submitButton = screen.getByText('Sınavı Bitir')

    await userEvent.click(submitButton)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('instructor-dashboard')
  })

  test('Önceki butonu disabled olmalı', () => {
    render(<ExamRoom onNavigate={() => {}} />)

    const prevButton = screen.getByText('Önceki')

    expect(prevButton).toBeDisabled()
  })

})