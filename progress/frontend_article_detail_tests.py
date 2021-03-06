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
    print("frontend_article_detail_tests.py <backend_url> <frontend_url>")
    print("Example: frontend_article_detail_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/") #TODO change port num
    exit(1)
# 백엔드 주소
backend_link = sys.argv[1]
main_link = backend_link + "mainpage/"
user_link = backend_link + "users/"
article_link = backend_link + "article/"
# 프론트엔드 주소
frontend_link = sys.argv[2]
userN = 1
user_list = create_users(userN)
########################FRONTEND TEST INITIALIZE###########################
print("Frontend initializer is running...")
try:
    username="test1"
    pwd="test1passwd"
    res = requests.delete(user_link, auth=(username, pwd))
    for i in range(5):
         requests.delete(user_link, auth=("test{0}".format(i), "newtest{0}passwd".format(i)))
except Exception:
    pass

username = "test1"
password = "test1passwd"
body = {"username": username.encode("ascii"), "password": password.encode("ascii")}
post_or_error_anon(user_link, body)
post_or_error(article_link, {"text": "test"},username,password)
temp = get_json_or_error(article_link,username,password)
id_num=temp[0]['id']
post_or_error(article_link+str(id_num)+'/article/',{"text":'test1'},username,password)
post_or_error(article_link+str(id_num)+'/article/',{"text":'test2'},username,password)
post_or_error(article_link+str(id_num+1)+'/article/',{"text":'test11'},username,password)
post_or_error(article_link+str(id_num+1)+'/article/',{"text":'test21'},username,password)
post_or_error(article_link+str(id_num+2)+'/article/',{"text":'test12'},username,password)
print("Frontend initializer ran successfully!")
##########################FRONTEND TEST START##############################
driver = webdriver.Chrome('/usr/local/bin/chromedriver') #TODO 제대로 작동하지 않을 경우 크롬의 설치경로를 확인해볼 것
driver.get(frontend_link)
driver.maximize_window()
# 로그인
print("1. log in")
signInVerification(driver, username, password) # sign in
sleep(delayTime*2)
# 메인페이지 테스트
print("2. detail click")
sleep(delayTime)
check(driver, "a"+str(id_num)+"_detail_button_field");
driver.find_element_by_id("a"+str(id_num)+"_detail_button_field").click()
print("3. check articles")
sleep(delayTime)
driver.execute_script("document.body.style.zoom='24%'")
sleep(delayTime)
check(driver, "a"+str(id_num)+"_text_field")
check(driver, "a"+str(id_num+1)+"_text_field")
check(driver, "a"+str(id_num+3)+"_text_field")
check(driver, "a"+str(id_num+4)+"_text_field")
check(driver, "a"+str(id_num+2)+"_text_field")
check(driver, "a"+str(id_num+5)+"_text_field")
sleep(delayTime)

##########################FRONTEND TEST FINISHED###########################
driver.quit()
print("TEST SUCCESSFUL")

