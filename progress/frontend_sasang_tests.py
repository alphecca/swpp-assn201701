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
    print("frontend_sasang_tests.py <backend_url> <frontend_url>")
    print("Example: frontend_sasang_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/") #TODO change port num
    exit(1)
# 백엔드 주소
backend_link = sys.argv[1]
main_link = backend_link + "mainpage/"
user_link = backend_link + "users/"
# 프론트엔드 주소
frontend_link = sys.argv[2]
profile_link = frontend_link+"profile/"
userN = 3
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

for i in range(1,userN+1):
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

#사상검증테스트 시작
text1 = '아직 아무도 사상검증 않았소'
text2 = '지금까지 '
text3 = '와 총사상검증 횟수는'
text4 = '번이오!'
text4 = '이미 사상검증 중이오!'
link_A = user_link+"test1/sasang/"
link_B = user_link+"test2/sasang/"
link_C = user_link+"test3/sasang/"
sleep(delayTime)
print("1. A person sends sasang to all people")
signInVerification(driver, 'test1', 'test1passwd')
sleep(delayTime)
sleep(delayTime)
sleep(delayTime)
sleep(delayTime)
check(driver, "to_my_profile")
driver.find_element_by_id('to_my_profile').click()
sleep(delayTime)
sleep(delayTime)
Sasang(driver, "sasang_status", text1)
driver.get(profile_link+'test2/')
sleep(delayTime)
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
check(driver, 'POST_sasang_button_field')
driver.find_element_by_id('POST_sasang_button_field').click()
sleep(delayTime)
sleep(delayTime)
sleep(delayTime)
driver.get(profile_link+'test3/')
sleep(delayTime)
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
check(driver, 'POST_sasang_button_field')
driver.find_element_by_id('POST_sasang_button_field').click()
sleep(delayTime)
sleep(delayTime)
driver.get(profile_link+'test1/')
sleep(delayTime)
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
sleep(delayTime)
mySasang(driver, "0", "test2", "1")
sleep(delayTime)
mySasang(driver, "1", "test3", "1")
sleep(delayTime)
print("2. A person sends sasang to people again")
driver.get(profile_link+'test2/')
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
Sasang(driver, "sasanging", text4)
driver.get(profile_link+'test3/')
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
Sasang(driver, "sasanging", text4)
print("3. Check A's sasang list")
driver.get(frontend_link+"profile/test1/")
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
mySasang(driver, "0", "test2", "1")
sleep(delayTime)
mySasang(driver, "1", "test3", "1")
sleep(delayTime)
print("... Login as another user ...")
signOutVerification(driver, 'test1')
sleep(delayTime)
signInVerification(driver, 'test2', 'test2passwd')
sleep(delayTime)
print("4. Check B's sasang list")
check(driver, 'to_my_profile')
driver.find_element_by_id('to_my_profile').click()
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
sleep(delayTime)
mySasang(driver, "0", "test1", "1")
sleep(delayTime)
print("5. B person sends sasang to all people")
put_or_error(link_A, {}, 'test2', 'test2passwd')
sleep(delayTime)
post_or_error(link_C, {}, 'test2', 'test2passwd')
sleep(delayTime)
print("6. Check B's sasang list")
driver.get(profile_link+'test2/')
sleep(delayTime)
mySasang(driver, "0", 'test1', "2")
sleep(delayTime)
mySasang(driver, "1", 'test3', "1")
sleep(delayTime)
print("... A & B pushed each other 2 times more ...")
put_or_error(link_B, {}, 'test1', 'test1passwd')
sleep(delayTime)
put_or_error(link_A, {}, 'test2', 'test2passwd')
sleep(delayTime)
put_or_error(link_B, {}, 'test1', 'test1passwd')
sleep(delayTime)
put_or_error(link_A, {}, 'test2', 'test2passwd')
sleep(delayTime)
print("7. Check A's sasang list")
signOutVerification(driver, 'test2')
sleep(delayTime)
signInVerification(driver, 'test1', 'test1passwd')
sleep(delayTime)
driver.get(profile_link+'test1')
mySasang(driver,"0" ,'test2', "6")
driver.get(profile_link+"test2")
yourSasang(driver, "6")
driver.get(profile_link+"test3")
yourSasang(driver,"1")
print("8. Check B's sasang list")
signOutVerification(driver, 'test1')
sleep(delayTime)
signInVerification(driver, 'test2', 'test2passwd')
sleep(delayTime)
driver.get(profile_link+"test1")
yourSasang(driver,"6")
driver.get(profile_link+"test2")
mySasang(driver, "0", 'test1',  "6")
driver.get(profile_link+"test3")
yourSasang(driver,"1")
sleep(delayTime)
print("9. Check C's sasang list")
signOutVerification(driver, 'test2')
sleep(delayTime)
signInVerification(driver, 'test3', 'test3passwd')
sleep(delayTime)
driver.get(profile_link+"test1")
yourSasang(driver,"1")
driver.get(profile_link+"test2")
yourSasang(driver,"1")
driver.get(profile_link+"test3")
mySasang(driver, "0", 'test1', "1")
sleep(delayTime)
mySasang(driver, "1", 'test2', "1")
sleep(delayTime)
##########################FRONTEND TEST FINISHED###########################
driver.quit()
print("TEST SUCCESSFUL")

