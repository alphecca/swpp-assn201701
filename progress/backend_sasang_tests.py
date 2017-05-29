import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *
print("wuel cam tu deo sasang geonjueng tesuetue")
if len(sys.argv) != 2:
    print("backend_article_tests.py <url>")
    print("Example: backend_article_tests.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

userN = 4
user_pairs = create_users(userN)
unknownname = "unknown_user"
unknownpwd = "unknown_userpwd"

link = sys.argv[1] + "users/" # TODO If you want to change port of url, revise this.
print("0. Checking url. (If the program stops, quit with CONTROL-C.)")
forbidden_or_error_anon("GET", link) # Check if the url is valid.

print("1. Creating new users.")
try:
    for i in range(1,userN):
        username = "test{0}".format(i)
        pwd = "1"
        res = requests.delete(link, auth=(username, pwd))
except Exception:
    pass

for i in range(1,userN):
    username = "test{0}".format(i)
    password = "1"
    body = {"username": username.encode("ascii"), "password": password.encode("ascii")} #encoded
    post_or_error_anon(link, body)

print("2. start sasang")
link = sys.argv[1] + "users/"
post_or_error(link+"test2/sasang/",{},"test1","1")
bad_request_or_error_data("POST",link+"test2/sasang/",{},"test1","1")
bad_request_or_error_data("POST",link+"test1/sasang/",{},"test1","1")
bad_request_or_error_data("POST",link+"test2/sasang/",{},"test2","1")
bad_request_or_error_data("POST",link+"test1/sasang/",{},"test2","1")
temp1=get_json_or_error(link+"test1/sasang/","test2","1")
temp2=get_json_or_error(link+"test2/sasang/","test1","1")
try:
    assert temp1[0]['first']=='test2'
    assert temp2[0]['first']=='test2'
    assert temp1[0]['second']=='test1'
    assert temp2[0]['second']=='test1'
    assert temp1[0]['counter']==1
    assert temp2[0]['counter']==1
except:
    print("ddokbaro hara post")
    exit(1)
print("3. jugo badgi test")
temp = put_or_error(link+'test1/sasang/',{},"test2", "1")

try:
    assert temp['first']=='test1'
    assert temp['second']=='test2'
    assert temp['counter']==2
except:
    print("ddokbaro hara put")
    exit(1)
bad_request_or_error_data("PUT",link+"test1/sasang/",{},"test2","1")
temp = put_or_error(link+'test2/sasang/',{},"test1", "1")
try:
    assert temp['first']=='test2'
    assert temp['second']=='test1'
    assert temp['counter']==3
except:
    print("ddokbaro hara put")
    exit(1)
print("4. bokjahan tesuetue")
post_or_error(link+"test3/sasang/",{},"test1","1")
temp=get_json_or_error(link+"test1/sasang/","test1","1")
temp1=get_json_or_error(link+"test1/sasang/","test2","1")
temp2=get_json_or_error(link+"test1/sasang/","test3","1")
try:
    assert len(temp)==2 and len(temp1)==1 and len(temp2)==1
    assert temp1[0]['first']=='test2'
    assert temp1[0]['second']=='test1'
    assert temp1[0]['counter']==3
    assert temp2[0]['first']=='test3'
    assert temp2[0]['second']=='test1'
    assert temp2[0]['counter']==1
except:
    print("ddokbaro hara geomto")
    exit(1)
print("-END-")
