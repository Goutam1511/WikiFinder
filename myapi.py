import requests as rq
import urllib
from flask import Flask, request
from flask import jsonify
from google import google
from flask_cors import CORS
from time import sleep

app = Flask(__name__)
CORS(app)
@app.route('/<query>',methods=['GET']) 
def get(query):
        parent1=[]
        parent2=[]
        p=[]
        result={}
        count=2
        title=query
        search=google.search(title+" wikipedia",1)
        title,x=search[0].name.split("-")
        if title[-1]==' ':
            title = title[:-1]
        t=str(title)
        title = title.replace(' ','_')
        title = urllib.quote(title,' ()')
        result["0"]=t
        parent1=function(title,query,3)
        for i in parent1:
                parent2=function(i,query,1)
                parent2=parent2[0].split(":")
                parent2=parent2[1]
                result[str(count)]=parent2
                count=count+1
        for i in parent1:
                i=i.split(":")
                i=i[1]
                p.append(i)
                result["1"]=p
        return jsonify(result)
            

def function(title,item,num):
    url1="http://en.wikipedia.org/w/api.php?action=parse&format=json&page="
    url1 = url1 + title
    response = rq.get(url1)
    data = response.json()
    pageid = str(data["parse"]["pageid"])
    url2 = "http://en.wikipedia.org/w/api.php?action=query&format=json&prop=categories&clshow=!hidden&cllimit=max&titles="
    url2 = url2 + title
    response = rq.get(url2)
    data = response.json()
    data = data["query"]["pages"][pageid]["categories"]
    list=[]
    dict={}
    pagescon = []
    index = {}
    parent=[]
    for v in data:
        list.append(v["title"])
        
    for i in list:
        url3 = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=categorymembers&cmlimit=max&cmtitle="+i+"&cmtype=page"
        response = rq.get(url3).json()
        sleep(0.5)
        subpages = response["query"]["categorymembers"]
        l = []
        for names in subpages:
            l.append(names["title"])
        dict[i] = l
        
    url4 = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srwhat=text&srlimit=max&srprop=wordcount&srsearch="+item

    response = rq.get(url4).json()
    data = response["query"]["search"]

    for p in data:
        pagescon.append(p["title"])
        
    for i in list:
        index[i] = 0
        
    for i in list:
        index[i] = len(set(dict[i]).intersection(pagescon))
        if len(dict[i])!=0:
            index[i] = float(index[i])/len(dict[i])
        else:
            index[i]=0

    count=0
    for key, value in sorted(index.iteritems(), key=lambda (k,v): (v,k),reverse=True):
        count=count+1
        if count<=int(num):
            parent.append(key)
        else:
            break
    return parent
                
if __name__ == '__main__':
     app.run(port=5002)
