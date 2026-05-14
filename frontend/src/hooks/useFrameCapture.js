import { useCallback, useRef } from 'react';

/**
 * useFrameCapture — Video elementinden base64 frame yakalar
 * Canvas kullanarak video frame'i JPEG base64'e çevirir
 */
export default function useFrameCapture(videoRef) {
  const canvasRef = useRef(null);

  // canvas'ı lazy oluştur
  const getCanvas = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    return canvasRef.current;
  }, []);

  /**
   * Mevcut video frame'ini base64 string olarak döndür
   * @param {number} quality - JPEG kalitesi (0-1), düşük = küçük boyut
   * @returns {string|null} base64 encoded JPEG (data:image/jpeg prefix'siz)
   */
  const captureFrame = useCallback((quality = 0.8) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null; // HAVE_CURRENT_DATA

    const canvas = getCanvas();
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // data:image/jpeg;base64, prefix'ini kaldır
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    return dataUrl.split(',')[1];
  }, [videoRef, getCanvas]);

  return { captureFrame };
}
