# -*- coding:utf-8 -*-
from collections import Counter
import json
import re
import pickle
from Trie import Trie
import os
import pathlib

filePath = os.path.abspath(__file__)
parent_path = pathlib.Path(filePath).parent
path = str(parent_path) + "/dccrolling/database/"

with open(path+"review_whiskey.json","r",encoding='utf8') as f:
    json_data = json.load(f)

nameList = []
for j in json_data:
    words = re.split(r'[ /,\'\"()\[\]-]',j["1"])
    for word in words:
        if word:
            nameList.append(word)
trie = Trie()

nameDict = dict(Counter(nameList))
nameList = sorted(nameDict.items(),key=lambda x:x[1],reverse=True)
for name in nameList:
    trie.insert(name[0])

with open("wordTrie.pickle","wb") as f:
    pickle.dump(trie,f)
    pickle.dump(nameDict,f)