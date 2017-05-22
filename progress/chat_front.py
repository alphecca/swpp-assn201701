from time import sleep
import sys
import requests
import http, base64
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

from backend import *

# general checker whether id exists
def check(driver, name):
    try:
        itm = driver.find_element_by_id(name)
    except NoSuchElementException:
        print("Cannot find %s" % name)
        exit(1)
def alert(driver, text):
    try:
        if Alert(driver).text == text:
            Alert(driver).accept()
        else:
            print("Alert message should be [%s] but it's [%s]" % (text, Alert(driver).text))
            exit(1)
    except NoAlertPresentException:
        print("No Alert Error")
        exit(1)

# 1. SignIn
def signInVerification(driver, uname, upwd):
    check(driver, "sign_up")
    driver.find_element_by_id('sign_up').click()
    sleep(1)
    check(driver, "username_field")
    check(driver, "password_field")
    check(driver, "pwdverification_field")
    check(driver, "sign_up")
    driver.find_element_by_id('username_field').send_keys(uname)
    driver.find_element_by_id('password_field').send_keys(upwd)
    driver.find_element_by_id('pwdverification_field'.send_keys(upwd)
    driver.find_element_by_id('sign_up').click()
    sleep(1)


def chatRoomVerification(driver):
    for a in range(1,3):
        sleep(1)
        check(driver, "chat_button_field")
        driver.find_element_by_id('chat_button_field').click()
        sleep(1)
        check(driver, "cancel_button_field")
        driver.find_element_by_id('cancel_button_field').click()
    sleep(1)
    check(driver, "chat_button_field")
    driver.find_element_by_id('chat_button_field').click()
    sleep(1)
    check(driver, post_room_button_field)
    driver.find_element_by_id('post_room_button_field').click()
    sleep(1)
    alert(driver, "Please input correctly")

    for t in range(1,3):
        roomName = "myroom"+str(t) #TODO should get from backend
        check(driver, "input_room_name_field")
        driver.find_element_by_id("input_room_name_field").send_keys(roomName)
        driver.find_element_by_id('post_room_button_field').click()
        sleep(2)

    for t in range(1,3):
        roomId = "room"+str(t)
        # check num=1 & roomName
        if driver.find_element_by_id(roomId+"_user_num_field").text != str(1):
            print("# of people in the chatroom "+t+" isn't 1")
            exit(1)
        elif driver.find_element_by_id(roomId+"_name_field").text != roomName:
	    print("Name of the chatroom "+t+" isn't correct")
	    exit(1)
	sleep(1)
    for t in range(1,3):
        roomId = "room"+str(t)
	check(driver, roomId+"_join_field")
        check(driver, roomId+"_chat_field")
        driver.find_element_by_id(roomId+"_join_field").click()
        alert(driver, "You already join in this room")
	sleep(1)
	driver.find_element_by_id(roomId+"_chat_field").click()
        sleep(1)
	driver.find_element_by_id("change_room_button_field").click()
	sleep(1)

def joinUserVerification(driver, link, uname, upwd): 
    check(driver, "room1_chat_field")
    driver.find_element_by_id("room1_chat_field").click()
    sleep(1)
    try:
	res = requests.get(link+"/chatroom/1/user/", auth=(uname, upwd))
	if res.status_code != 404:
            print("ERROR: Should not found {0} : code {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
	    exit(1)
    except Exception:
	print("ERROR: Cannot get {0}".format(link))
    userId= res.json().id[res.json().length-1]
    if driver.find_element_by_id("u"+userId+"_username_field" ).text != uname:
	print("You are not in the chatroom!")
	exit(1)
    
def sendTextVerification(driver, link, uname, upwd):
    check(driver, 'post_text_button_field')
    driver.find_element_by_id("post_text_button_field").click()
    alert(driver, "Please input message correctly") 
    sleep(1)
    check(driver, 'input_text_field')
    textCont= "text1"
    driver.find_eleemnt_by_id("input_text_field").send_keys(textCont)
    driver.find_element_by_id("post_text_button_field").click()
    sleep(0.6)
    try:
	res = requests.get(link+"/chatroom/1/text/", auth=(uname, upwd)) 
	if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
	    exit(1)
    except Exception:
	print("ERROR: Cannot get {0}".format(link))
    sleep(1)
    textId=res.json().text[res.json().length-1]
    if driver.find_element_by_id("t"+textId+"_text_field").text != textCont:
	print("Text message isn't match!")
	exit(1)
    elif driver.find_element_by_id("t"+textId+"_writer_field").text != uname:
	print("Text writer isn't match!")
	exit(1)

def signOutVerification(driver):
    check(driver, "sign_out")
    driver.find_element_by_id("sign_out").click()

def B_chatRoomVerification(driver):
# in the ~/main/
    check(driver, "chat_button_field")
    driver.find_element_by_id('chat_button_field').click()
    sleep(1)
# in the ~/room/
    check(driver, "chat_button_field")
    driver.find_element_by_id('chat_button_field').click()
    sleep(1)
    check(driver, "input_text_field")
    check(driver, "post_text_button_field")
    driver.find_element_by_id("input_text_field").send_keys("XXX")
    driver.find_element_by_id('post_text_button_field').click()
    alert(driver, 'You didn\'t join in this room. Please join in first.') 
    sleep(1)
# at room list 
    check(driver, "room1_join_field")
    driver.find_element_by_id('room1_join_field').click()
    sleep(1)
    if driver.find_element_by_id('room1_user_num_field').text != str(2):
	print("# of people in the chatroom1 isn't correct")
    check(driver, "room1_chat_field")
    driver.find_element_by_id('room1_chat_field').click()
   
def B_sendTextVerification(driver, link, uname, upwd ):
    try:
       res = requests.get(link+"/chatroom/1/user/", auth=(uname, upwd))
       if res.status_code != 200:
         print("ERROR: Cannot get {0} : {1}, id = {2}, pwd= {3}".format(link, res.status_code, uname, upwd))
         exit(1)
    except Exception:
	print("ERROR: Cannot get {0}".format(link))
    sleep(1)
    userId=res.json().user[res.json().length-1]
    if driver.find_element_by_id("u"+userId+"_username_field").text != uname:
        print("Text writer isn't match!")
        exit(1)

    try:
        res = requests.get(link+"/chatroom/1/text/", auth=(uname, upwd))
        if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id= {2}, pwd={3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
            print("ERROR: Cannot get {0}".format(link))
    sleep(1)
    userId=res.json().user[res.json().length-1]
    if driver.find_element_by_id("u"+userId+"_username_field").text != "cahtA": # check old text
        print("Text writer isn't match!")
        exit(1)

    check(driver, 'input_text_field')
    textCont= "text2"
    driver.find_eleemnt_by_id("input_text_field").send_keys(textCont)
    driver.find_element_by_id("post_text_button_field").click()
    sleep(0.6)
    try:
	res = requests.get(link+"/chatroom/1/text/", auth=(uname, upwd)) 
	if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
	    exit(1)
    except Exception:
	print("ERROR: Cannot get {0}".format(link))
    sleep(1)
    textId=res.json().text[res.json().length-1]
    if driver.find_element_by_id("t"+textId+"_text_field").text != textCont:
	print("Text message isn't match!")
	exit(1)
    elif driver.find_element_by_id("t"+textId+"_writer_field").text != uname:
	print("Text writer isn't match!")
	exit(1)

