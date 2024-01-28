# -*- coding: utf-8 -*-
import pymysql
import mysql_auth
import json
import pandas as pd
login = mysql_auth.Info
import os
import pathlib
filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/dccrolling/database"

#mysql에 전달받은 데이터를 업로드.
#def sqlUpload(category, id,title,nickname,url,recom,reply,postDate):
def sqlUpload(dataList,category):
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )

    cursor = conn.cursor()

    #카테고리에 따라 다른 table을 사용함
    sql = "REPLACE INTO "

    if(category=="whiskey"):    
        sql = sql + "whiskeyReview" + """(id,title,nickname,recom,reply,postDate) 
                VALUES(%s,%s,%s,%s,%s,%s)"""
        cursor.executemany(sql,dataList[1:7])
    else:
        sql = sql + "otherReview" + """(category,id,title,nickname,recom,reply,postDate) 
                VALUES(%s,%s,%s,%s,%s,%s,%s)"""
        cursor.executemany(sql,dataList)

    #새 리뷰 업로드
    #cursor.execute(sql,({category},id,title,nickname,url,recom,reply,postDate))
    
    # #새 리뷰를 포함해서 json으로 저장
    # sql = "select * from " + tableName
    # cursor.execute(sql)
    # rows = cursor.fetchall()
    
    # data = pd.DataFrame.from_dict(rows)
    # datajson = data.to_json(orient='records',force_ascii=False)

    # path += /review_" + category + ".json"
    # with open(path , "w",encoding='utf8') as file:
    #     file.write(datajson)
    # file.close()
    
    conn.commit()
    conn.close()
