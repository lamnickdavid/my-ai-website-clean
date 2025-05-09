import sqlite3

conn = sqlite3.connect("app.db")
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type VARCHAR,
    amount FLOAT,
    desc VARCHAR,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')
conn.commit()
conn.close()
print("history 表创建成功！")