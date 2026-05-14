import { useState, useEffect, useCallback, useRef } from 'react';
import useCamera from './useCamera.js';
import useFrameCapture from './useFrameCapture.js';
import useTabVisibility from './useTabVisibility.js';
import proctoringService from '../services/proctoring.js';

/**
 * useProctoring — Ana gözetim orchestrator hook
 * Kamera + Frame yakalama + AI analiz + Tab/Fullscreen ihlal takibi
 *
 * Her ANALYSIS_INTERVAL_MS'de bir:
 *  1. Kameradan frame yakala
 *  2. Face detection + Eye tracking AI'a gönder
 *  3. Risk skorunu güncelle
 *  4. Sonuçları state'e yaz
 */

const ANALYSIS_INTERVAL_MS = 3000; // 3 saniyede bir analiz

export default function useProctoring(sessionId) {
  const { videoRef, isActive: cameraActive, error: cameraError, startCamera, stopCamera } = useCamera();
  const { captureFrame } = useFrameCapture(videoRef);

  // AI sonuçları
  const [faceResult, setFaceResult] = useState(null);
  const [gazeResult, setGazeResult] = useState(null);
  const [riskData, setRiskData] = useState({
    risk_score: 0,
    risk_level: 'low',
    reasons: [],
    event_counts: {},
  });

  // Durum
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiHealth, setAiHealth] = useState([]);
  const [violationCount, setViolationCount] = useState(0);
  const intervalRef = useRef(null);
  const sessionIdRef = useRef(sessionId);
  const cameraActiveRef = useRef(cameraActive);

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { cameraActiveRef.current = cameraActive; }, [cameraActive]);

  // Tab/Fullscreen ihlal callback'i
  const handleViolation = useCallback(async (type, violations) => {
    const total = violations.tabSwitch + violations.fullscreenExit;
    setViolationCount(total);

    // İhlali risk scoring'e bildir
    if (sessionIdRef.current) {
      await proctoringService.sendEvent(sessionIdRef.current, type);
    }
  }, []);

  const tabVisibility = useTabVisibility(handleViolation);

  // Tek bir analiz döngüsü — ref'ler üzerinden çalışır, dependency değişimlerinden etkilenmez
  const runAnalysis = useCallback(async () => {
    if (!sessionIdRef.current || !cameraActiveRef.current) return;

    const frame = captureFrame(0.8);
    if (!frame) return;

    setIsAnalyzing(true);

    try {
      // Face detection ve Eye tracking paralel çağır
      const [faceRes, gazeRes] = await Promise.all([
        proctoringService.detectFace(sessionIdRef.current, frame),
        proctoringService.trackGaze(sessionIdRef.current, frame),
      ]);

      if (faceRes) {
        setFaceResult(faceRes);
        if (faceRes.event_type && faceRes.event_type !== 'face_ok') {
          await proctoringService.sendEvent(sessionIdRef.current, faceRes.event_type);
        }
      }

      if (gazeRes) {
        setGazeResult(gazeRes);
        if (gazeRes.event_type && gazeRes.event_type !== 'gaze_ok') {
          await proctoringService.sendEvent(sessionIdRef.current, gazeRes.event_type);
        }
      }

      // Risk skorunu güncelle
      const score = await proctoringService.getRiskScore(sessionIdRef.current);
      if (score) setRiskData(score);

    } catch (err) {
      console.warn('[useProctoring] Analiz hatası:', err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [captureFrame]);

  // Proctoring'i başlat
  const startProctoring = useCallback(async () => {
    await startCamera();

    // AI servislerinin sağlık durumunu kontrol et
    const health = await proctoringService.checkHealth();
    setAiHealth(health);
  }, [startCamera]);

  // Proctoring'i durdur
  const stopProctoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopCamera();
  }, [stopCamera]);

  // Bileşen unmount olunca temizle
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Kamera açıldığında analiz interval'ını başlat
  useEffect(() => {
    if (cameraActive) {
      // Önceki interval varsa temizle
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(runAnalysis, ANALYSIS_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraActive, runAnalysis]);

  return {
    // Kamera
    videoRef,
    cameraActive,
    cameraError,

    // AI sonuçları
    faceResult,
    gazeResult,
    riskData,
    isAnalyzing,
    aiHealth,

    // İhlaller
    isTabVisible: tabVisibility.isTabVisible,
    isFullscreen: tabVisibility.isFullscreen,
    violations: tabVisibility.violations,
    violationCount,
    requestFullscreen: tabVisibility.requestFullscreen,

    // Kontrol
    startProctoring,
    stopProctoring,
  };
}
