from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import sys
sys.path.append("/home/blanc/ReviewSearchVenv/src/whiskey")
from sqlsearch import *
import pymysql
import json
import pandas as pd
import requests
import datetime

# Create your views here.
def post_view(request):
    return render(request, 'main/post.html')

@csrf_exempt
def search(request):
    if request.method == 'GET':
        try:
            andWord =[]
            orWord = []
            for i in range(1,4):
                word = request.GET['aSearch'+str(i)]
                andWord.append(word) if word.strip()!='' else 1==1
                
                word = request.GET['oSearch'+str(i)]
                orWord.append(word) if word.strip()!='' else 1==1
            age = request.GET['age']
            
            if(len(andWord)==0 and len(orWord)==0 and age==''):
                return render(request,'main/post.html')
        except:
            return render(request,'main/post.html')

        path = str(request.path)
        
        #path가 그냥 search면 isOther = False
        if(path == "/search/"):
            df = searchTitleInclude(andWord,orWord,age,False)
        else:
            df = searchTitleInclude(andWord,orWord,age,True)

        df = df.sort_values(by='5',ascending=False)
        df.rename(columns={"0":"id","1":"title","2":"url",
                            "3":"recommend","4":"reply","5":"time"},inplace=True)
        result = df.to_dict(orient='records')

        return JsonResponse(result,safe=False)


    elif request.method=='POST':
        andWord =[]
        orWord = []
        for i in range(1,4):
            word = request.POST['aSearch'+str(i)]
            andWord.append(word) if word.strip()!='' else 1==1
            
            word = request.POST['oSearch'+str(i)]
            orWord.append(word) if word.strip()!='' else 1==1
        age = request.POST['age']
            

        path = str(request.path)
        
        #path가 그냥 search면 isOther = False
        if(path == "/search/"):
            df = searchTitleInclude(andWord,orWord,age,False)
        else:
            df = searchTitleInclude(andWord,orWord,age,True)

        df = df.sort_values(by='5',ascending=False)
        df.rename(columns={"0":"id","1":"title","2":"url",
                            "3":"recommend","4":"reply","5":"time"},inplace=True)
        result = df.to_dict(orient='records')

        return JsonResponse(result,safe=False)
        # for data in result:
        #     data['5'] = datetime.datetime.fromtimestamp(data['5']/1000).strftime("%Y-%m-%d")
            
        #return render(request, 'main/parameter.html',{"result":result})