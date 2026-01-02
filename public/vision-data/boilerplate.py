import os
import cv2

import numpy as np
import utils # Our image processing functions, inside utils.py

# Specify Video Filepath and Open
filename = 'lap_1.mp4'
video_path = os.path.join('source','__raw', filename)
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    raise RuntimeError(f"Could not open video: {video_path}")

#Approximate real-time playback by delaying frames
fps = cap.get(cv2.CAP_PROP_FPS)
print(f"Video FPS: {fps}")
delay_ms = int(1000 / fps) if fps and fps > 0 else 1

paused=False
title="Video"
cv2.namedWindow(title)
while cv2.getWindowProperty(title, cv2.WND_PROP_VISIBLE) >= 1:
    if not paused:
        ok, frame = cap.read()
        if not ok:
            break

        # [Detection Code Goes Here]

    # waitKey controls UI events + playback pacing
    key = cv2.waitKey(delay_ms) & 0xFF
    if key == ord('q') or key == 27:  # 'q' or ESC to quit
        break
    elif key == ord(' '):
        paused = not paused

cap.release()
cv2.destroyAllWindows()