import sqlite3

def initialize_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reference_image (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        s3_url TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_image (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        s3_url TEXT NOT NULL,
        label TEXT,
        object_label TEXT
    )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    initialize_db()
