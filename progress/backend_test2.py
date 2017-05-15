import json
import requests
import sys
from time import sleep
from random import randint

if len(sys.argv) != 2:
    print("backend_tests.py <url>")
    print("Example: backend_tests.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

def create_users(N):
    ls = []
    for i in range(1, N):
        ls.append(("test{0}".format(i), "test{0}passwd".format(i)))
    return ls

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

def delete_or_error(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.delete(link, auth=(uname, upwd))
        if res.status_code != 204:
            print("ERROR: Cannot delete {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot delete {0}".format(link))
        exit(1)

def put_or_error(link, data, uname, upwd):
    sleep(0.05)
    try:
        res = requests.put(link, data=data, auth=(uname, upwd))
        if res.status_code != 200:
            print("ERROR: Cannot put {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
        resjson = res.json()
        return resjson
    except Exception:
        print("ERROR: Cannot put {0}".format(link))
        exit(1)

def post_or_error(link, data, uname, upwd):
    sleep(0.05)
    try:
        res = requests.post(link, data=data, auth=(uname, upwd))
        if res.status_code != 201:
            print("ERROR: Cannot post {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot post {0}".format(link))
        exit(1)

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

def not_found_or_error(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.get(link, auth=(uname, upwd))
        if res.status_code != 404:
            print("ERROR: Should not found {0} : code {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        exit(1)

def forbidden_or_error(method, link, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, auth=(uname, upwd))
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} : code {2}, id = {3}, pwd = {4}".format(method, link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def forbidden_or_error_data(method, link, data, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, data=data, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, data=data, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, data=data, auth=(uname, upwd))
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
        elif method == "DELETE":
            res = requests.delete(link)
        elif method == "POST":
            res = requests.post(link)
        elif method == "PUT":
            res = requests.put(link)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} with no auth : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def forbidden_or_error_anon_data(method, link, data):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data)
        elif method == "DELETE":
            res = requests.delete(link, data=data)
        elif method == "POST":
            res = requests.post(link, data=data)
        elif method == "PUT":
            res = requests.put(link, data=data)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} with no auth : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def method_not_allowed_or_error_data(method, link, data, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, data=data, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, data=data, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, data=data, auth=(uname, upwd))
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 405:
            print("ERROR: Should not be allowed to {0} {1} with duplicated username : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def method_not_allowed_or_error_anon_data(method, link, data):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data)
        elif method == "DELETE":
            res = requests.delete(link, data=data)
        elif method == "POST":
            res = requests.post(link, data=data)
        elif method == "PUT":
            res = requests.put(link, data=data)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 405:
            print("ERROR: Should not be allowed to {0} {1} with duplicated username : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def bad_request_or_error_data(method, link, data, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, data=data, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, data=data, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, data=data, auth=(uname, upwd))

        if res.status_code != 400:
            print("ERROR: Should not be allowed to {0} {1} with bad request : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def bad_request_or_error_anon_data(method, link, data):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data)
        elif method == "DELETE":
            res = requests.delete(link, data=data)
        elif method == "POST":
            res = requests.post(link, data=data)
        elif method == "PUT":
            res = requests.put(link, data=data)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 400:
            print("ERROR: Should not be allowed to {0} {1} with bad request : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)


def check_key(homepage_json, key):
    if key not in homepage_json:
        print("{0} not in {1}.".format((key, homepage_json)))
        exit(1)

userN = 10
user_pairs = create_users(userN)
unknownname = "unknown_user"
unknownpwd = "unknown_userpwd"


link = sys.argv[1] + "users/" # TODO If you want to change port of url, revise this.
print("0. Checking url. (If the program stops, quit with CONTROL-C.)")
forbidden_or_error_anon("GET", link) # Check if the url is valid.

print("1. Creating new users.")
try:
    for i in range(1,userN+1):
        username = "test{0}".format(i)
        pwd = "test{0}passwd".format(i)
        res = requests.delete(link, auth=(username, pwd))
except Exception:
    pass

for i in range(1,userN):
    username = "test{0}".format(i)
    password = "test{0}passwd".format(i)
    body = {"username": username.encode("ascii"), "password": password.encode("ascii")} #encoded
    post_or_error_anon(link, body)
    method_not_allowed_or_error_anon_data("POST", link, body)

body = {"username": "test{0}".format(userN).encode("ascii")} #encoded
bad_request_or_error_anon_data("POST", link, body)
body = {"username": "".encode("ascii"), "password": "test{0}passwd".format(userN).encode("ascii")} #encoded
bad_request_or_error_anon_data("POST", link, body)
body = {"username": "test{0}".encode("ascii"), "password": "".format(userN).encode("ascii")} #encoded
bad_request_or_error_anon_data("POST", link, body)
body = {"password": "test{0}passwd".format(userN).encode("ascii")} #encoded
bad_request_or_error_anon_data("POST", link, body)


link = sys.argv[1] + "auth/" # TODO If you want to change port of url, revise this.
print("2. Getting auth.")
forbidden_or_error_anon("GET", link)
forbidden_or_error("GET", link, unknownname, unknownpwd)
for (uname, upwd) in user_pairs:
    auth_json = get_json_or_error(link, uname, upwd)

link = sys.argv[1] + "users/" # TODO If you want to change port of url, revise this.
print("3. Getting users list.")
forbidden_or_error_anon("GET", link)
forbidden_or_error("GET", link, unknownname, unknownpwd)
for (uname, upwd) in user_pairs:
    auth_json = get_json_or_error(link, uname, upwd)

link = sys.argv[1] + "users/" # TODO If you want to change port of url, revise this.
print("4. Deleting users.")
forbidden_or_error_anon("DELETE", link)
forbidden_or_error("DELETE", link, unknownname, unknownpwd)
for (uname, upwd) in user_pairs:
    if uname == "test1" or uname == "test2":
        continue
    delete_or_error(link, uname, upwd)

test1 = "test1"
test2 = "test2"
test1pw = "test1passwd"
test2pw = "test2passwd"

link = sys.argv[1] + "chatroom/"
print("5. GET & POST chatroom list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
forbidden_or_error_anon_data("POST", link, {"text": "anonymous user"})
bad_request_or_error_data("POST", link, {}, test1, test1pw)
post_or_error(link, {"room_name": "test text1"}, test1, test1pw)
post_or_error(link, {"room_name": "test text2"}, test2, test2pw)

chatroom_list = get_json_or_error(link, test1, test1pw)
chatroom2id = chatroom_list[0]["id"]
chatroom1id = chatroom_list[1]["id"]

link = sys.argv[1] + "chatroom/" + str(chatroom1id) + "/"
print("6. GET DELETE chatroom detail.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
#if temp["owner"] != test1 or temp["text"] != "test text1":
#    print("ERROR: the contents of article does not match after POST!")
#    exit(1)
get_json_or_error(link, test2, test2pw)
#forbidden_or_error_anon_data("PUT", link, {"text": "anonymous user"})
#forbidden_or_error_data("PUT", link, {"text": "non-owner user"}, test2, test2pw)
#bad_request_or_error_data("PUT", link, {}, test1, test1pw)
#temp = put_or_error(link, {"text": "revised"}, test1, test1pw)
#if temp["text"] != "revised":
#    print("ERROR: the contents of article does not match after PUT!")
#    exit(1)
forbidden_or_error_anon("DELETE", link)
delete_or_error(link, test1, test1pw)
not_found_or_error(link, test1, test1pw)

link = sys.argv[1] + "chatroom/" + str(chatroom2id) + "/"

temp = get_json_or_error(link, test1, test1pw)
#if temp["owner"] != test2 or temp["text"] != "test text2":
#    print("ERROR: the contents of article does not match after POST!")
#    exit(1)

link += "text/"
print("7. GET & POST text.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
forbidden_or_error_anon_data("POST", link, {"text": "anonymous user"})
link = sys.argv[1] + "chatroom/" + str(chatroom2id) + "/user/"
print("8. GET & POST charuser.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
if len(temp) != 0:
    print("ERROR: the length of chatuser list should be 0!")
    exit(1)
forbidden_or_error_anon_data("POST", link, {})
post_or_error(link, {}, test1, test1pw)
method_not_allowed_or_error_data("POST", link, {}, test1, test1pw)
post_or_error(link, {}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
user2id = temp[len(temp)-1]["id"]
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)
method_not_allowed_or_error_data("POST", link, {}, test1, test1pw)
print("9. Checking inheritance of chat user_num.")
temp = get_json_or_error(sys.argv[1]+"chatroom/"+str(chatroom2id)+"/", test2, test2pw)
if temp["user_num"] != 2:
    print("ERROR!")
    exit(1)
#temp = get_json_or_error(sys.argv[1]+"chatroom/"+str(chatroom3id)+"/", test1, test1pw)
#if temp["text"] != "reply1":
#    print("ERROR: the contents of chatroom does not match after POST!")
#    exit(1)
if temp["user_num"] != 2:
    print("ERROR!")
    exit(1)
if temp["user_num"] != 2:
    print("ERROR!")
    exit(1)

link = sys.argv[1] + "chatuser/"
print("10. GET user list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)

link = sys.argv[1] + "users/"
print("Final. Deleting all data that test has created.")
delete_or_error(link, test1, test1pw)
delete_or_error(link, test2, test2pw)

print("TEST SUCCESSFUL")
