import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *

# TODO We should implement that "Final. Deleting all data that test has created." will always be executed even though the test ended with exit(1). 

if len(sys.argv) != 2:
    print("backend_friend_tests.py <url>")
    print("Example: backend_friend_tests.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

userN = 5
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
    if uname == "test1" or uname == "test2" or uname == "test3":
        continue
    delete_or_error(link, uname, upwd)

test1 = "test1"
test2 = "test2"
test3 = "test3"
test1pw = "test1passwd"
test2pw = "test2passwd"
test3pw = "test3passwd"

link = sys.argv[1] + "chatroom/"
print("5. GET & POST chatroom list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
forbidden_or_error_anon_data("POST", link, {"text": "anonymous user"})
bad_request_or_error_data("POST", link, {}, test1, test1pw)
bad_request_or_error_data("POST", link, {"room_name": ""}, test1, test1pw)
post_or_error(link, {"room_name": "test room1"}, test2, test2pw)
post_or_error(link, {"room_name": "test room2"}, test1, test1pw)

chatroom_list = get_json_or_error(link, test1, test1pw)
chatroom2id = chatroom_list[len(chatroom_list)-1]["id"]
chatroom1id = chatroom_list[len(chatroom_list)-2]["id"]

link = sys.argv[1] + "chatroom/" + str(chatroom1id) + "/"
print("6. GET & DELETE chatroom detail.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
# TODO if you add some features to chatting room, add test here.
if temp["room_name"] != "test room1":
    print("ERROR: the contents of chatroom does not match after POST!")
    exit(1)
get_json_or_error(link, test2, test2pw)

forbidden_or_error_anon("DELETE", link)
delete_or_error(link, test1, test1pw)
not_found_or_error(link, test2, test2pw)

link = sys.argv[1] + "users/"
print("Final. Deleting all data that test has created.")
delete_or_error(link, test1, test1pw)
delete_or_error(link, test2, test2pw)
delete_or_error(link, test3, test3pw)

print("TEST SUCCESSFUL")

