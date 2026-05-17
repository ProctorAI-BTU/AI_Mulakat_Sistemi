import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import QuestionCard from './QuestionCard'

describe('QuestionCard Component', () => {
  const mockQuestion = {
    _id: 'q1',
    text: 'Aşağıdaki integrali çözünüz: ∫x² dx',
    options: [
      'A) x³/3 + C',
      'B) x³ + C',
      'C) 2x + C',
      'D) x²/2 + C',
    ],
  }

  test('question yoksa hiçbir şey render etmemeli', () => {
    const { container } = render(
      <QuestionCard
        question={null}
        selectedOption={null}
        onOptionSelect={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('soru metnini ve seçenekleri render etmeli', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedOption={null}
        onOptionSelect={() => {}}
      />
    )

    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument()

    mockQuestion.options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument()
    })
  })

  test('seçenek sayısı kadar radio input render etmeli', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedOption={null}
        onOptionSelect={() => {}}
      />
    )

    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  test('radio inputlar question id ile aynı name değerine sahip olmalı', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedOption={null}
        onOptionSelect={() => {}}
      />
    )

    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'q_q1')
    })
  })

  test('selectedOption değerine göre ilgili radio seçili olmalı', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        selectedOption={1}
        onOptionSelect={() => {}}
      />
    )

    const radioButtons = screen.getAllByRole('radio')

    expect(radioButtons[1]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
  })

  test('radio seçilince onOptionSelect doğru index ile çalışmalı', async () => {
    const mockSelect = vi.fn()

    render(
      <QuestionCard
        question={mockQuestion}
        selectedOption={null}
        onOptionSelect={mockSelect}
      />
    )

    const radioButtons = screen.getAllByRole('radio')

    await userEvent.click(radioButtons[2])

    expect(mockSelect).toHaveBeenCalledTimes(1)
    expect(mockSelect).toHaveBeenCalledWith(2)
  })
})