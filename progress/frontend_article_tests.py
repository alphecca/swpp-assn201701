# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *

####FRONTEND용 패키지들
from frontend_ import *
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

delayTime = 1.5 #TODO DELAYTIME으로 인해 테스트에 에러가 날 경우 숫자를 늘려보자

if len(sys.argv) != 3:
    print("frontend_article_tests.py <backend_url> <frontend_url>")
    print("Example: frontend_article_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/") #TODO change port num
    exit(1)
# 백엔드 주소
backend_link = sys.argv[1]
main_link = backend_link + "mainpage/"
user_link = backend_link + "users/"
# 프론트엔드 주소
frontend_link = sys.argv[2]
userN = 10
user_list = create_users(userN)
########################FRONTEND TEST INITIALIZE###########################
print("Frontend initializer is running...")
try:
    for i in range(1,userN+1):
        username = "test{0}".format(i)
        pwd = "test{0}passwd".format(i)
        res = requests.delete(user_link, auth=(username, pwd))
    for i in range(5):
         requests.delete(user_link, auth=("test{0}".format(i), "newtest{0}passwd".format(i)))
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
driver.maximize_window()

# 본격적인 프론트엔드 테스트 시작
# 로그인 및 로그아웃 테스트
print("1. sign in/out test")
sleep(delayTime)
signInVerification(driver, user_list[0][0], user_list[0][1]) # sign in
sleep(delayTime*2)
signOutVerification(driver, user_list[0][0]) # sign out

# 회원가입 테스트
driver.find_element_by_id("sign_up").click()
print("2. sign up test")
sleep(delayTime)
signUpVerification(driver, 5)
sleep(delayTime)
signUpVerification(driver, 10)
sleep(delayTime)
signOutVerification(driver, 'test10')

# 메인페이지 테스트
print("3. main page test")
sleep(delayTime)
signInVerification(driver, user_list[0][0], user_list[0][1])
# get data from backend to test
forbidden_or_error_anon('GET', main_link)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
# rendering test
sleep(delayTime)
mainPageVerification(driver, data[0:5])
# write test
print("4. write test")
sleep(delayTime)
writeVerification(driver, "test1")
sleep(delayTime)
writeVerification(driver, "test2")
sleep(delayTime)
## check the result
forbidden_or_error_anon('GET', main_link)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
sleep(delayTime)
# 두 번째로 쓴 글
if data[0]["owner"] == user_list[0][0] and data[0]["text"] == "test2":
    pass
else:
    print("Post Fail")
    exit(1)
# 첫 번째로 쓴 글
if data[1]["owner"] == user_list[0][0] and data[1]["text"] == "test1":
    pass
else:
    print("Post Fail")
    exit(1)
mainPageVerification(driver, data[0:5])

# like test
print("5. like test")
article_link = backend_link + 'article/' + str(data[0]["id"]) + '/'
sleep(delayTime)
likeVerification(driver, data[0]["id"], user_list[0][0] == data[0]["owner"])
tmp = data[0]["like_num"]
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if user_list[0][0] != data[0]['owner']:
    tmp = tmp + 1
## 좋아요 수 증가 확인
if data[0]["like_num"] == tmp:
    pass
else:
    print("Like fail")
    exit(1)
mainPageVerification(driver, data[0:5])

# edit test
print("6. edit test")
sleep(delayTime)
editVerification(driver, data[0]["id"], "edit test")
sleep(delayTime)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if(data[0]["text"] != "edit test"):
    print("Edit fail")
    exit(1)
sleep(delayTime)
articleVerification(driver, data[0], 0)
sleep(delayTime)
driver.find_element_by_id('to_main_page_field').click()
"""
# reply test
print("7. reply test")
sleep(delayTime)
replyVerification(driver, data[0]["id"], "reply test")
sleep(delayTime)
reply_data = get_json_or_error(article_link+'article/', user_list[0][0], user_list[0][1])
tmp = data[0]["children_num"]
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if(data[0]["children_num"] != tmp + 1):
    print("reply fail")
    exit(1)
sleep(delayTime)
detailPageVerification(driver, data[0], reply_data)
sleep(delayTime)
driver.find_element_by_id("to_main_page_field").click()
"""
# delete test
print("8. delete test")
sleep(delayTime)
tmp = data[0]
deleteVerification(driver, data[0]["id"])
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
if data[0] == tmp:
    print("delete fail")
    exit(1)
mainPageVerification(driver, data[0:5])

article_link = backend_link + 'article/' + str(data[0]["id"]) + '/'
"""
# detail button test
print("9. detail test")
sleep(delayTime)
detailVerification(driver, data[0]["id"])
sleep(delayTime)
reply_data = get_json_or_error(article_link+'article/', user_list[0][0], user_list[0][1])
detailPageVerification(driver, data[0], reply_data)
sleep(delayTime)
replyVerification(driver, data[0]["id"], "reply test on detail page")
sleep(delayTime)
reply_data = get_json_or_error(article_link+'article/', user_list[0][0], user_list[0][1])
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
likeVerification(driver, reply_data[0]["id"], True)
sleep(delayTime)
reply_data = get_json_or_error(article_link+'article/', user_list[0][0], user_list[0][1])
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
sleep(delayTime)
detailPageVerification(driver, data[0], reply_data)
sleep(delayTime)
deleteVerification(driver, reply_data[0]["id"])
sleep(delayTime)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
sleep(delayTime)
mainPageVerification(driver, data[0:5])
"""
# edit / delete error test
print("10. edit / delete error test")
sleep(delayTime)
signOutVerification(driver, user_list[0][0])
sleep(delayTime)
signInVerification(driver, user_list[1][0], user_list[1][1])
sleep(delayTime)
deleteErrorVerification(driver, data[0]["id"])
sleep(delayTime)
editErrorVerification(driver, data[0]["id"])

sleep(delayTime)
driver.quit()

##########################FRONTEND TEST FINISHED###########################
driver.quit()
print("TEST SUCCESSFUL")

