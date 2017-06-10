import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *

if len(sys.argv) != 2:
    print("backend_article_tests.py <url>")
    print("Example: backend_article_tests.py http://wlxyzlw.iptime.org:8000/")
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
body = {"username":"s"*3,"password": "very short".encode("ascii")} #encoded
bad_request_or_error_anon_data("POST", link, body)
body = {"username":"l"*22,"password": "very long".encode("ascii")} #encoded
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

link = sys.argv[1] + "article/"
print("5. GET & POST article list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
forbidden_or_error_anon_data("POST", link, {"text": "anonymous user"})
bad_request_or_error_data("POST", link, {}, test1, test1pw)
post_or_error(link, {"text": "test text1"}, test1, test1pw)
post_or_error(link, {"text": "test text2"}, test2, test2pw)

article_list = get_json_or_error(link, test1, test1pw)
article2id = article_list[0]["id"]
article1id = article_list[1]["id"]

link = sys.argv[1] + "article/" + str(article1id) + "/"
print("6. GET & PUT & DELETE article detail.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
if temp["owner"] != test1 or temp["text"] != "test text1":
    print("ERROR: the contents of article does not match after POST!")
    exit(1)
if temp["depth"]!=0:
    print("ERROR: depth does not match after POST!")
    exit(1)
get_json_or_error(link, test2, test2pw)
forbidden_or_error_anon_data("PUT", link, {"text": "anonymous user"})
forbidden_or_error_data("PUT", link, {"text": "non-owner user"}, test2, test2pw)
bad_request_or_error_data("PUT", link, {}, test1, test1pw)
temp = put_or_error(link, {"text": "revised"}, test1, test1pw)
if temp["text"] != "revised":
    print("ERROR: the contents of article does not match after PUT!")
    exit(1)
if temp["depth"]!=0:
    print("ERROR: depth does not match after PUT!")
    exit(1)

forbidden_or_error_anon("DELETE", link)
forbidden_or_error("DELETE", link, test2, test2pw)
delete_or_error(link, test1, test1pw)
not_found_or_error(link, test1, test1pw)

link = sys.argv[1] + "article/" + str(article2id) + "/"
temp = get_json_or_error(link, test1, test1pw)
if temp["owner"] != test2 or temp["text"] != "test text2":
    print("ERROR: the contents of article does not match after POST!")
    exit(1)
if temp["depth"]!=0:
    print("ERROR: depth does not match after POST!")
    exit(1)

link += "article/"
print("7. GET & POST article article(reply).")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
forbidden_or_error_anon_data("POST", link, {"text": "anonymous user"})
post_or_error(link, {"text": "reply1"}, test1, test1pw)
temp = get_json_or_error(link, test1, test1pw)
article3id = temp[0]["id"]
if temp[0]["depth"]!=1:
    print("ERROR: depth does not match after reply!")
    exit(1)
post_or_error(link, {"text": "reply2"}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
if temp[0]["depth"]!=1:
    print("ERROR: depth does not match after reply!")
    print(temp[0]["depth"])
    exit(1)

link = sys.argv[1] + "article/" + str(article2id) + "/like/"
print("8. GET & POST like.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
if len(temp) != 0:
    print("ERROR: the length of like list should be 0!")
    exit(1)
forbidden_or_error_anon_data("POST", link, {})
post_or_error(link, {}, test1, test1pw)
method_not_allowed_or_error_data("POST", link, {}, test1, test1pw)
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
like2id = temp[len(temp)-1]["id"]
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)
method_not_allowed_or_error_data("POST", link, {}, test1, test1pw)

print("9. Checking inheritance of children_num and like_num.")
temp = get_json_or_error(sys.argv[1]+"article/"+str(article2id)+"/", test2, test2pw)
if temp["children_num"] != 2 or temp["like_num"] != 1:
    print("ERROR!")
    exit(1)
temp = get_json_or_error(sys.argv[1]+"article/"+str(article3id)+"/", test1, test1pw)
if temp["owner"] != test1 or temp["text"] != "reply1":
    print("ERROR: the contents of article does not match after POST!")
    exit(1)
post_or_error(sys.argv[1]+"article/"+str(article3id)+"/article/", {"text": "reply of reply"}, test1, test1pw)
temp = get_json_or_error(sys.argv[1]+"article/"+str(article3id)+"/article/", test2, test2pw)
if temp[0]["depth"] != 2:
    print(temp["ERROR: depth does not match with replay of reply"])
    exit(1)
article5id = temp[0]["id"]
post_or_error(sys.argv[1]+"article/"+str(article5id)+"/like/", {}, test2, test2pw)
temp = get_json_or_error(sys.argv[1]+"article/"+str(article5id)+"/like/", test2, test2pw)
like3id = temp[0]["id"]
temp = get_json_or_error(sys.argv[1]+"article/"+str(article2id)+"/", test2, test2pw)
if temp["children_num"] != 3 or temp["like_num"] != 1:
    print("ERROR!")
    exit(1)
temp = get_json_or_error(sys.argv[1]+"article/"+str(article2id)+"/total/",test2,test2pw)
if len(temp) != 3:
    print("ERROR: total article num does not match!")
    exit(1)
temp = get_json_or_error(sys.argv[1]+"article/"+str(article3id)+"/", test2, test2pw)
if temp["children_num"] != 1 or temp["like_num"] != 0:
    print("ERROR!")
    exit(1)

link = sys.argv[1] + "like/"
print("10. GET like list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)

print("11. GET & DELETE like detail.")
forbidden_or_error_anon("GET", link+str(like2id)+"/")
temp = get_json_or_error(link+str(like2id)+"/", test2, test2pw)
if temp["owner"] != test1: # or temp["article"] != article2id:
    print("ERROR: the contents of like does not match! 1")
    exit(1)
temp = get_json_or_error(link+str(like3id)+"/", test1, test1pw)
if temp["owner"] != test2: # or temp["article"] != article5id:
    print("ERROR: the contents of like does not match! 2")
    exit(1)
forbidden_or_error_anon("DELETE", link+str(like2id)+"/")
forbidden_or_error("DELETE", link+str(like2id)+"/", test2, test2pw)
delete_or_error(link+str(like2id)+"/", test1, test1pw)
temp = get_json_or_error(sys.argv[1]+"article/"+str(article2id)+"/", test2, test2pw)
if temp["children_num"] != 3 or temp["like_num"] != 0:
    print("ERROR!")
    exit(1)

link = sys.argv[1] + "mainpage/"
print("12. GET & POST mainpage.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
forbidden_or_error_anon_data("POST", link, {"text": "mainpage"})
bad_request_or_error_data("POST", link, {}, test1, test1pw)
post_or_error(link, {"text": "mainpage"}, test1, test1pw)

link = sys.argv[1] + "article/"
print("13. Deleting articles that have at least one children.")
delete_or_error(link+str(article3id)+"/", test1, test1pw)
not_found_or_error(link+str(article3id)+"/", test1, test1pw)
not_found_or_error(link+str(article5id)+"/", test1, test1pw)
temp = get_json_or_error(link+str(article2id)+"/", test1, test1pw)
if temp["children_num"] != 1 or temp["like_num"] != 0:
    print("ERROR!")
    exit(1)
post_or_error(link+str(article2id)+"/article/", {"text": "!@#$"}, test1, test1pw)
temp = get_json_or_error(link+str(article2id)+"/article/", test1, test1pw)
article7id = temp[0]["id"]
post_or_error(link+str(article7id)+"/article/", {"text": "%^&*"}, test1, test1pw)
temp = get_json_or_error(link+str(article7id)+"/article/", test1, test1pw)
article8id = temp[0]["id"]
delete_or_error(link+str(article2id)+"/", test2, test2pw)
not_found_or_error(link+str(article2id)+"/", test2, test2pw)
not_found_or_error(link+str(article7id)+"/", test2, test2pw)
not_found_or_error(link+str(article8id)+"/", test2, test2pw)

link = sys.argv[1] + "users/"
print("Final. Deleting all data that test has created.")
delete_or_error(link, test1, test1pw)
delete_or_error(link, test2, test2pw)

print("TEST SUCCESSFUL")
