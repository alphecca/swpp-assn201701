import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *

# TODO We should implement that "Final. Deleting all data that test has created." will always be executed even though the test ended with exit(1). 

if len(sys.argv) != 2:
    print("backend_wall_tests.py <url>")
    print("Example: backend_wall_tests.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

userN = 10
user_pairs = create_users(userN)
unknownname = "unknown_user"
unknownpwd = "unknown_userpwd"

link = sys.argv[1] + 'users/'
article_link = sys.argv[1] + 'article/'
like_link = sys.argv[1] + 'like/'


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
    username = user_pairs[i-1][0]
    password = user_pairs[i-1][1]
    body = {"username": username.encode("ascii"), "password": password.encode("ascii")} #encoded
    post_or_error_anon(link, body)
    method_not_allowed_or_error_anon_data("POST", link, body)

print("2. Post test articles")
content_list = []
for i in range(1, userN):
    content_list.append("test{0}text".format(i))
    post_or_error(article_link, {"text": content_list[i-1]}, user_pairs[i-1][0], user_pairs[i-1][1])

article_list = get_json_or_error(article_link, user_pairs[0][0], user_pairs[0][1])

print("2-1. Wall Get test")
for i in range(1, userN):
    wall_list = get_json_or_error(link+user_pairs[i-1][0]+'/wall/', user_pairs[0][0], user_pairs[0][1])
    if len(wall_list) > 1:
        print("Num of article does not match!")
        exit(1)
    if wall_list[0]["text"] != content_list[i-1]:
        print("Article text does not match!")
        exit(1)

print("3. Wall Like test")
for i in range(0, userN-2):
    post_or_error(article_link+str(article_list[i]["id"])+'/like/', {}, user_pairs[0][0], user_pairs[0][1])
    tmp = len(wall_list)
    wall_list = get_json_or_error(link+user_pairs[0][0]+'/wall/', user_pairs[0][0], user_pairs[0][1])
    if len(wall_list) != tmp + 1:
        print("Num of article does not match!")
        exit(1)
    if wall_list[i]["text"] != content_list[userN-i-2]:
        print("Article text does not match!")
        print("wall 0th: %s, content %d th: %s" %(wall_list[0]["text"], userN-i-2, content_list[userN-i-2]))
        exit(1)
    if wall_list[i]["owner"] == user_pairs[0][0]:
        print("It's not a liked post!")
        exit(1)

print("4. Post test reply")
for i in range(0, userN-1):
    post_or_error(article_link+str(article_list[userN-2-i]["id"])+'/article/', {"text":"reply{0}text".format(i)}, user_pairs[0][0], user_pairs[0][1])

print("5. Wall Reply test")
wall_list = get_json_or_error(link+user_pairs[0][0]+'/wall/', user_pairs[0][0], user_pairs[0][1])
for i in range(0, userN-1):
    if wall_list[i]["text"] != "reply{0}text".format(userN-2-i):
        print("Reply text does not match!")
        exit(1)
    if wall_list[i]["depth"] != 1:
        print("It's not a reply!1")
        print(wall_list[i]["text"])
        exit(1)
    if wall_list[i]["owner"] != user_pairs[0][0]:
        print("It's not a reply!2")
        exit(1)

print("6. Invalid HTTP request test")
method_not_allowed_or_error_data('POST', link+user_pairs[0][0]+'/wall/', {}, user_pairs[0][0], user_pairs[0][1])
method_not_allowed_or_error_data('DELETE', link+user_pairs[0][0]+'/wall/', {}, user_pairs[0][0], user_pairs[0][1])
method_not_allowed_or_error_data('PUT', link+user_pairs[0][0]+'/wall/', {}, user_pairs[0][0], user_pairs[0][1])

link = sys.argv[1] + "users/"
print("Final. Deleting all data that test has created.")
for i in range(0, userN-1):
    delete_or_error(link, user_pairs[i][0], user_pairs[i][1])

print("TEST SUCCESSFUL")

