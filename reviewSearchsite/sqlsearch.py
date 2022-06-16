# -*- coding: utf-8 -*-
import pymysql
import unicodedata
import pandas as pd
import json

import sys
sys.path.append('/home/ubuntu/whiskyReview')
from dccrolling import mysql_auth
"""
#검색조건과 단어 개수에 따른 sql 실행문 작성
def searchTitleInclude2(searchState,age,wordList):
    login = mysql_auth.Info
    dictList=[]
    dictList_app=dictList.append    #속도개선
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )

    #결과를 dict 형식으로 return하기
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    #기본 sql (검색어 하나에 age 없음)
    sql = "SELECT * FROM ReviewTab WHERE title LIKE %s"
    result = []
    wordnum = len(wordList)

    #or 검색
    if searchState=='or':
        for word in wordList:
            if age!='':  #age 입력값이 있을 경우
                sql_age = sql + " and title LIKE %s"
                cursor.execute(sql_age,("%"+word+"%","%"+age+"%"))
                rows = cursor.fetchall()
                dictList_app(pd.DataFrame.from_dict(rows))

            else:       #age 없을 경우
                cursor.execute(sql,("%"+word+"%"))
                rows = cursor.fetchall()
                dictList_app(pd.DataFrame.from_dict(rows))
        #중복 제거 (or검색해서 나온 결과를 합친거라 결과가 겹칠 수 있음)
        
        if wordnum==1:
            result = dictList[0]
        elif wordnum==2:
            result = pd.concat([dictList[0],dictList[1]])
        elif wordnum==3:
            result = pd.concat([dictList[0],dictList[1],dictList[2]])

        conn.commit()
        conn.close()
        return result

    #And 검색
    else:
        if wordnum==1:
            cursor.execute(sql,("%"+wordList[0]+"%"))
        elif wordnum==2:
            sql = sql + " and title LIKE %s"
            cursor.execute(sql,("%"+wordList[0]+"%","%"+wordList[1]+"%"))
        elif wordnum==3:
            sql = sql + " and title LIKE %s" + " and title LIKE %s"
            cursor.execute(sql,("%"+wordList[0]+"%","%"+wordList[1]+"%","%"+wordList[1]+"%"))
        
        rows = cursor.fetchall()
        conn.commit()
        conn.close()
        result = pd.DataFrame.from_dict(rows)

        #age 존재할시 dictList에서 age 검색
        if age!='':
            age_df = result['title'].str.contains(age)
            result = result[age_df]
        return result

#DataFrame을 전달받아 html파일 생성하는 함수
def searchWord(df):
    df['title'] = '<a href=' + '"' + df['url'] + '"' +' target=_blank' +'><div>' + df['title'] + '</div></a>'
    df.pop('id')
    df.pop('url')
    df = df.sort_values(by='postDate',ascending=False)
    
    #dataFrame을 html table로 변환
    html = df.to_html( index=False, classes='stocktable', table_id='table1',escape=False)
    html = html.replace('class="dataframe ','class="')  # It always adds a dataframe class so this removes it
    
    with open("main/templates/main/parameter.html", "w") as file:
        file.write(html)
"""

#sql 계속 접속을 막기 위해 local file 이용
def searchTitleInclude(searchState,age,wordList):
    #단어들 검색 결과를 합치기 위해 dictList를 이용함
    dictList=[]
    dictList_app = dictList.append
    wordnum = len(wordList)

    with open('/home/ubuntu/whiskyReview/review.json', 'r',encoding='utf8') as f:
        json_data = json.load(f)

    dataframe = pd.json_normalize(json_data)

    #or 검색
    if searchState=='or':
        for word in wordList:
            if age!='':  #age 입력값이 있을 경우
                #pandas 검색기능 활용
                word_df = dataframe['1'].str.contains(age,case=False) & dataframe['1'].str.contains(word,case=False)
                dataframe = dataframe[word_df]
                dictList_app(pd.DataFrame.from_dict(dataframe))

            else:       #age 없을 경우
                word_df = dataframe['1'].str.contains(word,case=False)
                dataframe = dataframe[word_df]
                dictList_app(pd.DataFrame.from_dict(dataframe))

        #중복 제거 (or검색해서 나온 결과를 합친거라 결과가 겹칠 수 있음)
        if wordnum==1:
            result = dictList[0]
        elif wordnum==2:
            result = pd.concat([dictList[0],dictList[1]])
        elif wordnum==3:
            result = pd.concat([dictList[0],dictList[1],dictList[2]])

        return result

    #And 검색
    else:
        if wordnum==1:
            word_df = dataframe['1'].str.contains(wordList[0],case=False)
        elif wordnum==2:
            word_df = dataframe['1'].str.contains(wordList[0],case=False) & \
                    dataframe['1'].str.contains(wordList[1],case=False)
        elif wordnum==3:
            word_df = dataframe['1'].str.contains(wordList[0],case=False) & \
                    dataframe['1'].str.contains(wordList[1],case=False)& \
                    dataframe['1'].str.contains(wordList[2],case=False)

        result = dataframe[word_df]
        
        #age 존재할시 dictList에서 age 검색
        if age!='':
            age_df = result['1'].str.contains(age,case=False)
            result = result[age_df]
        
        return result
