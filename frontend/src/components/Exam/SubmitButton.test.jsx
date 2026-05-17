import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import SubmitButton from './SubmitButton'
import authService from '../../services/auth.js'

vi.mock('../../services/auth.js', () => ({
  default: {
    getUserRole: vi.fn(),
    logout: vi.fn(),
  },
}))

describe('SubmitButton Component', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('buton metnini render etmeli', () => {
    render(<SubmitButton onNavigate={() => {}} />)

    expect(
      screen.getByText('Sınavı Bitir')
    ).toBeInTheDocument()
  })

  test('buton doğru classlara sahip olmalı', () => {
    render(<SubmitButton onNavigate={() => {}} />)

    const button = screen.getByText('Sınavı Bitir')

    expect(button).toHaveClass('btn-exam')
    expect(button).toHaveClass('btn-exam--submit')
  })

  test('admin kullanıcı dashboarda yönlendirilmeli', async () => {
    const mockNavigate = vi.fn()

    authService.getUserRole.mockReturnValue('admin')

    render(<SubmitButton onNavigate={mockNavigate} />)

    await userEvent.click(
      screen.getByText('Sınavı Bitir')
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      'instructor-dashboard'
    )

    expect(authService.logout).not.toHaveBeenCalled()
  })

  test('instructor kullanıcı dashboarda yönlendirilmeli', async () => {
    const mockNavigate = vi.fn()

    authService.getUserRole.mockReturnValue('instructor')

    render(<SubmitButton onNavigate={mockNavigate} />)

    await userEvent.click(
      screen.getByText('Sınavı Bitir')
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      'instructor-dashboard'
    )

    expect(authService.logout).not.toHaveBeenCalled()
  })

  test('student kullanıcı login sayfasına yönlendirilmeli', async () => {
    const mockNavigate = vi.fn()

    authService.getUserRole.mockReturnValue('student')

    render(<SubmitButton onNavigate={mockNavigate} />)

    await userEvent.click(
      screen.getByText('Sınavı Bitir')
    )

    expect(authService.logout).toHaveBeenCalledTimes(1)

    expect(mockNavigate).toHaveBeenCalledWith(
      'login'
    )
  })

  test('role yoksa varsayılan olarak login sayfasına yönlendirilmeli', async () => {
    const mockNavigate = vi.fn()

    authService.getUserRole.mockReturnValue(undefined)

    render(<SubmitButton onNavigate={mockNavigate} />)

    await userEvent.click(
      screen.getByText('Sınavı Bitir')
    )

    expect(authService.logout).toHaveBeenCalled()

    expect(mockNavigate).toHaveBeenCalledWith(
      'login'
    )
  })

})