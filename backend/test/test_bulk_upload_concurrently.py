import os
import sys
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.s3_utils import upload_files_to_s3_concurrently

# Sample files to upload
file_paths = ['kaido1.jpg', 'kaido2.jpg', 'kaido3.jpg']
files_with_names = []

for file_path in file_paths:
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist.")
    else:
        files_with_names.append((open(file_path, 'rb'), os.path.basename(file_path)))

# Perform bulk upload
bucket_name = 'memoirs-test'
urls = upload_files_to_s3_concurrently(files_with_names, bucket_name)

# Close the files
for file, _ in files_with_names:
    file.close()

# Print the results
for file_path, url in zip(file_paths, urls):
    if url:
        print(f"File {file_path} uploaded successfully. S3 URL: {url}")
    else:
        print(f"File {file_path} upload failed.")