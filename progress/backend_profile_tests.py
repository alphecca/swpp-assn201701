import json
import requests
import sys
from backend_ import *

if len(sys.argv) != 2:
    print("backend_profile_tests.py <url>")
    print("Example: backend_profile_tests.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

delaytime=1
userN=5

print("//////////PROFILE TEST//////////////")
print("0. Cheking url.(If the program stops, quit with CONTROL_C.)")
link_user= sys.argv[1] + "users/"
link_profile= sys.argv[1]+"profile/"
forbidden_or_error_anon("GET", link_user)
forbidden_or_error_anon("GET", link_profile)

print("1. Initialize accounts")
try:
    for i in range(userN):
        username = "test{0}".format(i)
        pwd = "test{0}passwd".format(i)
        res = requests.delete(link, auth=(username, pwd))
    for i in range(5):
         requests.delete(user_link, auth=("test{0}".format(i), "newtest{0}passwd".format(i)))
except Exception:
    pass
for i in range(userN):
    username = "test{0}".format(i)
    password = "test{0}passwd".format(i)
    body = {"username": username.encode("ascii"), "password": password.encode("ascii")} #encoded
    post_or_error_anon(link_user, body)

print("2. Check if profile of each user auto-created")
for i in range(userN):
    uname="test{0}".format(i)
    upwd="test{0}passwd".format(i)
    get_json_or_error(link_user+uname+"/profile/", uname, upwd)
print("3. Modify profiles")
for i in range(userN):
   uname="test{0}".format(i)
   upwd="test{0}passwd".format(i)
   body={"user":uname.encode("ascii"), 
         "myname":"myname{0}".format(i).encode("ascii"),
         "mybelong":"school",
         "myintro":"Nice to meet you"
          }
   put_or_error(link_user+uname+"/profile/",body,uname, upwd) 
print("4. Modify passwords")
for i in range(userN):
   uname="test{0}".format(i)
   upwd="test{0}passwd".format(i)
   newpwd="newtest{0}passwd".format(i)
   body={"username":uname.encode("ascii"),"password":newpwd.encode("ascii")}
   put_or_error(link_user+uname+"/", body, uname, upwd)
print("5. Delete test accounts...")
for i in range(userN):
   uname="test{0}".format(i)
   upwd="newtest{0}passwd".format(i)
   delete_or_error(link_user+uname+"/", uname, upwd)  
print("TEST SUCCESSFUL")
