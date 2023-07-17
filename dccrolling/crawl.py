# -*- coding: utf-8 -*-

import requests
from urllib import request
from bs4 import BeautifulSoup
from datetime import datetime,timedelta
import time
import pymysql
import mysql_auth
from sqlUpload import sqlUpload

login = mysql_auth.Info
#if 날짜 조건 안맞으면 page 값 +=1 해서 리턴
#inputDate = 'yyyy-mm-dd'

def crawlByPage(inputID,liquor,category):

    if(category=="other"):
        subject_str = "기타리기타리뷰"
    else:
        subject_str = "리뷰"

    # URL
    BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=" + liquor + "&page=" #술 종류와 page값이 비어있다.
    Domain_URL = "https://gall.dcinside.com"

    # 헤더 설정
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'},

    page = 1
    while True:
        # html
        response = requests.get(BASE_URL+str(page), headers=headers[0])
        soup = BeautifulSoup(response.content, 'html.parser')
        html_list = soup.find('tbody').find_all('tr')

        time.sleep(0.001)
        for i in html_list:
            #글번호
            id = int(i.find('td', class_='gall_num').text)
            #말머리
            subject = i.find('td', class_='gall_subject').text

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

            """
            # 조회 수 추출
            views_tag = i.find('td', class_='gall_count')
            view = views_tag.text
            """

            # 추천 수 추출
            recommend_tag = i.find('td', class_='gall_recommend')
            recom = recommend_tag.text

            # 댓글 수 추출

            try:
                reply_tag = i.span.string.text
                if reply_tag[0] =='[':
                    reply = reply_tag.replace('[','')
                    reply = reply.replace(']','')
                else:
                    reply = 0
                #작성자가 [blabla]일 경우 0으로 바꿈
                reply=int(reply)

            except:
                reply = 0


            #subject가 리뷰일때만 업로드
            if(subject==subject_str):
                sqlUpload(id,title,url,recom,reply,postDate,category)

            if id == inputID:
                return page    #return으로 반복문 탈출

            #숫자가 크다 = 나중 날짜를 의미
            # if(postDate<=inputID and subject != "공지"):
            #     return page

        page+=1

#cron을 이용해 1시간마다 업로드하기
#findLastID함수: 현재 mysql상에서 가장 최근 글의 id를 return 함 => 그 글 전까지 리뷰 업로드 하면 됨.
def findLastID(category):

    page = 1
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()
    sql = "select max(id) from " + category + "Review"
    cursor.execute(sql)
    lastID = cursor.fetchall()[0][0]
    conn.close()

    return lastID

#category = other, brandy, beer, whiskey
lastID = findLastID("whiskey")
crawlByPage(lastID,"whiskey","whiskey")
time.sleep(0.001)

lastID = findLastID("other")
crawlByPage(lastID,"whiskey","other")
time.sleep(0.001)

lastID = findLastID("beer")
crawlByPage(lastID,"beer","beer")
time.sleep(0.001)

lastID = findLastID("brandy")
crawlByPage(lastID,"brandy","brandy")
time.sleep(0.001)

#crawlByPage("2022-12-04","whiskey","whiskey")

