from flask import Blueprint, request, jsonify
from database import get_db
from utils.s3_utils import upload_file_to_s3
from utils.rekognition_utils import compare_faces
from config import Config

bp = Blueprint('upload', __name__)

@bp.route('/upload_user_image', methods=['POST'])
def upload_user_image():
    try: 
        files = request.files.getlist('file')
        print(files, "\n\n\n")
        for file in files:
            s3_url = upload_file_to_s3(file, file.filename, Config.S3_BUCKET)
            print("here")
            print(s3_url)
            if s3_url:
                db = get_db()
                cursor = db.cursor()
                cursor.execute('INSERT INTO user_image (s3_url) VALUES (?)', (s3_url,))
                db.commit()
        return jsonify({'message': 'User image(s) uploaded successfully'}), 201
    except:
        return jsonify({'message': 'Failed to upload image'}), 400
 
@bp.route('/label_images', methods=['POST'])
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
        
        for reference_image in reference_images:
            reference_image_id = reference_image['id']
            reference_image_label = reference_image['label']
            reference_image_url = reference_image['s3_url']
            
            matches = compare_faces(reference_image_url, user_image_url)
            if matches:
                cursor.execute('UPDATE user_image SET label = ?, reference_id = ? WHERE id = ?', 
                               (reference_image_label, reference_image_id, user_image_id))
                db.commit()
                break
    return jsonify({'message': 'Images labeled successfully'}), 200
