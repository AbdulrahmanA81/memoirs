from openai import OpenAI
from flask import Blueprint, request, jsonify
from database import get_db
from config import Config
from flask_cors import cross_origin
import traceback

client = OpenAI(
    api_key=Config.OPENAI_API_KEY,
)

bp = Blueprint('ai_query', __name__)

@bp.route('/ai_query', methods=['POST'])
@cross_origin()
def ai_query():
    try:
        user_query = request.json.get('query')
        if not user_query:
            return jsonify({'message': 'Query is required'}), 400

        # Define the schema information
        schema_info = """
        The database has a table named 'user_image' with the following columns:
        - id: INTEGER
        - s3_url: TEXT
        - label: TEXT (comma-separated labels, e.g., 'Kate,William')
        - object_label: TEXT (comma-separated objects or scenery, e.g., 'Beach,Sea,Person')
        """

        # Use GPT-3.5 Turbo to transform the user query to an SQL query
        prompt = f"Transform the following natural language query into an SQL query for the described schema: '{user_query}'. Ensure the query is case-insensitive.\nSchema:\n{schema_info}"

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant that transforms natural language queries into SQL queries for SQLite3. Ensure the resulting query is case-insensitive. No newlines. Resulting rows must have all columns in table. Give only the SQL query as output, nothing else."},
                {"role": "user", "content": prompt}
            ]
        )
        sql_query = response.choices[0].message.content.strip()
        print("Executing SQL query:", sql_query)
        
        # Execute the SQL query on the user_image table
        db = get_db()
        cursor = db.cursor()
        cursor.execute(sql_query)
        rows = cursor.fetchall()

        # Prepare the image data
        images = [{'id': row['id'], 's3_url': row['s3_url'], 'label': row['label'], 'object_label': row['object_label']} for row in rows]
        num_images = len(images)

        # Use GPT-3.5 Turbo to generate a friendly message based on the results
        result_prompt = f"Generate a human-friendly response based on the following: The user asked: '{user_query}'. Number of images found: {num_images}."
        if num_images > 0:
            result_prompt += f" The images contain the labels: {', '.join(set([label for image in images for label in image['label'].split(',')]))} and objects: {', '.join(set([obj for image in images for obj in image['object_label'].split(',')]))}."
        else:
            result_prompt += " No images were found."

        result_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant that generates human-friendly responses based on query results."},
                {"role": "user", "content": result_prompt}
            ]
        )
        friendly_message = result_response.choices[0].message.content.strip()

        return jsonify({'message': friendly_message, 'images': images}), 200

    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'message': 'Failed to process query'}), 500
