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
    for i in range(5):
         requests.delete(user_link, auth=("test{0}".format(i), "newtest{0}passwd".format(i)))
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

link = sys.argv[1] + "users/test1/friends/"
print("5. GET friend list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test2, test2pw)
get_json_or_error(link, test1, test1pw)
not_found_or_error(sys.argv[1] + "users/test4/friends/", test1, test1pw)

link = sys.argv[1] + "users/test1/addfriend/"
print("6. GET & POST add friend list.")
forbidden_or_error_anon("GET", link)
forbidden_or_error_anon_data("POST", link, {})
method_not_allowed_or_error_data("POST", link, {}, test1, test1pw)
post_or_error(link, {}, test2, test2pw)
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
if temp[0]["friend"] != test2:
    print("ERROR: the contents of addfriend does not match after POST!")
    exit(1)
temp = get_json_or_error(link, test1, test1pw)
if temp[0]["friend"] != test2 or len(temp) != 1:
    print("ERROR: the contents of addfriend does not match after POST!")
    exit(1)
link2 = sys.argv[1] + "users/test2/addfriend/"
temp = get_json_or_error(link2, test2, test2pw)
if len(temp) != 0:
    print("ERROR: the length of addfriend should be 0!")

post_or_error(link, {}, test3, test3pw)
temp = get_json_or_error(link, test3, test3pw)
if temp[0]["friend"] != test3 or len(temp) != 1:
    print("ERROR: a user should not GET other's addfriend request!")
    exit(1)
temp = get_json_or_error(link, test1, test1pw)
if len(temp) != 2 or temp[0]["friend"] != test2 or temp[1]["friend"] != test3:
    print("ERROR: a user should GET his(her) own addfriend request!")
    exit(1)
not_found_or_error(sys.argv[1] + "users/test4/addfriend/", test1, test1pw)

print("7. Check when two users become a friend.")
post_or_error(link2, {}, test1, test1pw)
method_not_allowed_or_error_data("POST", link2, {}, test1, test1pw)
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
if len(temp) != 0:
    print("ERROR: the addfriend request should be removed after two users became a friend!")
    exit(1)
temp = get_json_or_error(link2, test1, test1pw)
if len(temp) != 0:
    print("ERROR: the addfriend request should not be created when two users become a friend!")
    exit(1)

link = sys.argv[1] + "users/test1/friends/"
link2 = sys.argv[1] + "users/test2/friends/"
temp = get_json_or_error(link, test1, test1pw)
if len(temp) < 1 or temp[0]["friend"] != test2:
    print("ERROR: two users should become a friend!")
    exit(1)
temp = get_json_or_error(link2, test2, test2pw)
if len(temp) < 1 or temp[0]["friend"] != test1:
    print("ERROR: two users should become a friend!")
    exit(1)

link = sys.argv[1] + "users/test1/addfriend/test3/"
print("8. GET add friend detail.")
forbidden_or_error_anon("GET", link)
forbidden_or_error("GET", link, test2, test2pw)
get_json_or_error(link, test1, test1pw)
temp = get_json_or_error(link, test3, test3pw)
if temp["friend"] != test3:
    print("ERROR: the content of addfriend does not match!")
    exit(1)
not_found_or_error(sys.argv[1] + "users/test2/addfriend/test3/", test2, test2pw)

print("9. DELETE add friend detail.")
forbidden_or_error_anon("DELETE", link)
forbidden_or_error("DELETE", link, test2, test2pw)
delete_or_error(link, test1, test1pw)
not_found_or_error(link, test1, test1pw)
post_or_error(sys.argv[1] + "users/test1/addfriend/", {}, test3, test3pw)
delete_or_error(link, test3, test3pw)
not_found_or_error(link, test3, test3pw)

link = sys.argv[1] + "users/"
print("Final. Deleting all data that test has created.")
delete_or_error(link, test1, test1pw)
delete_or_error(link, test2, test2pw)
delete_or_error(link, test3, test3pw)

print("TEST SUCCESSFUL")

