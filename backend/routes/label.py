from flask import Blueprint, jsonify
from database import get_db

bp = Blueprint('label', __name__)

@bp.route('/get_album_images', methods=['GET'])
def get_album_images():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user_image WHERE label IS NOT NULL')
    images = cursor.fetchall()
    result = [{'s3_url': img['s3_url'], 'label': img['label']} for img in images]
    return jsonify(result), 200

@bp.route('/get_reference_images', methods=['GET'])
def get_reference_images():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM reference_image')
    images = cursor.fetchall()
    result = [{'s3_url': img['s3_url'], 'label': img['label']} for img in images]
    return jsonify(result), 200

