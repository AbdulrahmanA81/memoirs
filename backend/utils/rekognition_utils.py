import boto3
from config import Config

rekognition = boto3.client('rekognition',
                           aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                           aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                           region_name=Config.REGION_NAME)

def compare_faces(source_image, target_image):
    response = rekognition.compare_faces(
        SourceImage={'S3Object': {'Bucket': Config.S3_BUCKET, 'Name': source_image.replace("https://memoirs-test.s3.amazonaws.com/", "")}},
        TargetImage={'S3Object': {'Bucket': Config.S3_BUCKET, 'Name': target_image.replace("https://memoirs-test.s3.amazonaws.com/", "")}}
    )
    return response['FaceMatches']

def detect_labels(image):
    response = rekognition.detect_labels(
        Image={'S3Object': {'Bucket': Config.S3_BUCKET, 'Name': image.replace("https://memoirs-test.s3.amazonaws.com/", "")}},
        MaxLabels=10,
        MinConfidence=75
    )
    return response['Labels']