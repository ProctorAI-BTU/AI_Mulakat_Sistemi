import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Login from './Login'
import authService from '../services/auth.js'

vi.mock('../services/auth.js', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
  },
}))

describe('Login Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  test('instructor login başarılı olunca instructor-dashboard yönlendirmesi çalışmalı', async () => {
    const mockNavigate = vi.fn()

    authService.login.mockResolvedValue({
      success: true,
      data: {
        user: {
          role: 'instructor',
        },
      },
    })

    render(<Login onNavigate={mockNavigate} />)

    await userEvent.type(screen.getByLabelText('E-posta'), 'test@test.com')
    await userEvent.type(screen.getByLabelText('Şifre'), '123456')
    await userEvent.click(screen.getByText('Giriş Yap'))

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    })

    expect(mockNavigate).toHaveBeenCalledWith('instructor-dashboard')
  })

  test('student login başarılı olunca exam-room yönlendirmesi çalışmalı', async () => {
    const mockNavigate = vi.fn()

    authService.login.mockResolvedValue({
      success: true,
      data: {
        user: {
          role: 'student',
        },
      },
    })

    render(<Login onNavigate={mockNavigate} />)

    await userEvent.type(screen.getByLabelText('E-posta'), 'student@test.com')
    await userEvent.type(screen.getByLabelText('Şifre'), '123456')
    await userEvent.click(screen.getByText('Giriş Yap'))

    expect(mockNavigate).toHaveBeenCalledWith('exam-room')
  })

  test('kayıt başarılı olunca başarı mesajı gösterilmeli ve login ekranına dönmeli', async () => {
    authService.register.mockResolvedValue({
      success: true,
    })

    render(<Login onNavigate={() => {}} />)

    await userEvent.click(screen.getByText('Kayıt Ol'))

    await userEvent.type(screen.getByLabelText('Ad Soyad'), 'Ali Yılmaz')
    await userEvent.type(screen.getByLabelText('E-posta'), 'ali@test.com')
    await userEvent.type(screen.getByLabelText('Şifre'), '123456')

    await userEvent.click(screen.getByText('Hesap Oluştur'))

    expect(authService.register).toHaveBeenCalledWith({
      name: 'Ali Yılmaz',
      email: 'ali@test.com',
      password: '123456',
    })

    expect(
      await screen.findByText('Kayıt başarılı! Giriş yapabilirsiniz.')
    ).toBeInTheDocument()

    expect(
      screen.getByText('AI Destekli Online Sınav Sistemi')
    ).toBeInTheDocument()
  })

  test('şifremi unuttum için e-posta boşsa hata göstermeli', async () => {
    render(<Login onNavigate={() => {}} />)

    await userEvent.click(screen.getByText('Yardım / Şifremi Unuttum'))

    expect(
      screen.getByText('Lütfen önce e-posta adresinizi girin')
    ).toBeInTheDocument()
  })

  test('şifremi unuttum başarılı olunca başarı mesajı göstermeli', async () => {
    authService.forgotPassword.mockResolvedValue({
      success: true,
    })

    render(<Login onNavigate={() => {}} />)

    await userEvent.type(screen.getByLabelText('E-posta'), 'test@test.com')
    await userEvent.click(screen.getByText('Yardım / Şifremi Unuttum'))

    expect(authService.forgotPassword).toHaveBeenCalledWith('test@test.com')

    expect(
      await screen.findByText('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi')
    ).toBeInTheDocument()
  })

})