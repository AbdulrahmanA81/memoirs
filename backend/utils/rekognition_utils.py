import boto3
from config import Config

rekognition = boto3.client('rekognition',
                           aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                           aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                           region_name=Config.REGION_NAME)

def compare_faces(source_image, target_image):
    response = rekognition.compare_faces(
        SourceImage={'S3Object': {'Bucket': Config.S3_BUCKET, 'Name': source_image}},
        TargetImage={'S3Object': {'Bucket': Config.S3_BUCKET, 'Name': target_image}}
    )
    return response['FaceMatches']
