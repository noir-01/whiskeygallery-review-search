# -*- coding: utf-8 -*-
import requests
from urllib import request
from bs4 import BeautifulSoup
from datetime import datetime,timedelta
import time
import pymysql
import mysql_auth
from multiprocessing import Pool,Manager, freeze_support
import re

from sqlUpload import sqlUpload

login = mysql_auth.Info
#if 날짜 조건 안맞으면 page 값 +=1 해서 리턴
#inputDate = 'yyyy-mm-dd'

def crawlByPage(inputID,liquor,category):
    global dataList

    subject_str_dict = {
        "other": "기타리기타리뷰",
        "whiskey": "리뷰📝",
        "beer": "리뷰",
        "brandy":"리뷰",
        "cock_tail":"리뷰"
    }
    subject_str = subject_str_dict[category]

    # URL
    #BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=" + liquor + "&page=" #술 종류와 page값이 비어있다.
    
    #리뷰탭만 빠르게
    BASE_URL = "https://gall.dcinside.com/mgallery/board/lists/?id=beer&sort_type=N&search_head=10&page="   
    Domain_URL = "https://gall.dcinside.com"

    # 헤더 설정
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'},
    
    #유동닉 정규식 ex) ㅇㅇ(223.38)
    fluidNick = re.compile('.+\(\d{1,3}[.]\d{1,3}\)')

    page = 1
    while True:
        #time.sleep(0.001)   #부하 막기 위해 time.sleep() 삽입.
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

            if subject!=subject_str:    #말머리 다르면 다음으로 넘어가기
                continue            

            #글번호
            id = int(i.find('td', class_='gall_num').text)
            # 제목
            title = i.find('a', href=True).text
            #닉네임
            nickname = i.find('td',class_="gall_writer ub-writer").text.strip()

            if fluidNick.match(nickname) is not None:   #유동이면 아이피 무시하고 ㅇㅇ으로 바꾸기.
                nickname = 'ㅇㅇ'

            #URL
            #url = Domain_URL + i.find('a',href=True)['href']

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

            #subject가 리뷰일때 업로드
            if(subject==subject_str):
                print(id)
                dataList.append([category,id,title,nickname,recom,reply,postDate])
                #sqlUpload(id,title,url,recom,reply,postDate,category)

            if id == inputID:
                return   #lastID 나오면 반복문 탈출

        page+=1

#cron을 이용해 주기적으로 업로드하기
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
    if category=='whiskey':
        sql = "select max(id) from whiskeyReview"
    else:
        sql = "select max(id) from otherReview where category=%s"%category
    cursor.execute(sql)
    lastID = cursor.fetchall()[0][0]
    conn.close()

    return lastID

def crawl(category):
    global dataList
    #lastID = findLastID(category)
    #print("Last Uploaded ID: ",lastID)
    if category=="whiskey" or category=="other":
        #crawlByPage(lastID,"whiskey",category)
        crawlByPage(7441,"whiskey",category)   #마지막 페이지까지 위해 
    else:
        crawlByPage(109, category, category)
    
    print("======== UPLOAD SQL ========")
    sqlUpload(dataList,category)
    dataList=manager.list()  #dataList 초기화


if __name__ == '__main__':
    freeze_support()
    manager = Manager()
    dataList = manager.list()   #multiprocessing 위한 전역변수 리스트
    crawl("beer")

# crawl("other")
# crawl("brandy")
# crawl("beer")
# crawl("cock_tail")
#category = other, brandy, beer, whiskey