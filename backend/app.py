from flask import Flask
from flask_cors import CORS
from database import get_db, close_db

app = Flask(__name__)
app.config['DATABASE'] = 'database.db'  # SQLite database file
CORS(app)

@app.teardown_appcontext
def close_db_context(e=None):
    close_db(e)

# Register blueprints
from routes import reference, upload, label
app.register_blueprint(reference.bp)
app.register_blueprint(upload.bp)
app.register_blueprint(label.bp)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
