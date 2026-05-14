import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import InstructorDashboard from './InstructorDashboard'

describe('InstructorDashboard Page', () => {

  test('navbar ve dashboard başlığı render edilmeli', () => {
    render(
      <InstructorDashboard
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    )

    expect(screen.getAllByText('Dashboard')).toHaveLength(2)
    expect(screen.getByText('Sınav Yönetimi')).toBeInTheDocument()
    expect(screen.getByText('Raporlar')).toBeInTheDocument()
    expect(screen.getByText('Çıkış')).toBeInTheDocument()
  })

  test('AlertFeed istatistikleri render edilmeli', () => {
    render(
      <InstructorDashboard
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    )

    expect(screen.getByText('Bugünkü Aktif Sınavlar')).toBeInTheDocument()
    expect(screen.getByText('Aktif Oturumlar')).toBeInTheDocument()
    expect(screen.getByText('Kritik Alarm')).toBeInTheDocument()
  })

  test('StudentGrid öğrenci bilgileri render edilmeli', () => {
    render(
      <InstructorDashboard
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    )

    expect(screen.getByText('Ali Yılmaz')).toBeInTheDocument()
    expect(screen.getByText('Ayşe Demir')).toBeInTheDocument()
    expect(screen.getByText('Matematik Vize')).toBeInTheDocument()
    expect(screen.getByText('Fizik Final')).toBeInTheDocument()
  })

  test('Raporlar butonuna tıklanınca onNavigate report ile çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(
      <InstructorDashboard
        onNavigate={mockNavigate}
        onLogout={() => {}}
      />
    )

    await userEvent.click(screen.getByText('Raporlar'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('report')
  })

  test('StudentGrid içindeki Rapor butonuna tıklanınca onNavigate report ile çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(
      <InstructorDashboard
        onNavigate={mockNavigate}
        onLogout={() => {}}
      />
    )

    await userEvent.click(screen.getByText('📄 Rapor'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('report')
  })

  test('Çıkış butonuna tıklanınca onLogout çalışmalı', async () => {
    const mockLogout = vi.fn()

    render(
      <InstructorDashboard
        onNavigate={() => {}}
        onLogout={mockLogout}
      />
    )

    await userEvent.click(screen.getByText('Çıkış'))

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

})