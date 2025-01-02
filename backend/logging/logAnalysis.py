# -*- coding: UTF-8 -*-
import pymysql
from mysql_auth import Info as login

searchOption = {
    "12h":"12 HOUR",
    "day":"1 DAY",
    "week":"7 DAY",
    "month":"30 DAY"
}

def findMostSearchedWord(time):
    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()

    #아예 db를 몽땅 가져와서, {"name" : {"age":n}} 형식으로 저장?
    query = """
    SELECT value, COUNT(*) AS frequency
    FROM (
        SELECT aSearch1 AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
        UNION ALL

        SELECT aSearch2 AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
        UNION ALL

        SELECT aSearch3 AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
        UNION ALL

        SELECT oSearch1 AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
        UNION ALL

        SELECT oSearch2 AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
        UNION ALL

        SELECT oSearch3 AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
        UNION ALL

        SELECT age AS value FROM searchLog
        WHERE searchTime >= DATE_SUB(NOW(), INTERVAL {})
    ) AS combined_values
    WHERE value IS NOT NULL AND value != ''
    GROUP BY value
    ORDER BY frequency DESC
    LIMIT 10;
    """.format(time,time,time,time,time,time,time)

    #한정된 input만을 dict로부터 받아오므로 injection은 생각할 필요 x.
    cursor.execute(query)
    rows = cursor.fetchall()
    
    for row in rows:
        print(row)
    conn.close()

def dictInsert(dict,str,opt=None):
    if str in dict:
        if opt in dict[str]:
            dict[str][opt] +=1
        else:
            dict[str][opt] = 1
    else:
        dict[str] = {opt : 1}

def findMostSearchedConCatWord(isWhiskey,timeInterval):
    result = {}

    conn = pymysql.connect(
        host=login['host'],
        user=login['user'],
        password=login['password'],
        db=login['db'],
        charset=login['charset']
    )
    cursor = conn.cursor()
    query = """
    select aSearch1,aSearch2,aSearch3,oSearch1,oSearch2,oSearch3,age,searchTime 
    from searchLog 
    where isWhiskey={} and searchTime >= DATE_SUB(NOW(), INTERVAL {})""".format(isWhiskey,timeInterval)

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    
    tot_freq = {}
    for r in rows:
        a1,a2,a3,o1,o2,o3,age,time = r
        #단순 나타난 횟수
        for item in r[:7]:
            if not item:
                continue
            if item in tot_freq:
                tot_freq[item] +=1
            else:
                tot_freq[item] = 1

        #검색어에 age만
        if not a1 and not a2 and not a3 and not o1 and not o2 and not o3 and age:
            dictInsert(result,age)
        # and + age => and[age], and[age], and[age]
        if age.isdigit() and a1:
            if a1: dictInsert(result,a1,age)
        #a1 + a2 => a1[a2]
        elif a1 and a2:
            dictInsert(result,a1,a2)
        #a1 + (o1/o2/o3): a1[o1], a1[o2], a1[o3]
        elif a1 and (o1 or o2 or o3):
            if o1: dictInsert(result,a1,o1)
            if o2: dictInsert(result,a1,o2)
            if o3: dictInsert(result,a1,o3)
            
    indiv_freq = {}
    for key, inner_dict in result.items():
        for inner_key in inner_dict:
            if inner_dict[inner_key] > 2:
                if inner_key: new_key = key + ' ' + inner_key
                else: new_key = key
                indiv_freq[new_key] = inner_dict[inner_key]
    
    indiv_freq = sorted(indiv_freq.items(), key=lambda x: x[1], reverse=True)
    tot_freq = sorted(tot_freq.items(), key=lambda x: x[1], reverse=True)
    
    
    cnt = 0
    number = []
    for name,times in tot_freq:
        if name.isdigit():
            number.append((name,times))
        else:
            print(name,times)
            cnt+=1
        if cnt==10: break
    print(number)

    print("========================================================")
    print(indiv_freq[:5])
    print(indiv_freq[5:10])

print("DAY")
#findMostSearchedWord(searchOption["day"])
findMostSearchedConCatWord(True,searchOption["day"])

print("\nWEEK")
#findMostSearchedWord(searchOption["week"])
findMostSearchedConCatWord(True,searchOption["week"])

print("\nMONTH")
#findMostSearchedWord(searchOption["month"])
findMostSearchedConCatWord(True,searchOption["month"])