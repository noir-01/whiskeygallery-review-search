# -*- coding: utf-8 -*-
import pymysql
import json
import pandas as pd
import os
import sys
import pathlib

path = os.path.join(os.path.dirname(__file__), '..', 'auth')
sys.path.append(path)
import mysql_auth
login = mysql_auth.Info

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/dc_crawling/database"

#mysql에 전달받은 데이터를 업로드.
#def sqlUpload(category, id,title,nickname,url,recom,reply,postDate):
def sqlUpload(dataList,category):
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset'],
        use_unicode=True
    )

    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")

    #카테고리에 따라 다른 table을 사용함
    sql = "REPLACE INTO "

    if(category=="whiskey"):    
        sql = sql + "whiskey_review" + """(id,title,nickname,recom,reply,post_date) 
                VALUES(%s,%s,%s,%s,%s,%s)"""
        cursor.executemany(sql,dataList)
    else:
        sql = sql + "other_review" + """(category,id,title,nickname,recom,reply,post_date) 
                VALUES(%s,%s,%s,%s,%s,%s,%s)"""
        cursor.executemany(sql,dataList)
    
    conn.commit()
    conn.close()
