FROM python:3.10.12-slim-buster
# run in container inner dir
WORKDIR /usr/src/app

# set envireonment variables -.pyc 파일을 생성하지 않도록 하고, 버퍼링없이 출력하게 함
ENV PYTHONDONTWRITEBYECODE 1
ENV PYTHONUNBUFFERED 1

# 현재 위치에 있는 requirements.txt만 먼저 복사
COPY requirements.txt /usr/src/app/

# dependencies 설치
RUN pip install --upgrade pip
RUN pip install -r /usr/src/app/requirements.txt

# 나머지 애플리케이션 파일 복사
COPY . /usr/src/app/

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "whiskey.wsgi:application"]
