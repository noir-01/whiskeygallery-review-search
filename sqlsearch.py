import pymysql
import unicodedata
import pandas as pd
import json
import os
import pathlib

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/dccrolling/database"

#using in main/views.py
def searchTitleInclude(andWord,orWord,age,isOther):
    
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

#DataFrame을 전달받아 html파일 생성하는 함수
def searchWord(df):
    df['1'] = '<a href=' + '"' + df['url'] + '"' +' target=_blank' +'><div>' + df['title'] + '</div></a>'
    #id와 url은 필요없는 정보
    df.pop('id')
    df.pop('url')
    #정렬
    df = df.sort_values(by='postDate',ascending=False)

    #dataFrame을 html table로 변환
    html = df.to_html( index=False, classes='stocktable', table_id='table1',escape=False)
    html = html.replace('class="dataframe ','class="')  # It always adds a dataframe class so this removes it

    with open("main/templates/main/parameter.html", "w",encoding='utf8') as file:
        file.write(html)
