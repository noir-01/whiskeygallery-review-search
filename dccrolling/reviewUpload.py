# -*- coding: utf-8 -*-

import requests
from urllib import request
from bs4 import BeautifulSoup
from datetime import datetime,timedelta
import schedule
import time
import pymysql

from sqlUpload_review import *

login = mysql_auth.Info

#if 날짜 조건 안맞으면 page 값 +=1 해서 리턴
#inputDate = 'yyyy-mm-dd'

def crawlByPage(page,inputID):
    # URL
    #BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=whiskey&page="   #page값이 비어있다.
    BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=whiskey&sort_type=N&search_head=20&page="
    Domain_URL = "https://gall.dcinside.com"

    # 헤더 설정
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'},

    # html
    response = requests.get(BASE_URL+str(page), headers=headers[0])
    soup = BeautifulSoup(response.content, 'html.parser')
    html_list = soup.find('tbody').find_all('tr')

    #공지사항 스킵
    announce = 0

    for i in html_list:
        announce += 1
        #공지사항 skip
        if announce<2:
            continue


        #글번호
        id = int(i.find('td', class_='gall_num').text)
        #말머리
        subject = i.find('td', class_='gall_subject').text

        if(subject!='리뷰'):
            continue

        # 제목
        title = i.find('a', href=True).text

        #URL
        url = Domain_URL + i.find('a',href=True)['href']

        # 날짜 추출
        date_tag = i.find('td', class_='gall_date')
        date_dict = date_tag.attrs

        if len(date_dict) == 2:
            postDate = date_dict['title'][:10]
            postTime = date_dict['title'][11:]

        else:
            postDate =  date_tag.text
            pass

        """
        # 조회 수 추출
        views_tag = i.find('td', class_='gall_count')
        view = views_tag.text
        """

        # 추천 수 추출
        recommend_tag = i.find('td', class_='gall_recommend')
        recom = recommend_tag.text

        # 댓글 수 추출
        reply_tag = i.span.string.text
        if reply_tag[0] =='[':
            reply = reply_tag.replace('[','')
            reply = reply.replace(']','')
        else:
            reply = 0

        try:
            #작성자가 [blabla]일 경우 0으로 바꿈
            reply=int(reply)
        except:
            reply = 0

        sqlUpload(id,title,url,recom,reply,postDate)

        #return = 0 or other
        if id == inputID:
            return 0    #0 return으로 반복문 탈출
        else:
            continue

# 1페이지부터 시작.
page = 1

#schedule을 사용해 매일 01시에 리뷰 업로드.
#findLastID함수: 현재 mysql상에서 가장 최근 글의 id를 return 함 => 그 글 전까지 리뷰 업로드 하면 됨.
def findLastID():
    page = 1
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()
    sql = "select max(id) from ReviewTab"
    cursor.execute(sql)
    lastID = cursor.fetchall()[0][0]
    return lastID

"""
while True:
    state = crawlByPage(page,295306)
    if(state==0):
        break
    else:
        page+=1
"""
def uploadByTime():
    page = 1
    lastID = findLastID()
    while True:
        state = crawlByPage(page,lastID)
        if(state==0):
            return
        else:
            page+=1

#schedule 대신 cronetab 사용
uploadByTime()

"""
schedule.every().day.at("01:00").do(uploadByTime)

while True:
    schedule.run_pending()
    time.sleep(3600)
"""
