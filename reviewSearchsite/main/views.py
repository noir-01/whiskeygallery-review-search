from django.shortcuts import render
from sqlsearch import *
import pymysql

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

        except:
            #에러 발생시 출력 멘트
            return render(request, 'main/notExist.html')

        #실행 성공시 검색결과 반환
        return render(request, 'main/parameter.html')
