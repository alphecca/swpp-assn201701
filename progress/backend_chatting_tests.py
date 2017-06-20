import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *

# TODO We should implement that "Final. Deleting all data that test has created." will always be executed even though the test ended with exit(1).

if len(sys.argv) != 2:
    print("backend_chatting_tests.py <url>")
    print("Example: backend_chatting_tests.py http://wlxyzlw.iptime.org:8000/")
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
post_or_error(link, {"room_name": "test room1"}, test2, test2pw)
post_or_error(link, {"room_name": "test room2"}, test1, test1pw)
bad_request_or_error_data("POST",link, {"room_name": ""}, test1, test1pw)
bad_request_or_error_data("POST",link, {}, test1, test1pw)
bad_request_or_error_data("POST", link,{"room_name":"l"*66},test2,test2pw)
chatroom_list = get_json_or_error(link, test1, test1pw)
chatroom2id = chatroom_list[-1]["id"]
chatroom1id = chatroom_list[-2]["id"]

link = sys.argv[1] + "chatroom/" + str(chatroom1id) + "/"
print("6. GET & DELETE chatroom detail.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
# TODO if you add some features to chatting room, add test here.
if temp["room_name"] != "test room1":
    print("ERROR: the contents of chatroom does not match after POST!")
    exit(1)
get_json_or_error(link, test2, test2pw)

method_not_allowed_or_error_anon_data("DELETE", link, {})
method_not_allowed_or_error_data("DELETE", link, {}, test1, test1pw)
#delete_or_error(link, test1, test1pw)
#not_found_or_error(link, test2, test2pw)

link = sys.argv[1] + "chatroom/" + str(chatroom2id) + "/"
temp = get_json_or_error(link, test1, test1pw)
# TODO if you add some features to chatting room, add test here.
if temp["room_name"] != "test room2":
    print("ERROR: the contents of chatroom does not match after POST!")
    exit(1)

link = sys.argv[1] + "chatroom/" + str(chatroom2id) + "/user/"
print("7. GET & POST & DELETE chatuser.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)
if len(temp) != 1:
    print("ERROR: the length of chatuser list should be 1!")
    exit(1)

forbidden_or_error_anon_data("POST", link, {})
post_or_error(link, {}, test2, test2pw)
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
if len(temp) != 2 or temp[len(temp)-1]["chatroom"] != chatroom2id or temp[len(temp)-1]["chatuser"] != test2:
    print("ERROR: the contents of chatuser does not match after POST!")
    exit(1)
user1_chatuserid = temp[0]["id"] # use this when testing /chatuser/
method_not_allowed_or_error_data("POST", link, {}, test1, test1pw)
method_not_allowed_or_error_data("POST", link, {}, test2, test2pw)

forbidden_or_error_anon("DELETE", link)
delete_or_error_200(link, test2, test2pw)
temp = get_json_or_error(link, test1, test1pw)
if len(temp) != 1:
    print("ERROR: the length of chatuser list should be 1 after DELETE!")
    exit(1)

link = sys.argv[1] + "chatroom/" + str(chatroom2id) + "/text/"
print("8. GET & POST text.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)
#method_not_allowed_or_error("GET", link, test2, test2pw) # TODO user who didn't join in this room cannot GET text from this room.
forbidden_or_error_anon_data("POST", link, {"text": "anonymous user"})
post_or_error(link, {"text": "testing..."}, test1, test1pw)
bad_request_or_error_data("POST", link, {}, test1, test1pw)
bad_request_or_error_data("POST", link, {"text": ""}, test1, test1pw)
method_not_allowed_or_error_data("POST", link, {"text": "I didn't join in this room."}, test2, test2pw)
join_link = sys.argv[1] + "chatroom/" + str(chatroom2id) + "/user/"
post_or_error(join_link, {}, test2, test2pw)
post_or_error(link, {"text": "I'm chatting"}, test2, test2pw)
temp = get_json_or_error(link, test2, test2pw)
if len(temp) != 2 or temp[0]["writer"] != test2 or temp[0]["text"] != "I'm chatting" or temp[0]["room"] != chatroom2id:
    print("ERROR: the contents of chatting text does not match after POST!")
    exit(1)
# user1_textid = temp[len(temp)-1]["id"] # use this when testing /text/

print("9. Checking value of user_num in chatting room.")
temp = get_json_or_error(sys.argv[1]+"chatroom/"+str(chatroom2id)+"/", test2, test2pw)
if temp["user_num"] != 2:
    print("ERROR! the value of user_num should be 2!")
    exit(1)

link = sys.argv[1] + "chatuser/"
print("10. GET chatuser list.")
forbidden_or_error_anon("GET", link)
get_json_or_error(link, test1, test1pw)

def find_dict_in_list_by_id(l, id_to_find):
    if type(l) != list or len(l) == 0:
        return None
    for item in l:
        if type(item) != dict:
            return None
        if item["id"] == id_to_find:
            return item
    return None

print("11. checking contents in chatuser list.")
chatroom_list_link = sys.argv[1] + "chatroom/"
post_or_error(chatroom_list_link, {"room_name": "additional test"}, test1, test1pw)
temp = get_json_or_error(chatroom_list_link, test1, test1pw)
chatroom3id = temp[len(temp)-1]["id"]
chatuser_link = chatroom_list_link + str(chatroom3id) + "/user/"
temp = get_json_or_error(link, test1, test1pw)
if temp[len(temp)-1]["chatroom"] != chatroom3id or temp[len(temp)-1]["chatuser"] != test1:
    print("ERROR: the contents of chatuser list does not match after POST!")
    exit(1)
chatuser = find_dict_in_list_by_id(temp, user1_chatuserid)
if chatuser["chatroom"] != chatroom2id or chatuser["chatuser"] != test1:
    print("ERROR: the contents of chatuser list does not match!")
    exit(1)

link = chatroom_list_link + str(chatroom3id) + "/"
print("12. check if the room that has 0 user is automatically deleted.")
temp = get_json_or_error(link, test1, test1pw)
if temp["user_num"] != 1:
    print("WARNING: the test has interrupted! this step will be skipped.")
    delete_or_error(link, test1, test1pw)
else:
    post_or_error(chatuser_link, {}, test2, test2pw)
    delete_or_error_200(chatuser_link, test2, test2pw)
    delete_or_error(chatuser_link, test1, test1pw)
    not_found_or_error(link, test1, test1pw)

link = chatroom_list_link + str(chatroom2id) + "/"

# Andantino: I think that /text/ page is useless and redundant. I want to remove /text/ page in backend.
link = sys.argv[1] + "text/"
print("13. GET text list.")
forbidden_or_error_anon("GET", link)
temp = get_json_or_error(link, test1, test1pw)

link = sys.argv[1] + "users/"
print("Final. Deleting all data that test has created.")
delete_or_error(link, test1, test1pw)
delete_or_error(link, test2, test2pw)

print("TEST SUCCESSFUL")

