import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    S3_BUCKET = os.getenv('S3_BUCKET', 'memoirs-test')
    REGION_NAME = os.getenv('REGION_NAME', 'us-east-1')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
