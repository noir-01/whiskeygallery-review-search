import pymysql
import unicodedata
import pandas as pd
from datetime import datetime
import os
import pathlib
from auth import auty
login = auth.mysql

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/dc_crawling/database"

#paramList: [andWords,orWords,age,nickname,isWhiskey, ip]
def searchBySql(paramList):
    #먼저 paramList에 있는 따옴표를 제거함.
    for i in range(4):
        #andWords/orWords
        if i==0 or i==1:
            paramList[i] = [word.replace("'","''").replace("_","'_") for word in paramList[i]]
        #age/nickname
        elif i==2 or i==3:
            paramList[i] = paramList[i].replace("'","''").replace("_","'_")
            
    andWord,orWord,age,nickname,isWhiskey,ip = paramList[0],paramList[1],paramList[2],paramList[3],paramList[4],paramList[5]

    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()
    if isWhiskey:
        category = 'whiskey'
    else:
        category = 'other'
    
    selectClause = "id,title,recom,reply,nickname,postdate" if category=='whiskey' else "id,title,recom,reply,nickname,postdate,category"

    query = '''
        select %s
        from %sReview 
        where title like \'%%%s%%\' 
        '''%(selectClause,category,age)
    
    if nickname!='':    #닉네임 있을 경우에만 닉네임 쿼리에 넣어서 검색.
        query += " and nickname = \'%s\'" %(nickname)
    
    #andWord 추가
    for i, keyword in enumerate(andWord):
        query = query + " and title like \'%%%s%%\'" %keyword
    
    #orWord 추가
    for i, keyword in enumerate(orWord):
        if i==0:
            query = query + " and (title like \'%%%s%%\'" %keyword
        else:
            query = query + " or title like \'%%%s%%\'" %keyword
        if i==len(orWord)-1:
            query +=")"

    try:
        cursor.execute(query)
        result = cursor.fetchall()
        result_dict = []
        for r in result:
            if category=="other" and r[6]=="other": 
                category="whiskey"   #카테고리가 other 이면 whiskey로 바꾸기(위갤 기타리뷰)
            result_dict.append({
                "id"        : r[0],
                "title"     : r[1],
                "recommend" : r[2],
                "reply"     : r[3],
                "nickname"  : r[4],
                "time"      : r[5],
                "category"  : 'whiskey' if category=='whiskey' else r[6] 
            })
    except:
        result_dict = []

    def saveSearchWord(paramList):
        with conn.cursor() as cursor:
        # Create or replace the record
            sql = """
            INSERT INTO searchLog (searchTime, aSearch1, aSearch2, aSearch3, oSearch1, oSearch2, oSearch3, age, nickname, isWhiskey)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            andWord = paramList[0]+[None]*(3-len(paramList[0]))
            orWord = paramList[1]+[None]*(3-len(paramList[1]))
            cursor.execute(sql,
                (datetime.now(), andWord[0],andWord[1],andWord[2], orWord[0],orWord[1],orWord[2],
                age,nickname,isWhiskey))
            conn.commit()

    saveSearchWord(paramList)
    conn.close()

    return result_dict