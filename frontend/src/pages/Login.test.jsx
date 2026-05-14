import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Login from './Login'

describe('Login Page', () => {

  test('login ekranı başlangıçta render edilmeli', () => {
    render(<Login onNavigate={() => {}} />)

    expect(
      screen.getByText('AI Destekli Online Sınav Sistemi')
    ).toBeInTheDocument()

    expect(screen.getByLabelText('E-posta')).toBeInTheDocument()
    expect(screen.getByLabelText('Şifre')).toBeInTheDocument()
    expect(screen.getByText('Giriş Yap')).toBeInTheDocument()
    expect(screen.getByText('Kayıt Ol')).toBeInTheDocument()
    expect(screen.getByText('Yardım / Şifremi Unuttum')).toBeInTheDocument()
  })

  test('Kayıt Ol butonuna basınca kayıt ekranına geçmeli', async () => {
    render(<Login onNavigate={() => {}} />)

    await userEvent.click(screen.getByText('Kayıt Ol'))

    expect(screen.getByText('Kayıt Oluştur')).toBeInTheDocument()
    expect(screen.getByLabelText('Ad Soyad')).toBeInTheDocument()
    expect(screen.getByLabelText('Rol')).toBeInTheDocument()
    expect(screen.getByText('Hesap Oluştur')).toBeInTheDocument()
    expect(screen.getByText('Vazgeç')).toBeInTheDocument()
    expect(screen.queryByText('Yardım / Şifremi Unuttum')).not.toBeInTheDocument()
  })

  test('Vazgeç butonuna basınca tekrar login ekranına dönmeli', async () => {
    render(<Login onNavigate={() => {}} />)

    await userEvent.click(screen.getByText('Kayıt Ol'))
    await userEvent.click(screen.getByText('Vazgeç'))

    expect(
      screen.getByText('AI Destekli Online Sınav Sistemi')
    ).toBeInTheDocument()

    expect(screen.queryByLabelText('Ad Soyad')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Rol')).not.toBeInTheDocument()
  })

  test('Giriş Yap butonuna basınca instructor-dashboard yönlendirmesi çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(<Login onNavigate={mockNavigate} />)

    await userEvent.click(screen.getByText('Giriş Yap'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('instructor-dashboard')
  })

  test('kayıt ekranında Hesap Oluştur butonuna basınca login yönlendirmesi çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(<Login onNavigate={mockNavigate} />)

    await userEvent.click(screen.getByText('Kayıt Ol'))
    await userEvent.click(screen.getByText('Hesap Oluştur'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('login')
  })

})