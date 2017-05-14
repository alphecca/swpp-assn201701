import json
import requests
import sys
from time import sleep
from random import randint
from backend import *

####FRONTEND용 패키지들
from frontend import *
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

if len(sys.argv) != 3:
    print("backend_tests.py <backend_url> <frontend_url>")
    print("Example: backend_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/")
    exit(1)
# 백엔드 주소
backend_link = sys.argv[1]
main_link = backend_link + "mainpage/"
user_link = backend_link + "users/"
# 프론트엔드 주소
frontend_link = sys.argv[2]
userN = 10
user_list = create_users(userN)
"""unknownname = "unknown_user"
unknownpwd = "unknown_userpwd"""
########################FRONTEND TEST INITIALIZE###########################
print("Frontend initializer is running...")
try:
    for i in range(1,userN+1):
        username = "test{0}".format(i)
        pwd = "test{0}passwd".format(i)
        res = requests.delete(user_link, auth=(username, pwd))
except Exception:
    pass

for i in range(1,userN):
    username = "test{0}".format(i)
    password = "test{0}passwd".format(i)
    body = {"username": username.encode("ascii"), "password": password.encode("ascii")}
    post_or_error_anon(user_link, body)
print("Frontend initializer ran successfully!")

##########################FRONTEND TEST START##############################
driver = webdriver.Chrome('/usr/local/bin/chromedriver') #TODO 제대로 작동하지 않을 경우 크롬의 설치경로를 확인해볼 것
driver.get(frontend_link)
# 로그인 및 로그아웃 테스트
print("1. sign in/out test")
sleep(1)
signInVerification(driver, user_list[0][0], user_list[0][1])
sleep(1)
signOutVerification(driver)

# 회원가입 테스트
driver.find_element_by_id("sign_up").click()
print("2. sign up test")
sleep(1)
signUpVerification(driver, 5)
sleep(1)
signUpVerification(driver, 10)
sleep(1)
signOutVerification(driver)

# 메인페이지 테스트
print("3. main page test")
sleep(0.5)
signInVerification(driver, user_list[0][0], user_list[0][1])
## get data from backend to test
forbidden_or_error_anon('GET', main_link)
data = get_json_or_error(main_link, "newspring", "swppswpp")
sleep(0.5)
mainPageVerification(driver, data[0:5])
# write test
print("4. write test")
driver.find_element_by_id("write_button_field").click()
sleep(1)
writePageVerification(driver, "test1")
sleep(1)
driver.find_element_by_id("write_button_field").click()
sleep(1)
writePageVerification(driver, "test2")
sleep(1)
## check the result
forbidden_or_error_anon('GET', main_link)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
sleep(1)
if data[0]["owner"] == user_list[0][0] and data[0]["text"] == "test2":
    pass
else:
    print("Post Fail")
    exit(1)
if data[1]["owner"] == user_list[0][0] and data[1]["text"] == "test1":
    pass
else:
    print("Post Fail")
    exit(1)

# like test
print("5. like test")
article_link = backend_link + 'article/' + str(data[0]["id"]) + '/'
likeVerification(driver, data[0]["id"], False)
sleep(1)
likeVerification(driver, data[0]["id"], True)
tmp = data[0]["like_num"]
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if data[0]["like_num"] == tmp + 1:
    pass
else:
    print("Like fail")
    exit(1)

# edit test
print("6. edit test")
sleep(1)
editVerification(driver, data[0]["id"], "edit test")
sleep(1)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if(data[0]["text"] != "edit test"):
    print("Edit fail")
    exit(1)

# reply test
print("7. reply test")
replyVerification(driver, data[0]["id"], "reply test")
sleep(1)
reply_data = get_json_or_error(article_link+'article/', user_list[0][0], user_list[0][1])
sleep(1)
tmp = data[0]["children_num"]
data[0] = get_json_or_error(article_link, user_list[0][0], user_list[0][1])
if(data[0]["children_num"] != tmp + 1):
    print("reply fail")
    exit(1)
sleep(1)
detailPageVerification(driver, data[0], reply_data)
sleep(1)
driver.find_element_by_id("to_main_page_field").click()

# detail page test
print("8. detail test")
sleep(1)
detailVerification(driver, data[0]["id"])
sleep(1)
detailPageVerification(driver, data[0], reply_data)
driver.find_element_by_id("to_main_page_field").click()

# delete test
print("9. delete test")
sleep(1)
tmp = data[0]
deleteVerification(driver, data[0]["id"])
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if data[0] == tmp:
    print("delete fail")
    exit(1)

#TODO 자신이 쓴 글이 아닌 다른 사람이 쓴 글 수정/삭제 못하는거 확인...귀찮

# edit / delete error test
print("10. edit / delete error test")
sleep(1)
signOutVerification(driver)
sleep(1)
signInVerification(driver, user_list[1][0], user_list[1][1])
sleep(1)
deleteErrorVerification(driver, data[0]["id"])
sleep(1)
editErrorVerification(driver, data[0]["id"])
##########################FRONTEND TEST FINISHED###########################
driver.quit()
print("TEST SUCCESSFUL")

