import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import ExamRoom from './ExamRoom'

vi.mock('../hooks/useProctoring.js', () => ({
  default: () => ({
    videoRef: { current: null },

    startProctoring: vi.fn(),
    stopProctoring: vi.fn(),
    requestFullscreen: vi.fn(),

    isFullscreen: true,
    isTabVisible: true,
    cameraActive: true,
    isAnalyzing: false,

    violationCount: 0,

    riskData: {
      risk_score: 24,
      risk_level: 'low',
    },

    faceResult: {
      face_detected: true,
    },

    gazeResult: {
      gaze: 'screen',
    },
  }),
}))

vi.mock('../services/exam.js', () => ({
  default: {
    startSession: vi.fn(),
    finishSession: vi.fn(),
  },
}))

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        success: true,
        questions: [
          {
            _id: 'q1',
            text: 'Test Sorusu',
            options: ['A', 'B', 'C', 'D'],
          },
        ],
      }),
  })
)

describe('ExamRoom Page', () => {

  test('başlangıç ekranı render edilmeli', () => {
    render(<ExamRoom onNavigate={() => {}} />)

    expect(
      screen.getByText('Sınava Başlamadan Önce')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Sınavı Başlat')
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Kamera erişimi gereklidir/i)
    ).toBeInTheDocument()
  })

  test('Sınavı Başlat butonuna tıklanınca sınav ekranı açılmalı', async () => {
    render(<ExamRoom onNavigate={() => {}} />)

    const startButton = screen.getByText('Sınavı Başlat')

    await userEvent.click(startButton)

    expect(
      await screen.findByText('Sınav: Matematik Vize')
    ).toBeInTheDocument()

    expect(
      screen.getByText('00:42:13')
    ).toBeInTheDocument()
  })

  test('soru bilgileri render edilmeli', async () => {
    render(<ExamRoom onNavigate={() => {}} />)

    await userEvent.click(
      screen.getByText('Sınavı Başlat')
    )

    expect(
      await screen.findByText('Soru 1 / 1')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Test Sorusu')
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('radio')
    ).toHaveLength(4)
  })

  test('proctoring durumları gösterilmeli', async () => {
    render(<ExamRoom onNavigate={() => {}} />)

    await userEvent.click(
      screen.getByText('Sınavı Başlat')
    )

    expect(
      await screen.findByText(/Risk:/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Düşük/i)
    ).toBeInTheDocument()
  })

  test('Önceki butonu ilk soruda disabled olmalı', async () => {
    render(<ExamRoom onNavigate={() => {}} />)

    await userEvent.click(
      screen.getByText('Sınavı Başlat')
    )

    const prevButton =
      await screen.findByText('Önceki')

    expect(prevButton).toBeDisabled()
  })

  test('son soruda Sınavı Bitir butonu görünmeli', async () => {
    render(<ExamRoom onNavigate={() => {}} />)

    await userEvent.click(
      screen.getByText('Sınavı Başlat')
    )

    expect(
      await screen.findByText('Sınavı Bitir')
    ).toBeInTheDocument()
  })

})