FROM python:3.10.12-slim-buster
# run in container inner dir
WORKDIR /usr/src/app

# set envireonment variables -.pyc 파일을 생성하지 않도록 하고, 버퍼링없이 출력하게 함
ENV PYTHONDONTWRITEBYECODE 1
ENV PYTHONUNBUFFERED 1

# 현재 위치(Dockerfile이 있는 위치)에 있는 파일을 WORKDIR로 복사
COPY . /usr/src/app/

#install dependencies - requirements.txt에 나열된 라이브러리 설치
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "whiskey.wsgi:application"]
