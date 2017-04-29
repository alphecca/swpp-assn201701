from django.test import TestCase
from django.contrib.auth.models import User
import json
import requests
from time import sleep
from random import randint

# Create your tests here.
def remove_user(username):
    try:
        user = User.objects.get(username = username)
        user.delete()
        print("\tDeleted user {0}".format(username))
    except User.DoesNotExist:
        pass
    return

for i in range(1, 10):
    username = "test{0}".format(i)
    remove_user(username)

print("--------------")

def create_users(N):
    ls = []
    for i in range(1, N):
        ls.append(("test{0}".format(i), "test{0}passwd".format(i)))
    return ls

newusers = create_users(10)
for (username, pwd) in newusers:
    user = User.objects.create_user(username, password=pwd)
    user.save()
    print("\tCreated user {0}".format(username))

print("Initialization Successful!")

def find_id(users_json, uname):
    for user_json in users_json:
        if user_json["username"] == uname:
            return user_json["id"]
    print("Cannot find user {0}!".format(uname))
    exit(1)

def find_userinfo(users, q_uid):
    for (uname, upwd, uid) in users:
        if uid == q_uid:
            return (uname, upwd)
    print("Cannot find user with id {0}!".format(q_uid))
    exit(1)

def get_json_or_error(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.get(link, auth=(uname, upwd))
        if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
        resjson = res.json()
        return resjson
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        exit(1)

def forbidden_or_error(method, link, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, auth=(uname, upwd))
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} : code {2}, id = {3}, pwd = {4}".format(method, link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def forbidden_or_error_anon(method, link):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} with no auth : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        exit(1)

def check_key(homepage_json, key):
    if key not in homepage_json:
        print("{0} not in {1}.".format((key, homepage_json)))
        exit(1)

userN = 10
user_pairs = create_users(userN)
unknownname = "unknown_user"
unknownpwd = "unknown_userpwd"

link = "http://wlxyzlw.iptime.org:8765/auth/"
print("1. Getting auth.")
forbidden_or_error_anon("GET", link)
forbidden_or_error("GET", link, unknownname, unknownpwd)
for (uname, upwd) in user_pairs:
    auth_json = get_json_or_error(link, uname, upwd)

print("TEST SUCCESSFUL")
