import os
import sys
import unittest
from unittest.mock import patch
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.rekognition_utils import detect_labels

image = 'car_street.jpg'
labels = detect_labels(image)
if labels:
	print(labels)
else:
	print("failed in detecting labels for the images")