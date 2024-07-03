from flask import Blueprint, request, jsonify
from database import get_db
from utils.s3_utils import upload_file_to_s3
from config import Config
from flask_cors import cross_origin

bp = Blueprint('reference', __name__)

@bp.route('/upload_reference', methods=['POST'])
@cross_origin()
def upload_reference():
    
    file = request.files['file']
    label = request.form['label']
    
    s3_url = upload_file_to_s3(file, file.filename, Config.S3_BUCKET)
    
    if s3_url:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('INSERT INTO reference_image (label, s3_url) VALUES (?, ?)', (label, s3_url))
        db.commit()
        return jsonify({'message': 'Reference image uploaded successfully'}), 201
    return jsonify({'message': 'Failed to upload image'}), 400
