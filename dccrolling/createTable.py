# -*- coding: utf-8 -*-
import pymysql
import mysql_auth

login = mysql_auth.Info


#mysql 테이블 생성
conn = pymysql.connect(
    host=login['host'],
    user=login['user'],
    password=login['password'],
    db=login['db'],
    charset=login['charset']
)

sql = """CREATE TABLE whiskeyReview (
    id int(11),
    title VARCHAR(255),
    url VARCHAR(255),
    recom INT(11),
    reply INT(11),
    postDate DATE,
    PRIMARY KEY(id)
    )
"""
cursor = conn.cursor()
cursor.execute(sql)
conn.commit()
conn.close()
