# -*- coding: utf8 -*-
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import sys
from main.sqlsearch import *
import pymysql
import json
import pandas as pd
import requests
import datetime
import pickle
import os
import pathlib

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
sys.path.append(str(parent_path)+"/module")
from Trie import Trie,Node


with open(str(parent_path)+"/module/wordTrie.pickle","rb") as f:
    trie = pickle.load(f)
    nameDict = pickle.load(f)

@csrf_exempt
def search(request):
    if request.method == 'GET':
        andWord =[]
        orWord = []
        for i in range(1,4):
            word = request.GET['aSearch'+str(i)]
            andWord.append(word) if word.strip()!='' else 1
            
            word = request.GET['oSearch'+str(i)]
            orWord.append(word) if word.strip()!='' else 1
        age = request.GET['age']
        nickname = request.GET['nickname']

        path = str(request.path)
        
        #path가 그냥 search면 isOther = False (그냥 리뷰 검색)
        if(path == "/search/"):
            #df = searchTitleInclude(andWord,orWord,age,isWhiskey)
            result = searchBySql([andWord,orWord,age,nickname,True])
        #기타 리뷰 검색
        else:
            result = searchBySql([andWord,orWord,age,nickname,False])

        # df = df.sort_values(by='5',ascending=False)
        # df.rename(columns={"0":"id","1":"title","2":"url",
        #                     "3":"recommend","4":"reply","5":"time"},inplace=True)
        # result = df.to_dict(orient='records')
        result.sort(key=lambda x:x['time'])    
        
        return JsonResponse(result,safe=False)

#트라이 이용 자동완성
def autocomplete(request):
    if request.method == 'GET':
        searchWord = request.GET['word']
        result_dict = {"result":[]}
        if trie.search(searchWord):
            result_with_freq = [(r,nameDict[r]) for r in trie.starts_with(searchWord)]
            result_with_freq.sort(key=lambda x:x[1],reverse=True)
            #결과 상위 5개까지만 반환
            result_without_freq = list(map(lambda x:x[0],result_with_freq[:5]))
            result_dict["result"] = result_without_freq

        return JsonResponse(result_dict,safe=False)