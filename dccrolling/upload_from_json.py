import json
import mysql_auth
import pymysql
from datetime import datetime

"""
{"0":164,"1":"크맥리) 님들은 안사먹을 오버톤 페일에일들",
"2":"https:\/\/gall.dcinside.com\/mgallery\/board\/view\/?id=beer&no=164&page=658",
"3":1, "4":3, "5":1614470400000}
"""

login = mysql_auth.Info

#서버 옮김, 기존의 json 파일로 mysql 업로드하기
def uploadFromJson(category):
    path = "/home/blanc/ReviewSearchVenv/src/whiskey/dccrolling/database/review_" + category + ".json"
    conn = pymysql.connect(
            host=login['host'],
            user=login['user'],
            password=login['password'],
            db=login['db'],
            charset=login['charset'])

    cursor = conn.cursor()

    sql = "Insert into " + category + "Review"
    sql = sql + """(id,title,url,recom,reply,postDate) VALUES(%s,%s,%s,%s,%s,%s)"""

    with open(path,"r",encoding='utf8') as file:
        review = json.load(file)

    for row in review:
        #시간 형식 변경 필요
        postDate = datetime.fromtimestamp(row['5']/1000) 
        cursor.execute(sql,(row['0'],row['1'],row['2'],row['3'],row['4'],postDate))
        conn.commit()
    
    file.close()
    conn.close()
    
uploadFromJson("other")
