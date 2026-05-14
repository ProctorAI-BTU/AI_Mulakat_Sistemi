import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import ReportPage from './ReportDetail'

describe('ReportPage', () => {

  test('sayfa başlığı ve öğrenci bilgileri render edilmeli', () => {
    render(<ReportPage onNavigate={() => {}} />)

    expect(screen.getByText('Risk Raporu')).toBeInTheDocument()

    expect(
      screen.getByText('Risk Raporu - Oturum #S12345')
    ).toBeInTheDocument()

    expect(screen.getByText('Ali Yılmaz')).toBeInTheDocument()
    expect(screen.getByText('Matematik Vize')).toBeInTheDocument()
  })

  test('genel risk bilgileri render edilmeli', () => {
    render(<ReportPage onNavigate={() => {}} />)

    expect(screen.getByText('68')).toBeInTheDocument()
    expect(screen.getByText('(Orta Risk)')).toBeInTheDocument()
  })

  test('ihlal özeti bilgileri render edilmeli', () => {
    render(<ReportPage onNavigate={() => {}} />)

    expect(screen.getByText('Tam ekran ihlali:')).toBeInTheDocument()
    expect(screen.getByText('Sekme değişimi:')).toBeInTheDocument()
    expect(screen.getByText('Şüpheli ses:')).toBeInTheDocument()
    expect(screen.getByText('Bakış yönü kaybı:')).toBeInTheDocument()
  })

  test('timeline eventleri render edilmeli', () => {
    render(<ReportPage onNavigate={() => {}} />)

    expect(
      screen.getByText('Tam ekran modundan çıkıldı (5 saniye)')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Sekme değişimi tespit edildi')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Bakış yönü kaybı (8 saniye)')
    ).toBeInTheDocument()
  })

  test('aksiyon butonları render edilmeli', () => {
    render(<ReportPage onNavigate={() => {}} />)

    expect(screen.getByText('📄 PDF İndir')).toBeInTheDocument()

    expect(
      screen.getByText('⬇ JSON Dışa Aktar')
    ).toBeInTheDocument()

    expect(
      screen.getByText('👁 Oturumu İncele')
    ).toBeInTheDocument()
  })

  test('geri dön butonu onNavigate çalıştırmalı', async () => {
    const mockNavigate = vi.fn()

    render(<ReportPage onNavigate={mockNavigate} />)

    await userEvent.click(screen.getByText('Geri Dön'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)

    expect(mockNavigate).toHaveBeenCalledWith(
      'admin-dashboard'
    )
  })

  test('widget görünümü render edilmeli', () => {
    render(<ReportPage onNavigate={() => {}} />)

    expect(
      screen.getByText('Kurumsal Gömülü Widget Görünümü')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Gözetimli Sınav Modülü')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Sınavı Başlat')
    ).toBeInTheDocument()
  })

})