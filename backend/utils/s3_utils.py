import boto3
import mimetypes
from concurrent.futures import ThreadPoolExecutor
from config import Config

s3 = boto3.client('s3',
                  aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                  aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                  region_name=Config.REGION_NAME)

def upload_file_to_s3(file, filename, bucket_name):
    try:
        content_type, _ = mimetypes.guess_type(filename)
        if content_type is None:
            content_type = 'application/octet-stream'

        s3.upload_fileobj(
            file,
            bucket_name,
            filename,
            ExtraArgs={
                "ContentType": content_type
            }
        )
        return f"https://{bucket_name}.s3.amazonaws.com/{filename}"
    except Exception as e:
        print("Something Happened: ", e)
        return None

def upload_single_file(file, filename, bucket_name):
    content_type, _ = mimetypes.guess_type(filename)
    if content_type is None:
        content_type = 'application/octet-stream'

    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            filename,
            ExtraArgs={
                "ContentType": content_type
            }
        )
        return f"https://{bucket_name}.s3.amazonaws.com/{filename}"
    except Exception as e:
        print(f"Something Happened with file {filename}: ", e)
        return None

def upload_files_to_s3_concurrently(files_with_names, bucket_name):
    urls = []
    with ThreadPoolExecutor() as executor:
        futures = []
        for file, filename in files_with_names:
            futures.append(executor.submit(upload_single_file, file, filename, bucket_name))
        
        for future in futures:
            urls.append(future.result())
    
    return urls
