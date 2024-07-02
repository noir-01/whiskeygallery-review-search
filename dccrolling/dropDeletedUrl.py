import requests
from bs4 import BeautifulSoup
import mysql_auth
import pymysql
login = mysql_auth.Info
from multiprocessing import Pool,Manager, freeze_support

sql = "select id from whiskeyReview;"
conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
cursor = conn.cursor()
cursor.execute(sql)
rows = cursor.fetchall()

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'},
url ="https://gall.dcinside.com/mgallery/board/view/?id=whiskey&no="

def crawl(idList):
    for id in idList:
        response = requests.get(url+str(id),headers=headers[0])
        soup = BeautifulSoup(response.content, "html.parser")
        inside = soup.find('script').text
        if inside:
            print(id,inside)

if __name__ == '__main__':
    freeze_support()
    pool = Pool(processes=4)
    manager = Manager()
    pool.map(crawl, rows)
    #dataList = manager.list(rows)   #multiprocessing 위한 전역변수 리스트
    pool.close()