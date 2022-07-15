# -*- coding: utf-8 -*-
import pymysql
import mysql_auth
import pandas as pd

login = mysql_auth.Info

conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset'])

cursor = conn.cursor()

sql = "select * from ReviewTab"
cursor.execute(sql)
rows = cursor.fetchall()
data = pd.DataFrame.from_dict(rows)
datajson = data.to_json(orient='records',force_ascii=False)

with open("review.json", "w",encoding='utf8') as file:
    file.write(datajson)

cursor.execute(sql)
conn.commit()
conn.close()

