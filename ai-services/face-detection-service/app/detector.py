"""Hybrid face detection engine: MediaPipe first, OpenCV Haar fallback."""

import logging

import cv2
import numpy as np

from .utils import bgr_to_rgb, decode_base64_image, normalize_confidence, validate_image

logger = logging.getLogger(__name__)

try:
    from mediapipe.python.solutions import face_detection as _mp_fd

    MEDIAPIPE_AVAILABLE = True
    logger.info("MediaPipe face detection loaded.")
except Exception as exc:
    MEDIAPIPE_AVAILABLE = False
    logger.warning(f"MediaPipe could not be loaded ({exc}); Haar fallback is active.")


class FaceDetector:
    """Detect whether an exam camera frame contains zero, one, or multiple faces."""

    def __init__(self):
        self._mp_detector = None
        if MEDIAPIPE_AVAILABLE:
            try:
                self._mp_detector = _mp_fd.FaceDetection(
                    model_selection=0,
                    min_detection_confidence=0.5,
                )
                logger.info("MediaPipe FaceDetection initialized.")
            except Exception as exc:
                logger.warning(f"MediaPipe FaceDetection could not initialize: {exc}")

        self._haar = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        if self._haar.empty():
            logger.warning("OpenCV Haar cascade could not be loaded.")

    def detect(self, image_base64: str) -> dict:
        img = decode_base64_image(image_base64)

        if not validate_image(img):
            return self._result(
                False,
                False,
                0,
                0.0,
                "FACE_NOT_FOUND",
                "Image is invalid or could not be decoded.",
            )

        if self._mp_detector is not None:
            mp_result = self._run_mediapipe(img)
            if mp_result is not None and mp_result["face_count"] > 0:
                return mp_result

        return self._run_haar(img)

    def _run_mediapipe(self, img: np.ndarray) -> dict | None:
        """Run MediaPipe. Return None only when processing fails."""
        try:
            results = self._mp_detector.process(bgr_to_rgb(img))
        except Exception as exc:
            logger.warning(f"MediaPipe processing failed: {exc}")
            return None

        if not results.detections:
            return self._result(
                False,
                False,
                0,
                0.0,
                "FACE_NOT_FOUND",
                "No face detected.",
            )

        count = len(results.detections)
        scores = [float(d.score[0]) for d in results.detections if d.score]
        confidence = normalize_confidence(float(np.mean(scores)) if scores else 0.8)

        if count == 1:
            return self._result(
                True,
                False,
                1,
                confidence,
                "FACE_OK",
                f"Single face detected. confidence={confidence:.2f}",
            )

        return self._result(
            True,
            True,
            count,
            confidence,
            "MULTIPLE_FACE_DETECTED",
            f"{count} faces detected.",
        )

    def _run_haar(self, img: np.ndarray) -> dict:
        """OpenCV Haar Cascade fallback."""
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self._haar.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(60, 60),
            )
        except Exception as exc:
            logger.error(f"Haar detection failed: {exc}")
            return self._result(
                False,
                False,
                0,
                0.0,
                "FACE_NOT_FOUND",
                f"Image processing failed: {exc}",
            )

        count = len(faces)
        if count == 0:
            return self._result(False, False, 0, 0.0, "FACE_NOT_FOUND", "No face detected.")

        if count == 1:
            x, y, w, h = faces[0]
            area_ratio = (w * h) / (img.shape[0] * img.shape[1])
            confidence = normalize_confidence(min(area_ratio * 8, 0.8))
            return self._result(
                True,
                False,
                1,
                confidence,
                "FACE_OK",
                f"Single face detected by Haar. confidence={confidence:.2f}",
            )

        return self._result(
            True,
            True,
            count,
            0.85,
            "MULTIPLE_FACE_DETECTED",
            f"{count} faces detected by Haar.",
        )

    @staticmethod
    def _result(
        detected: bool,
        multiple: bool,
        count: int,
        confidence: float,
        event: str,
        message: str,
    ) -> dict:
        return {
            "face_detected": detected,
            "multiple_faces": multiple,
            "face_count": count,
            "confidence": confidence,
            "event_type": event,
            "message": message,
        }


detector = FaceDetector()
