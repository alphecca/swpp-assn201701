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
from chat_front import *
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

delayTime = 1 #TODO DELAYTIME으로 인해 테스트에 에러가 날 경우 숫자를 늘려보자

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
#프로필 버튼 클릭시 이동할 주소
url_P=frontend_link+"profile/" # front profile
url_FL=frontend_link+"friend/" # ront friend
url_FA=frontend_link+"addfriend/" # front addfrined
url_W=frontend_link+"wall/" # front wall
########################FRONTEND TEST INITIALIZE###########################
print("Frontend initializer is running...")
user1 = "test1"
upwd1 = "test1passwd"
user2 = "test2"
upwd2 = "test2passwd"

delete_or_error(user_link, auth=(user1, upwd1))
delete_or_error(user_link, auth=(user2, upwd2))
post_or_error_anon(user_link, {"username":user1.encode("ascii"),"password":upwd1.encode("ascii") })
post_or_error_anon(user_link, {"username":user2.encode("ascii"),"password":upwd2.encode("ascii") })
print("Frontend initializer ran successfully!")
##########################FRONTEND TEST START##############################
driver = webdriver.Chrome('/usr/local/bin/chromedriver') #TODO 제대로 작동하지 않을 경우 크롬의 설치경로를 확인해볼 것
driver.get(frontend_link)

# 본격적인 프론트엔드 테스트 시작
print("0. Sign in")
signInPageVerification(driver)
sleep(delayTime)
signInVerification(drvier, user2, upwd2)
sleep(delayTime)
print(" also make one sample article...")
check(driver,"write_button_field")
driver.find_element_by_id("write_button_field").click()
writePageVerification(driver, "sampel text")
sleep(delayTime)
signOutVerification(driver, user2)
sleep(delayTime)
signInVerification(driver, user1, upwd1)

print("1. Modify profiles")
print(" 1-1. change my profile")
sleep(delayTime)
driver.find_element_by_id("to_my_profile").click()
url = driver.getCurrentUrl()
if url != url_P+user1+"/":
    print("cannot move to my profile")
    exit(1)
sleep(delayTime)
changeProfile_T(driver, "name1", "student", "hello"):
print(" 1-2. try other's profile")
sleep(delayTime)
driver.find_element_by_id("to_main_page_field").click()
sleep(delayTime)
driver.find_element_by_id("a1_writer_field").click()
changeProfile_F(driver):

print("2. Modify passwords")
print(" 2-1. change my passwords")
sleep(delayTime)
changePW_T(driver, user1, upwd1, "new"+upwd1) :
print(" 2-2. change other's password")
sleep(delayTime)
driver.find_element_by_id("to_main_page_field").click()
sleep(delayTime)
driver.find_element_by_id("a1_writer_field").click()
changePW_F(driver):

print("3. Change url to frined")
sleep(delayTime)
driver.find_element_by_id("friend_list_button_field").click()
sleep(delayTime)
url = driver.getCurrentUrl()# checking url 
if url != url_FL:
    print("cannot move to friend list page")
    exit(1)

print("4. Change url to frined request")
sleep(delayTime)
driver.find_element_by_id("friend_add_button_field").click()
sleep(delayTime)
url = driver.getCurrentUrl()# checking url 
if url != url_FA:
    print("cannot move to friend add page")
    exit(1)

print("5. Change url to wall")
sleep(delayTime)
driver.find_element_by_id("goto_wall_button_field").click()
sleep(delayTime)
url = driver.getCurrentUrl()# checking url 
if url != url_W:
    print("cannot move to wall page")
    exit(1)

print("6. Escape North facebook")
print(" 6-1. make other person escape the book")
sleep(dalayTime)
escapeBook_T(driver)
sleep(delayTime)
escapeBook_F(driver)
sleep(delayTime)

print("7. Delete test users")
delete_or_error(user_link, auth=(user1, upwd1))
delete_or_error(user_link, auth=(user2, upwd2))
##########################FRONTEND TEST END##############################
print("TEST SUCCESSFUL")
driver.quit()
