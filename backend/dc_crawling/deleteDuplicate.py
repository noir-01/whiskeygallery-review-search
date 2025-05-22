import os
import sys
import pymysql
path = os.path.join(os.path.dirname(__file__), '..', 'auth')
sys.path.append(path)
import auth

mysql = auth.mysql

# MySQL 연결
conn = pymysql.connect(
    host=mysql["host"],
    user=mysql["user"],
    password=mysql["password"],
    db=mysql["db"],
    charset=mysql["charset"],
    cursorclass=pymysql.cursors.DictCursor
)

try:
    with conn.cursor() as cursor:
        # DELETE 쿼리 실행
        sql = """
        DELETE other_review 
        FROM other_review
        INNER JOIN whiskey_review ON other_review.id = whiskey_review.id
        WHERE other_review.category = 'other'
        """
        cursor.execute(sql)
    
    conn.commit()  # 변경사항 저장

finally:
    conn.close()