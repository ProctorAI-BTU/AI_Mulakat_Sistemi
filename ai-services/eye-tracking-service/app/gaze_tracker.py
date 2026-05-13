"""Gaze tracking engine based on MediaPipe FaceMesh with OpenCV fallback."""

import logging
import time
from collections import defaultdict

import cv2
import numpy as np

from .utils import bgr_to_rgb, clamp, decode_base64_image, validate_image

logger = logging.getLogger(__name__)

try:
    from mediapipe.python.solutions import face_mesh as _mp_fm

    MEDIAPIPE_AVAILABLE = True
    logger.info("MediaPipe FaceMesh loaded.")
except Exception as exc:
    MEDIAPIPE_AVAILABLE = False
    logger.warning(f"MediaPipe could not be loaded ({exc}); Haar fallback is active.")

LEFT_IRIS = [474, 475, 476, 477]
RIGHT_IRIS = [469, 470, 471, 472]
LEFT_EYE_CORNERS = [33, 133]
RIGHT_EYE_CORNERS = [362, 263]
LEFT_EYE_TOP_BOT = [159, 145]
RIGHT_EYE_TOP_BOT = [386, 374]

_HAAR_FACE_XML = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
_HAAR_EYE_XML = cv2.data.haarcascades + "haarcascade_eye.xml"

GAZE_LEFT_THRESHOLD = 0.38
GAZE_RIGHT_THRESHOLD = 0.62
GAZE_UP_THRESHOLD = 0.35
GAZE_DOWN_THRESHOLD = 0.68


class GazeTracker:
    """Estimate whether a student is looking at the screen."""

    def __init__(self):
        self._mesh = None
        if MEDIAPIPE_AVAILABLE:
            try:
                self._mesh = _mp_fm.FaceMesh(
                    max_num_faces=1,
                    refine_landmarks=True,
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5,
                )
                logger.info("MediaPipe FaceMesh initialized.")
            except Exception as exc:
                logger.warning(f"FaceMesh could not initialize: {exc}")

        self._haar_face = cv2.CascadeClassifier(_HAAR_FACE_XML)
        self._haar_eye = cv2.CascadeClassifier(_HAAR_EYE_XML)
        if self._haar_face.empty() or self._haar_eye.empty():
            logger.warning("OpenCV Haar cascades could not be loaded.")

        self._away_start: dict[str, float] = {}
        self._away_total: dict[str, int] = defaultdict(int)

    def track(self, session_id: str, image_base64: str) -> dict:
        img = decode_base64_image(image_base64)
        if not validate_image(img):
            return self._away_result(session_id, "Image is invalid or could not be decoded.")

        if self._mesh is not None:
            result = self._run_mediapipe(img, session_id)
            if result is not None and result["gaze"] != "unknown":
                return result

        return self._run_haar(img, session_id)

    def _run_mediapipe(self, img: np.ndarray, session_id: str) -> dict | None:
        try:
            results = self._mesh.process(bgr_to_rgb(img))
        except Exception as exc:
            logger.warning(f"FaceMesh processing failed: {exc}")
            return None

        if not results.multi_face_landmarks:
            return self._away_result(session_id, "No face detected.")

        landmarks = results.multi_face_landmarks[0].landmark
        h, w = img.shape[:2]

        left_iris = self._iris_center(landmarks, LEFT_IRIS, w, h)
        right_iris = self._iris_center(landmarks, RIGHT_IRIS, w, h)
        if left_iris is None or right_iris is None:
            return self._away_result(session_id, "Iris landmarks could not be read.")

        gaze_x = self._iris_x_ratio(landmarks, left_iris, right_iris, w)
        gaze_y = self._iris_y_ratio(landmarks, left_iris, right_iris, h)
        direction = self._classify_gaze(gaze_x, gaze_y)
        is_away = direction != "screen"

        if is_away:
            self._mark_away(session_id)
        else:
            self._reset_away(session_id)

        return {
            "gaze": direction,
            "confidence": 0.9 if not is_away else 0.75,
            "duration_away_seconds": self._away_total[session_id],
            "event_type": "GAZE_AWAY" if is_away else "GAZE_OK",
            "message": f"gaze={direction} x={gaze_x:.2f} y={gaze_y:.2f}",
        }

    def _run_haar(self, img: np.ndarray, session_id: str) -> dict:
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self._haar_face.detectMultiScale(gray, 1.1, 5, minSize=(60, 60))
            if len(faces) == 0:
                return self._away_result(session_id, "No face detected by Haar.")

            x, y, w, h = faces[0]
            roi = gray[y : y + h, x : x + w]
            eyes = self._haar_eye.detectMultiScale(roi, 1.1, 5, minSize=(20, 20))

            if len(eyes) < 2:
                return self._away_result(session_id, "Eyes could not be detected by Haar.")

            centers = [(ex + ew // 2, ey + eh // 2) for ex, ey, ew, eh in eyes[:2]]
            avg_x = sum(c[0] for c in centers) / 2
            face_cx = w // 2
            offset = (avg_x - face_cx) / (w / 2)

            if offset < -0.2:
                direction = "left"
            elif offset > 0.2:
                direction = "right"
            else:
                direction = "screen"

            is_away = direction != "screen"
            if is_away:
                self._mark_away(session_id)
            else:
                self._reset_away(session_id)

            return {
                "gaze": direction,
                "confidence": 0.65,
                "duration_away_seconds": self._away_total[session_id],
                "event_type": "GAZE_AWAY" if is_away else "GAZE_OK",
                "message": f"gaze={direction} source=haar",
            }

        except Exception as exc:
            logger.error(f"Haar gaze tracking failed: {exc}")
            return self._away_result(session_id, f"Processing failed: {exc}")

    @staticmethod
    def _iris_center(landmarks, indices: list[int], w: int, h: int) -> tuple | None:
        try:
            pts = [(landmarks[i].x * w, landmarks[i].y * h) for i in indices]
            return (
                sum(p[0] for p in pts) / len(pts),
                sum(p[1] for p in pts) / len(pts),
            )
        except Exception:
            return None

    @staticmethod
    def _iris_x_ratio(landmarks, left_iris: tuple, right_iris: tuple, w: int) -> float:
        def ratio(cx, corners):
            left = landmarks[corners[0]].x * w
            right = landmarks[corners[1]].x * w
            span = abs(right - left)
            return clamp((cx - min(left, right)) / span) if span > 1 else 0.5

        return (
            ratio(left_iris[0], LEFT_EYE_CORNERS)
            + ratio(right_iris[0], RIGHT_EYE_CORNERS)
        ) / 2

    @staticmethod
    def _iris_y_ratio(landmarks, left_iris: tuple, right_iris: tuple, h: int) -> float:
        def ratio(cy, top_bottom):
            top = landmarks[top_bottom[0]].y * h
            bottom = landmarks[top_bottom[1]].y * h
            span = abs(bottom - top)
            return clamp((cy - min(top, bottom)) / span) if span > 1 else 0.5

        return (
            ratio(left_iris[1], LEFT_EYE_TOP_BOT)
            + ratio(right_iris[1], RIGHT_EYE_TOP_BOT)
        ) / 2

    @staticmethod
    def _classify_gaze(x: float, y: float) -> str:
        if x < GAZE_LEFT_THRESHOLD:
            return "left"
        if x > GAZE_RIGHT_THRESHOLD:
            return "right"
        if y < GAZE_UP_THRESHOLD:
            return "up"
        if y > GAZE_DOWN_THRESHOLD:
            return "down"
        return "screen"

    def _mark_away(self, session_id: str):
        if session_id not in self._away_start:
            self._away_start[session_id] = time.time()
        self._away_total[session_id] = int(time.time() - self._away_start[session_id])

    def _reset_away(self, session_id: str):
        self._away_start.pop(session_id, None)
        self._away_total[session_id] = 0

    def _away_result(self, session_id: str, message: str) -> dict:
        self._mark_away(session_id)
        return {
            "gaze": "unknown",
            "confidence": 0.0,
            "duration_away_seconds": self._away_total[session_id],
            "event_type": "GAZE_AWAY",
            "message": message,
        }


tracker = GazeTracker()
