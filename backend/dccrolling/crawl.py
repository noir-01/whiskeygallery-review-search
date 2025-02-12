# -*- coding: utf-8 -*-
import requests
from urllib import request
from bs4 import BeautifulSoup
from datetime import datetime,timedelta
import time
import pymysql
from multiprocessing import Pool,Manager, freeze_support
import re
import os
import sys

path = os.path.join(os.path.dirname(__file__), '..', 'auth')
sys.path.append(path)
import mysql_auth

from sqlUpload import sqlUpload
updateIntervalDay = 4


login = mysql_auth.Info
#if 날짜 조건 안맞으면 page 값 +=1 해서 리턴
#inputDate = 'yyyy-mm-dd'

def crawlByPage(liquor,category):
    #dataList = multiprocessing 위한 list.
    global dataList

    subject_str_dict = {
        "other": "기타리기타리뷰",
        "whiskey": "리뷰📝",
        "beer": "리뷰",
        "brandy":"리뷰",
        "cock_tail":"리뷰",
        "rum" : "리뷰",
        "nuncestbibendum" : "술리뷰술리뷰🍸",
        "oaksusu" : "리뷰🌽"
    }
    subject_str = subject_str_dict[category]

    # URL
    BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=" + liquor + "&page=" #술 종류와 page값이 비어있다.  
    #BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=nuncestbibendum&sort_type=N&search_head=60&page="
    #BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=whiskey&sort_type=N&search_head=120&page="
    Domain_URL = "https://gall.dcinside.com"

    # 헤더 설정
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'},
    
    #유동닉 정규식 ex) ㅇㅇ(223.38)
    fluidNick = re.compile('.+\(\d{1,3}[.]\d{1,3}\)')

    page = 1
    while True:
        time.sleep(0.001)   #부하 막기 위해 time.sleep() 삽입.
        # html
        response = requests.get(BASE_URL+str(page), headers=headers[0])
        soup = BeautifulSoup(response.content, 'html.parser')
        try:
            html_list = soup.find('tbody').find_all('tr')
        except:
            print("response: ",response, '\n', soup.find('tbody'))
            return

        for i in html_list:
            #말머리
            subject = i.find('td', class_='gall_subject').text
            if subject=="공지" or subject=="설문" :
                continue

            # 제목
            title = i.find('a', href=True).text           

            #글번호
            id = int(i.find('td', class_='gall_num').text)
        
            #닉네임
            nickname = i.find('td',class_="gall_writer ub-writer").text.strip()

            if fluidNick.match(nickname) is not None:   #유동이면 아이피 무시하고 ㅇㅇ으로 바꾸기.
                nickname = 'ㅇㅇ'

            # 날짜 추출
            date_tag = i.find('td', class_='gall_date')
            date_dict = date_tag.attrs

            if len(date_dict) == 2:
                postDate = date_dict['title'][:10]
                postTime = date_dict['title'][11:]

            else:
                postDate =  date_tag.text

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
            if '/' in postDate:
                postDate_datetime = datetime.strptime(postDate,'%y/%m/%d')
            else:
                postDate_datetime = datetime.strptime(postDate,'%Y-%m-%d')

            if subject==subject_str:
                #공지글 수정의 경우 글 작성일이 예전 날짜일 수 있음. 같은 subject일 경우에만 날짜 비교 후 return
                if postDate_datetime < datetime.today() - timedelta(updateIntervalDay):
                    return
                
                print(postDate,id)
                if category!="whiskey":
                    dataList.append([category,id,title,nickname,recom,reply,postDate])
                else:
                    dataList.append([id,title,nickname,recom,reply,postDate])

            # if id <= lastID:
            #     return   #lastID 나오면 반복문 탈출
        page+=1

#findLastID함수: 현재 mysql상에서 가장 최근 글의 id를 return 함 => 그 글 전까지 리뷰 업로드 하면 됨.
def findLastID(category):
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()
    #3일 내의 리뷰 최신화
    if category=='whiskey':
        sql = "select min(id) from whiskeyReview where postDate >= DATE_FORMAT(date_sub(now(),interval 3 day), \'%Y-%m-%d\');"
        cursor.execute(sql)
        lastID = cursor.fetchall()[0][0]
        if lastID==None:
            cursor.execute("select max(id) from whiskeyReview")
            lastID = cursor.fetchall()[0][0]
    else:
        sql = "select min(id) from otherReview where category=\'%s\' and postDate >= DATE_FORMAT(date_sub(now(),interval 3 day), \'%%Y-%%m-%%d\');"%category
        cursor.execute(sql)
        lastID = cursor.fetchall()[0][0]
        if lastID==None:
            cursor.execute("select max(id) from otherReview where category=\'%s\'"%category)
            lastID = cursor.fetchall()[0][0]
    conn.close()

    return lastID

def crawl(category):
    global dataList
    #lastID = findLastID(category)
    #print("======== Last Uploaded ID (%s): %s ========"%(category, lastID))
    if category=="whiskey" or category=="other":
        crawlByPage("whiskey",category)
    else:
        crawlByPage(category, category)
    
    print("UPLOAD SQL (category = %s) "%category)
    sqlUpload(dataList,category)
    dataList=manager.list()  #dataList 초기화


if __name__ == '__main__':
    freeze_support()
    manager = Manager()
    dataList = manager.list()   #multiprocessing 위한 전역변수 리스트
    
    categoryList = ["whiskey","other", "brandy", "beer", "cock_tail", "rum", "nuncestbibendum"]
    #categoryList = ["nuncestbibendum"]
    for c in categoryList:
        crawl(c)
