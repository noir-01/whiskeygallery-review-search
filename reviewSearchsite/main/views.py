from django.shortcuts import render
from sqlsearch import *
import pymysql

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
from json2html import *
import requests
import datetime

# Create your views here.
def post_view(request):
    return render(request, 'main/post.html')

def get_post(request):
    if request.method == 'POST':
        aSearch1 = request.POST['aSearch1']
        aSearch2 = request.POST['aSearch2']
        aSearch3 = request.POST['aSearch3']

        oSearch1 = request.POST['oSearch1']
        oSearch2 = request.POST['oSearch2']
        oSearch3 = request.POST['oSearch3']

        age = request.POST['age']

        if oSearch1=='':
            wordList = [aSearch1,aSearch2,aSearch3]
            searchState = 'and'
        else:
            wordList = [oSearch1,oSearch2,oSearch3]
            searchState = 'or'
        
        for i in range(2,-1,-1):
            if wordList[i]=='':
                del wordList[i]
        try:
            df = searchTitleInclude(searchState,age,wordList)
            searchWord(df)
        
        except KeyError:
            #에러 발생시 출력 멘트
            return render(request, 'main/notExist.html')

        #실행 성공시 검색결과 반환
        return render(request, 'main/parameter.html')

@csrf_exempt
def api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        searchState = data['searchState']
        wordList = data['wordList']
        age = data['age']
        
        df = searchTitleInclude(searchState,age,wordList)
        result = df.to_json(orient='records',force_ascii=False)
        result = json.loads(result)

        return JsonResponse({"result":result},status=200)

##값 출력 과정 바꾸기 ":8000" -> ":8000/search" ->post-> ":8000/result"
@csrf_exempt
def search(request):
    if request.method == 'POST':
        aSearch1 = request.POST['aSearch1']
        aSearch2 = request.POST['aSearch2']
        aSearch3 = request.POST['aSearch3']

        oSearch1 = request.POST['oSearch1']
        oSearch2 = request.POST['oSearch2']
        oSearch3 = request.POST['oSearch3']

        age = request.POST['age']

        if oSearch1=='':
            wordList = [aSearch1,aSearch2,aSearch3]
            searchState = 'and'
        else:
            wordList = [oSearch1,oSearch2,oSearch3]
            searchState = 'or'
        
        for i in range(2,-1,-1):
            if wordList[i]=='':
                del wordList[i]
        
        df = searchTitleInclude(searchState,age,wordList)
        df = df.sort_values(by='5',ascending=False)
        result = df.to_dict(orient='records')

        for data in result:
            data['5'] = datetime.datetime.fromtimestamp(data['5']/1000).strftime("%Y-%m-%d")
        return render(request, 'main/parameter.html',{"result":result})
