import re
import pymysql
import mysql_auth
from urllib.parse import unquote
from datetime import datetime
login = mysql_auth.Info

# Define a regular expression pattern to extract relevant information from log entries
log_pattern = r'(\d+\.\d+\.\d+\.\d+) - - \[(.*?)\] "(.*?)" (\d+) \d+ ".*?" "(.*?)"'

# Connect to MySQL database
conn = pymysql.connect(
    host=login['host'],
    user=login['user'],
    password=login['password'],
    db=login['db'],
    charset=login['charset']
)

def parse_log_entry(log_entry):
    # Parse log entry using regular expression
    match = re.match(log_pattern, log_entry)
    if match:
        ip = match.group(1)
        date_str = match.group(2)
        date = datetime.strptime(date_str, '%d/%b/%Y:%H:%M:%S %z')
        request = match.group(3)
        status_code = int(match.group(4))
        
        # Extract search parameters from the request
        params = dict(re.findall(r'(\w+)=([^&]+)', request.split(' ')[1]))
        decoded_params = {key: unquote(value) for key, value in params.items()}
        
        return ip, date, status_code, decoded_params
    else:
        return None

def save_to_database(ip, date, status_code, params):
    with conn.cursor() as cursor:
        # Create or replace the record
        sql = """
        INSERT INTO searchLog (ip, searchDate, status_code, aSearch1, aSearch2, aSearch3, oSearch1, oSearch2, oSearch3, age, nickname)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (ip, date, status_code,
                             params.get('aSearch1', ''),
                             params.get('aSearch2', ''),
                             params.get('aSearch3', ''),
                             params.get('oSearch1', ''),
                             params.get('oSearch2', ''),
                             params.get('oSearch3', ''),
                             params.get('age', ''),
                             params.get('nickname', '')))
    conn.commit()

# Sample log entry
log_entry = '125.128.68.10 - - [21/Mar/2024:15:02:25 +0900] "GET /search/?aSearch1=%EC%95%94%EB%A3%BB&aSearch2=cs&aSearch3=&oSearch1=&oSearch2=&oSearch3=&age=&nickname= HTTP/1.1" 200 5748 "https://whiskeygallery-review.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"'

# Parse and save the log entry
parsed_entry = parse_log_entry(log_entry)
if parsed_entry:
    ip, date, status_code, params = parsed_entry
    save_to_database(ip, date, status_code, params)

# Close the database connection
conn.close()