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
    print("frontend_chatting_tests.py <backend_url> <frontend_url>")
    print("Example: frontend_chatting_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/") #TODO change port num
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
sleep(delayTime*3)
driver = webdriver.Chrome('/usr/local/bin/chromedriver') #TODO 제대로 작동하지 않을 경우 크롬의 설치경로를 확인해볼 것
driver.get(frontend_link)
driver.maximize_window()

## 채팅 테스트
print("Frontend chatting test is running...")
print("[test for person A]")
# sign in
sleep(delayTime)
print("1. sign in")
signInVerification(driver, "test1", "test1passwd")

# create chatroom
sleep(delayTime)
print("2. create chatroom")
roomId = chatRoomVerification(driver, backend_link, "test1","test1passwd") 

# join the chatroom
sleep(delayTime)
print("3. join the chatroom")
joinUserVerification(driver, backend_link, "test1", "test1passwd", roomId)
# send / get message
sleep(delayTime)
print("4. send/get message")
sendTextVerification(driver, backend_link, "test1", "test1passwd", roomId)

# sign out
sleep(delayTime)
print("5. sign out...")
signOutVerification(driver, 'test1')

# for the other user
print("[test for person B]")
sleep(delayTime)
print("1. sign in")
signInVerification(driver, "test2", "test2passwd")
sleep(delayTime)
print("2. join the chatroom")
B_chatRoomVerification(driver, roomId)
sleep(delayTime)
print("3. send/get message")
B_sendTextVerification(driver, backend_link, "test2", "test2passwd", roomId)
sleep(delayTime)
print("4. sign out...")
signOutVerification(driver, 'test2')

##########################FRONTEND TEST FINISHED###########################
driver.quit()
print("TEST SUCCESSFUL")

