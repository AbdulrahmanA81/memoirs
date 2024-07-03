from flask import Blueprint, request, jsonify
from database import get_db
from utils.s3_utils import upload_file_to_s3, delete_file_from_s3
from utils.rekognition_utils import compare_faces
from config import Config
from flask_cors import cross_origin
import traceback

bp = Blueprint('upload', __name__)

@bp.route('/upload_user_image', methods=['POST'])
@cross_origin()
def upload_user_image():
    try: 
        files = request.files.getlist('files')
        print(files)
        for file in files:
            s3_url = upload_file_to_s3(file, file.filename, Config.S3_BUCKET)
            print(s3_url)
            if s3_url:
                db = get_db()
                cursor = db.cursor()
                cursor.execute('INSERT INTO user_image (s3_url) VALUES (?)', (s3_url,))
                db.commit()
        label_images()
        return jsonify({'message': 'User image(s) uploaded successfully'}), 201
    except Exception as e:
        print(e)
        traceback.format_exc()
        return jsonify({'message': 'Failed to upload image'}), 400
 
@bp.route('/label_images', methods=['POST'])
@cross_origin()
def label_images():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM reference_image')
    reference_images = cursor.fetchall()
    cursor.execute('SELECT * FROM user_image WHERE label IS NULL')
    user_images = cursor.fetchall()
    
    for user_image in user_images:
        user_image_id = user_image['id']
        user_image_url = user_image['s3_url']
        matching_labels = []
        
        for reference_image in reference_images:
            reference_image_id = reference_image['id']
            reference_image_label = reference_image['label']
            reference_image_url = reference_image['s3_url']
            
            matches = compare_faces(reference_image_url, user_image_url)
            if matches:
                matching_labels.append(reference_image_label)
        cursor.execute('UPDATE user_image SET label = ?, reference_id = ? WHERE id = ?', 
                        (",".join(matching_labels), reference_image_id, user_image_id))
        db.commit()
                
    return jsonify({'message': 'Images labeled successfully'}), 200

def label_reference_image(reference_url):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM reference_image WHERE s3_url = ?', (reference_url,))
    reference_images = cursor.fetchall()
    cursor.execute('SELECT * FROM user_image')
    user_images = cursor.fetchall()
    
    for user_image in user_images:
        user_image_id = user_image['id']
        user_image_url = user_image['s3_url']
        matching_labels = user_image['label'].split(',')
        
        for reference_image in reference_images:
            reference_image_id = reference_image['id']
            reference_image_label = reference_image['label']
            reference_image_url = reference_image['s3_url']
            
            matches = compare_faces(reference_image_url, user_image_url)
            if matches and reference_image_label not in matching_labels:
                matching_labels.append(reference_image_label)
        cursor.execute('UPDATE user_image SET label = ?, reference_id = ? WHERE id = ?', 
                        (",".join(matching_labels), reference_image_id, user_image_id))
        db.commit()
                
    return jsonify({'message': 'Images labeled successfully'}), 200

@bp.route('/delete_reference_image', methods=['DELETE'])
@cross_origin()
def delete_reference_image():
    try:
        s3_url = request.json.get('s3_url')
        if not s3_url:
            return jsonify({'message': 's3_url is required'}), 400

        # Delete from S3
        filename = s3_url.split('/')[-1]
        bucket_name = Config.S3_BUCKET

        if delete_file_from_s3(filename, bucket_name):
            db = get_db()
            cursor = db.cursor()
            cursor.execute('SELECT label FROM reference_image WHERE s3_url = ?', (s3_url,))
            reference = cursor.fetchone()
            reference_label = reference['label'] if reference else None

            cursor.execute('DELETE FROM reference_image WHERE s3_url = ?', (s3_url,))
            db.commit()

            if reference_label:
                cursor.execute('SELECT id, label FROM user_image')
                user_images = cursor.fetchall()
                for user_image in user_images:
                    user_image_id = user_image['id']
                    labels = user_image['label'].split(',')
                    if reference_label in labels:
                        labels.remove(reference_label)
                        updated_label = ",".join(labels) if labels else None
                        cursor.execute('UPDATE user_image SET label = ? WHERE id = ?', (updated_label, user_image_id))
                db.commit()

            return jsonify({'message': 'Reference image deleted successfully'}), 200
        else:
            return jsonify({'message': 'Failed to delete image from S3'}), 400

    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'message': 'Failed to delete reference image'}), 500

@bp.route('/delete_album_image', methods=['DELETE'])
@cross_origin()
def delete_album_image():
    try:
        s3_url = request.json.get('s3_url')
        if not s3_url:
            return jsonify({'message': 's3_url is required'}), 400

        # Delete from S3
        filename = s3_url.split('/')[-1]
        bucket_name = Config.S3_BUCKET

        if delete_file_from_s3(filename, bucket_name):
            db = get_db()
            cursor = db.cursor()
            cursor.execute('DELETE FROM user_image WHERE s3_url = ?', (s3_url,))
            db.commit()
            return jsonify({'message': 'Album image deleted successfully'}), 200
        else:
            return jsonify({'message': 'Failed to delete image from S3'}), 400

    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'message': 'Failed to delete album image'}), 500