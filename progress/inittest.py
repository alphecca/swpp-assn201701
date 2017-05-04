import json
import requests
import sys
from time import sleep
from random import randint

if len(sys.argv) != 2:
    print("inittest.py <url>")
    print("Example: initest.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

def create_users(N):
    ls = []
    for i in range(1, N):
        ls.append(("test{0}".format(i), "test{0}passwd".format(i)))
    return ls

def post_or_error_anon(link, data):
    sleep(0.05)
    try:
        res = requests.post(link, data=data)
        if res.status_code != 201:
            print("ERROR: Cannot post {0} : {1}".format(link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot post {0}".format(link))
        exit(1)

userN = 10
user_pairs = create_users(userN)

link = sys.argv[1] + "users/" # TODO If you want to change port of url, revise this.
print("1. Creating new users.")
try:
    for i in range(1,userN+1):
        username = "test{0}".format(i)
        pwd = "test{0}passwd".format(i)
        res = requests.delete(link, auth=(username, pwd))
except Exception:
    pass

for i in range(1,userN):
    body = {"username": "test{0}".format(i).encode("ascii"), "password": "test{0}passwd".format(i).encode("ascii")}
    post_or_error_anon(link, body)

print("INITIALIZE SUCCESSFUL")
