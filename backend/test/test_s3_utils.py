import os
import sys
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.s3_utils import upload_file_to_s3

# Sample file to upload
file_path = 'kaido.jpg'
filename = 'kaido.jpg'

# Ensure the file exists
if not os.path.exists(file_path):
    print(f"File {file_path} does not exist.")
else:
    with open(file_path, 'rb') as file:
        s3_url = upload_file_to_s3(file, filename, 'memoirs-test')
        if s3_url:
            print(f"File uploaded successfully. S3 URL: {s3_url}")
        else:
            print("File upload failed.")
