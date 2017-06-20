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
from selenium.webdriver.chrome.options import Options

delayTime = 1.5 #TODO DELAYTIME으로 인해 테스트에 에러가 날 경우 숫자를 늘려보자

if len(sys.argv) != 3:
    print("frontend_friend_tests.py <backend_url> <frontend_url>")
    print("Example: friend_article_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/")
    exit(1)
# 백엔드 주소
backend_link = sys.argv[1]
main_link = backend_link + "mainpage/"
user_link = backend_link + "users/"
# 프론트엔드 주소
frontend_link = sys.argv[2]
userN = 5
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
chrome_options = Options()
chrome_options.add_experimental_option('prefs', {
    'credentials_enable_serice': False,
    'profile': {
        'password_manager_enabled': False
        }
    })

driver = webdriver.Chrome('/usr/local/bin/chromedriver', chrome_options=chrome_options) #TODO 제대로 작동하지 않을 경우 크롬의 설치경로를 확인해볼 것
driver.get(frontend_link)
driver.maximize_window()

# 본격적인 프론트엔드 테스트 시작
# 로그인 및 로그아웃 테스트
print("1. sign in test")
sleep(delayTime)
signInVerification(driver, user_list[0][0], user_list[0][1]) # sign in
sleep(delayTime*2)

print("2. my friend and addfriend page test.")
toMyProfile(driver)
profileToFriend(driver)
friendNoListVerification(driver)
friendToAddFriend(driver)
addFriendNoListVerification(driver)
addFriendMRNoListVerification(driver)
addFriendToBack(driver, user_list[0][0])
profileToAddFriend(driver)
addFriendToFriend(driver, user_list[0][0])
friendURLVerification(driver, frontend_link, user_list[0][0])

print("3. other's friend and addfriend page test")
toAddFriend(driver, frontend_link, user_list[1][0])
addFriendToBack(driver, user_list[1][0])
profileToFriend(driver)
friendNoListVerification(driver)
friendToAddFriend(driver)
print("3-1. send addfriend request to others.")
addFriendToOk(driver, user_list[1][0])
addFriendToBack(driver, user_list[1][0])
profileToFriend(driver)
friendNoListVerification(driver)
friendToAddFriend(driver)
print("3-2. cancel my request.")
addFriendToDecline(driver, user_list[1][0])
addFriendToOk(driver, user_list[1][0])
addFriendToBack(driver, user_list[1][0])
toMyProfile(driver)
sleep(delayTime)
profileToFriend(driver)
friendNoListVerification(driver)
friendToAddFriend(driver)
addFriendNoListVerification(driver)
check(driver, "mr_"+user_list[1][0]+"_field")
check(driver, "mr_"+user_list[1][0]+"_decline_button_field")
driver.find_element_by_id("mr_"+user_list[1][0]+"_decline_button_field").click()
sleep(delayTime)
addFriendMRNoListVerification(driver)
toAddFriend(driver, frontend_link, user_list[1][0])
addFriendToOk(driver, user_list[1][0])
addFriendToNameProfile(driver, user_list[1][0])
profileURLVerification(driver, frontend_link, user_list[1][0])
toAddFriend(driver, frontend_link, user_list[0][0])
print("3-3. check my addfriend request list.")
check(driver, "mr_"+user_list[1][0]+"_field")
check(driver, "mr_"+user_list[1][0]+"_name_field")
driver.find_element_by_id("mr_"+user_list[1][0]+"_name_field").click()
profileURLVerification(driver, frontend_link, user_list[1][0])
sleep(delayTime)
signOutVerification(driver, user_list[0][0])

print("4. send addfriend request with another user.")
sleep(delayTime)
signInVerification(driver, user_list[2][0], user_list[2][1]) # sign in
sleep(delayTime*2)
toMyProfile(driver)
profileToFriend(driver)
friendNoListVerification(driver)
friendToAddFriend(driver)
addFriendNoListVerification(driver)
addFriendMRNoListVerification(driver)
toAddFriend(driver, frontend_link, user_list[1][0])
addFriendToOk(driver, user_list[1][0])
signOutVerification(driver, user_list[2][0])

print("5. receive addfriend request test.")
sleep(delayTime)
signInVerification(driver, user_list[1][0], user_list[1][1])
sleep(delayTime*2)
toMyProfile(driver)
profileToFriend(driver)
friendNoListVerification(driver)
friendToAddFriend(driver)
check(driver, "fr_"+user_list[0][0]+"_field")
check(driver, "fr_"+user_list[2][0]+"_field")
print("5-1. decline and OK request test.")
addFriendToDecline(driver, user_list[2][0])
try:
    itm = driver.find_element_by_id("fr_"+user_list[2][0]+"_field")
    print(user_list[2][0]+"'s request should not be exist!")
    exit(1)
except NoSuchElementException:
    pass
addFriendToOk(driver, user_list[0][0])
try:
    itm = driver.find_element_by_id("fr_"+user_list[0][0]+"_field")
    print(user_list[0][0]+"'s request should not be exist!")
    exit(1)
except NoSuchElementException:
    pass
addFriendToFriend(driver, user_list[1][0])
print("5-2. friend list test.")
check(driver, "f_"+user_list[0][0]+"_field")
friendToNameProfile(driver, user_list[0][0])
profileToFriend(driver)
check(driver, "f_"+user_list[1][0]+"_field")
friendToNameProfile(driver, user_list[1][0])
profileURLVerification(driver, frontend_link, user_list[1][0])
signOutVerification(driver, user_list[1][0])

print("6. send addfriend request again.")
sleep(delayTime)
signInVerification(driver, user_list[2][0], user_list[2][1])
sleep(delayTime*2)
toMyProfile(driver)
profileToAddFriend(driver)
addFriendMRNoListVerification(driver)
toAddFriend(driver, frontend_link, user_list[1][0])
addFriendToOk(driver, user_list[1][0])
signOutVerification(driver, user_list[2][0])

print("7. receive addfriend request again.")
sleep(delayTime)
signInVerification(driver, user_list[1][0], user_list[1][1])
sleep(delayTime*2)
toMyProfile(driver)
profileToAddFriend(driver)
check(driver, "fr_"+user_list[2][0]+"_field")
addFriendToNameProfile(driver, user_list[2][0])
profileToAddFriend(driver)
addFriendToOk(driver, user_list[2][0])
addFriendToBack(driver, user_list[2][0])
profileToAddFriend(driver)
addFriendToNameProfile(driver, user_list[2][0])
profileToFriend(driver)
print("7-1. check friend list.")
check(driver, "f_"+user_list[1][0]+"_field")
friendToNameProfile(driver, user_list[1][0])
profileToFriend(driver)
check(driver, "f_"+user_list[0][0]+"_field")
check(driver, "f_"+user_list[2][0]+"_field")
signOutVerification(driver, user_list[1][0])
sleep(delayTime)

##########################FRONTEND TEST FINISHED###########################
driver.quit()
print("TEST SUCCESSFUL")

