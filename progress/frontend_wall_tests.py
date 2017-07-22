# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *
from frontend_ import *

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

delayTime = 1.5 #TODO DELAYTIME으로 인해 테스트에 에러가 날 경우 숫자를 늘려보자

if len(sys.argv) != 3:
    print("frontend_wall_tests.py <backend_url> <frontend_url>")
    print("Example: frontend_wall_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/") #TODO change port num
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
driver2 = webdriver.Chrome('/usr/local/bin/chromedriver') #TODO 제대로 작동하지 않을 경우 크롬의 설치경로를 확인해볼 것
driver.get(frontend_link)
driver2.get(frontend_link)
driver.maximize_window()
driver2.maximize_window()

print("1. Sign In")
sleep(delayTime)
signInVerification(driver, user_list[0][0], user_list[0][1])
sleep(delayTime)
signInVerification(driver2, user_list[1][0], user_list[1][1])

print("2. Initialization for wall")
# get data from backend to test
forbidden_or_error_anon('GET', main_link)
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
sleep(delayTime)
mainPageVerification(driver, data[0:5]) # 만일을 대비한 메인페이지 테스트
sleep(delayTime)
mainPageVerification(driver2, data[0:5]) # 만일을 대비한 메인페이지 테스트

#test1이 좋아요 / 댓글 쓸 글 만들기
sleep(delayTime)
writeVerification(driver2, "test0")
sleep(delayTime)
driver2.quit()

# wall에 들어갈 좋아요한 글
sleep(delayTime)
driver.refresh()
data = get_json_or_error(main_link, user_list[0][0], user_list[0][1])
sleep(delayTime)
likeVerification(driver, data[0]["id"], False)

# wall에 들어갈 댓글
sleep(delayTime)
replyVerification(driver, data[0]["id"], "reply")
sleep(delayTime)
driver.find_element_by_id("to_main_page_field").click()

# wall에 들어갈 작성글
sleep(delayTime)
writeVerification(driver, "test1")
sleep(delayTime)
writeVerification(driver, "test2")

print("3. Wall Verification")
sleep(delayTime)
data = get_json_or_error(user_link+user_list[0][0]+'/wall/', user_list[0][0], user_list[0][1])
if len(data) != 4:
    print("data length not valid")
    exit(1)

for i in range(0, 4):
    if i == 0 or i == 1:
        if data[i]["depth"] > 0:
            print("article not correct")
            exit(1)
    elif i == 2:
        if data[i]["depth"] == 0:
            print("reply not correct")
            exit(1)
    elif i == 3:
        if data[i]["depth"] == user_list[0][0]:
            print("like article not correct")
            exit(1)

driver.find_element_by_id("to_my_wall").click()
sleep(delayTime)
wallPageVerification(driver, data, user_list[0][0])

print("TEST SUCCESSFUL")
driver.quit()
