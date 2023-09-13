# -*- coding: utf-8 -*-
import json
import os
import pathlib

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/database"

#path = "/home/blanc/ReviewSearchVenv/src/whiskey/dccrolling/database"

with open(path+"/review_beer.json",encoding='utf8') as f1:
    data1 = json.load(f1)

with open(path+"/review_brandy.json",encoding='utf8') as f2:
    data2 = json.load(f2)

with open(path+"/review_other.json",encoding='utf8') as f3:
    data3 = json.load(f3)

with open(path+"/review_other_total.json", "w",encoding='utf8') as f:
    json.dump(data1+data2+data3, f, ensure_ascii=False)

f1.close()
f2.close()
f3.close()
f.close()
