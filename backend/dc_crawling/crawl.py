# -*- coding: utf-8 -*-
import requests
from urllib import request
from bs4 import BeautifulSoup
from datetime import datetime,timedelta
import time
import pymysql
import re
import os
import sys

#email
import smtplib
from email.mime.text import MIMEText

#selenium (searchHead 가져오기) 
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

path = os.path.join(os.path.dirname(__file__), '..', 'auth')
sys.path.append(path)
import auth

from sqlUpload import sqlUpload
login = auth.mysql

import tempfile
import uuid

user_data_dir = os.path.join(tempfile.gettempdir(), f'chrome-data-{uuid.uuid4()}')
os.makedirs(user_data_dir, exist_ok=True)

def getTotalPage(url):
    options = Options()
    options.add_argument('--headless=new')  # new headless mode
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument(f'--user-data-dir={user_data_dir}')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-dev-tools')
    options.add_argument('--no-zygote')
    options.add_argument('--single-process')

    service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=service, options=options)
    try:
        driver.get(url)
        # 페이지 로딩을 위한 충분한 시간 제공
        time.sleep(2)
        
        # 요소 찾기
        wait = WebDriverWait(driver, 10)
        total_page_element = wait.until(
            EC.presence_of_element_located((By.XPATH, "//span[@class='num total_page']"))
        )
        
        # 디버깅: 요소의 HTML 확인
        html_content = total_page_element.get_attribute('outerHTML')
        value = total_page_element.get_attribute('textContent')
        return int(value) if value else None
    except Exception as e:
        print(f"오류 발생: {e}")
        return None
    finally:
        driver.quit()
    
    try:
        import shutil
        shutil.rmtree(user_data_dir, ignore_errors=True)
    except:
        pass

def validateSearchHead(liquor, category):
    """
    Validates if the search_head value exists and contains the expected subject string
    Returns the valid search_head or None if validation fails
    """

    subject_str_dict = {
        "other": "기타리뷰",
        "whiskey": "리뷰",
        "beer": "리뷰",
        "brandy": "리뷰",
        "cock_tail": "리뷰",
        "rum": "리뷰",
        "nuncestbibendum": "술리뷰🍸",
        "oaksusu": "리뷰🌽"
    }
    
    expected_text = subject_str_dict.get(category)
    if not expected_text:
        sendErrorEmail(f"Invalid category: {category}")
        return None
    
    # Fetch the navigation menu
    try:
        options = Options()
        options.headless = True  # 브라우저 창을 띄우지 않음
        service = Service("/usr/bin/chromedriver")
        # 웹 드라이버 초기화
        driver = webdriver.Chrome(service=service,options=options)

        url = f"https://gall.dcinside.com/mgallery/board/lists/?id={liquor}"  # Replace with your actual base URL
        driver.get(url)
        time.sleep(3)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        for a in soup.select("ul li a"):
            onclick = a.get("onclick", "")
            if "listSearchHead(" in onclick:
                head_id = onclick.split("listSearchHead(")[-1].split(")")[0]
                label = a.text.strip()
                if label ==expected_text:
                    driver.quit()
                    print(int(head_id))
                    return int(head_id)

        sendErrorEmail(f"{liquor}갤 '{expected_text}' 없음")
        return None
        
    except Exception as e:
        sendErrorEmail(f"Error validating search_head: {str(e)}")
        return None

def sendErrorEmail(error_message):
    sender = auth.gmail["email"]
    recipient = auth.gmail["email"]
    subject = "크롤링 실패"
    
    msg = MIMEText(error_message)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    
    try:
        smtp_server = smtplib.SMTP('smtp.gmail.com', 587) 
        smtp_server.starttls()
        smtp_server.login(auth.gmail["email"], auth.gmail["pw"])
        smtp_server.send_message(msg)
        smtp_server.quit()
        print(f"Error email sent: {error_message}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")



def crawlByPage(liquor,category,dataList,findLastPage=False):

    search_head = validateSearchHead(liquor, category)
    if not search_head:
        print("Validation failed. Exiting.")
        return
    
    
    # 헤더 설정
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'},
    
    #유동닉 정규식 ex) ㅇㅇ(223.38)
    fluidNick = re.compile('.+\(\d{1,3}[.]\d{1,3}\)')

    batch_size = 1024
    BASE_URL = f"https://gall.dcinside.com/mgallery/board/lists/?id={liquor}&sort_type=N&search_head={search_head}"
    
    #함수 전달값에 따라 10페이지 vs 최대 페이지
    page = 1
    if findLastPage:
        max_pages = getTotalPage(BASE_URL)
    else:
        if liquor=='whiskey' and category=='whiskey':
            max_pages = 10
        else:
            max_pages = 3

    while page <= max_pages:
        time.sleep(0.03)   #부하 막기 위해 time.sleep() 삽입. 30ms
        # html
        URL = BASE_URL + f"&page={page}"
        response = requests.get(URL, headers=headers[0])
        soup = BeautifulSoup(response.content, 'html.parser')
        try:
            html_list = soup.find('tbody').find_all('tr')
        except:
            print("response: ",response, '\n', soup.find('tbody'))
            break

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

            print(page,id,category,title,nickname,recom,reply,postDate)

            if category!="whiskey":
                dataList.append([category,id,title.strip(),nickname,recom,reply,postDate])
            else:
                dataList.append([id,title,nickname,recom,reply,postDate])
            
            if len(dataList)>=batch_size:
                sqlUpload(dataList,category)
                dataList.clear()

        page+=1
    
    #마지막에 남은 데이터 업로드
    sqlUpload(dataList,category)


if __name__ == '__main__':    
    categoryList = ["whiskey","other", "brandy", "beer", "cock_tail", "rum", "nuncestbibendum"]
    #categoryList = ["whiskey"]

    for category in categoryList:
        dataList = []
        print("\nUPLOAD SQL (category = %s) "%category)
        if category=="whiskey" or category=="other":
            crawlByPage("whiskey",category,dataList)
            #crawlByPage("whiskey",category,dataList,True)
        else:
            crawlByPage(category, category,dataList)
            #crawlByPage(category, category,dataList,True)