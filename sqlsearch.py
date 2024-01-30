import pymysql
import unicodedata
import pandas as pd
import json
import os
import pathlib
from dccrolling.mysql_auth import Info as login

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/dccrolling/database"

#using in main/views.py
def searchTitleInclude(andWord,orWord,age,nickname,isOther):
    
    #어느 DB에서 검색할 것인지 isOther로 판단 : whiskey or not
    #일반 리뷰
    if(isOther == False):
        with open(path + '/review_whiskey.json', 'r',encoding='utf8') as f:
            json_data = json.load(f)
    #기타 리뷰
    else:
        with open(path + '/review_other_total.json', 'r',encoding='utf8') as f:
            json_data = json.load(f)

    dataframe = pd.json_normalize(json_data)

    #검색 로직
    #먼저 and 검색 수행: dataframe 복사본 만들어서
    age_df = dataframe['1'].str.contains(age)
    word_df = dataframe[age_df]

    for word in andWord:
        #pandas 검색기능 활용
        word_df = word_df[word_df['1'].str.contains(word,case=False)]
    
    #word_df에서 orList 내의 단어들을 각각 검색 후 합치기.
    orList =[]
    for word in orWord:
        or_df = word_df['1'].str.contains(word,case=False)
        orList.append(pd.DataFrame.from_dict(word_df[or_df]))

    #중복 제거 (or검색해서 나온 결과를 합친거라 결과가 겹칠 수 있음)
    wordnum = len(orList)

    if wordnum ==0:
        result = word_df

    if wordnum==1:
        result = orList[0]
    elif wordnum==2:
        result = pd.concat([orList[0],orList[1]])
    elif wordnum==3:
        result = pd.concat([orList[0],orList[1],orList[2]])
    return result

#paramList: [andWords,orWords,age,nickname,isWhiskey]
def searchBySql(paramList):
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()
    andWord,orWord,age,nickname,isWhiskey = paramList[0],paramList[1],paramList[2],paramList[3],paramList[4]
    if isWhiskey:
        category = 'whiskey'
    else:
        category = 'other'

    for _ in range(3-len(andWord)):
        andWord.append('')
    for _ in range(3-len(orWord)):
        orWord.append('')
    
    selectClause = "id,title,recom,reply,nickname,postdate" if category=='whiskey' else "id,title,recom,reply,nickname,postdate,category"

    query = '''
    select %s
    from %sReview 
    where title like \'%%%s%%\' and title like \'%%%s%%\' and title like \'%%%s%%\' and 
    (title like \'%%%s%%\' or title like \'%%%s%%\' or title like \'%%%s%%\') and
    title like \'%%%s%%\' and nickname like \'%%%s%%\'

    '''%(selectClause,category,
         andWord[0],andWord[1],andWord[2],
         orWord[0],orWord[1],orWord[2],
         age, nickname
         )
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
    conn.close()
    return result_dict

# paramList = [['드로낙','21',''],['','',''],'','','whiskey']
# searchBySql(paramList)