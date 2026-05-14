import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import SubmitButton from './SubmitButton'

describe('SubmitButton Component', () => {

  test('buton metnini render etmeli', () => {
    render(<SubmitButton onNavigate={() => {}} />)

    expect(
      screen.getByText('Sınavı Bitir')
    ).toBeInTheDocument()
  })

  test('buton doğru classlara sahip olmalı', () => {
    render(<SubmitButton onNavigate={() => {}} />)

    const button = screen.getByRole('button')

    expect(button).toHaveClass('btn-exam')
    expect(button).toHaveClass('btn-exam--submit')
  })

  test('butona tıklanınca onNavigate çalışmalı', async () => {
    const mockNavigate = vi.fn()

    render(<SubmitButton onNavigate={mockNavigate} />)

    const button = screen.getByRole('button')

    await userEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledTimes(1)

    expect(mockNavigate).toHaveBeenCalledWith(
      'instructor-dashboard'
    )
  })

})