from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)  # 요청 간격 (1~5초 랜덤)

    @task
    def load_test(self):
        self.client.get("/search/?aSearch1=드로낙&aSearch2=&aSearch3=&oSearch1=&oSearch2=&oSearch3=&age=&nickname=")