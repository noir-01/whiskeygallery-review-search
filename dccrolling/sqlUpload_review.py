# -*- coding: utf-8 -*-
import pymysql
import mysql_auth

login = mysql_auth.Info

#mysql에 크롤링한 데이터를 올리는 함수
def sqlUpload(id,title,url,recom,reply,postDate):
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    """CREATE TABLE ReviewTab (
        id VARCHAR(255), 
        title VARCHAR(255),
        url VARCHAR(255),
        recom INT(11),
        reply INT(11),
        postDate DATE,
        )
    """
    cursor = conn.cursor()
    sql = """REPLACE INTO ReviewTab(id,title,url,recom,reply,postDate) 
             VALUES(%s,%s,%s,%s,%s,%s)
        """
    
    cursor.execute(sql,(id,title,url,recom,reply,postDate))

    conn.commit()
    conn.close()
