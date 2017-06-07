# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from time import sleep
import sys
import requests
import http, base64
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

from backend_ import *
from frontend_ import *

delayTime=1
# general checker whether id exists
"""
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

def signInVerification(driver, uname, upwd):
    check(driver, "username_field")
    check(driver, "password_field")
    check(driver, "sign_in")
    driver.find_element_by_id('username_field').send_keys(uname)
    driver.find_element_by_id('password_field').send_keys(upwd)
    driver.find_element_by_id('sign_in').click()
    sleep(delayTime*2)
    #alert(driver, "Succeed to sign in! :)")
    sleep(delayTime)
"""
def chatRoomVerification(driver, link, uname, upwd):
    sleep(delayTime)
    check(driver, "chat_button_field")
    sleep(delayTime)
    driver.find_element_by_id('chat_button_field').click()
    print("2-1. click new room button and then cancel")
    for a in range(1,4):
        sleep(delayTime)
        check(driver, "new_room_button_field")
        driver.find_element_by_id('new_room_button_field').click()
        sleep(delayTime)
        check(driver, "cancel_button_field")
        driver.find_element_by_id('cancel_button_field').click()
    sleep(delayTime)
    print("2-2. try to make new room without room name")
    check(driver, "new_room_button_field")
    driver.find_element_by_id('new_room_button_field').click()
    sleep(delayTime)
    check(driver, "post_room_button_field")
    driver.find_element_by_id('post_room_button_field').click()
    sleep(delayTime)
    alert(driver, "Please input correctly")
    driver.find_element_by_id('cancel_button_field').click()
    print("2-3. make three new room")
    for t in range(1,4):
        check(driver, "new_room_button_field")
        driver.find_element_by_id('new_room_button_field').click()
        sleep(delayTime)
        roomName = "myroom"+str(t)
        check(driver, "input_room_name_field")
        driver.find_element_by_id("input_room_name_field").send_keys(roomName)
        driver.find_element_by_id('post_room_button_field').click()
        sleep(delayTime*2)
   
    print("2-4.check # of people in the room & room name") 
    for t in range(1,4):
        roomName = "myroom"+str(t)
        try:
            res = requests.get(link+"chatroom/", auth=(uname,upwd))
            if res.status_code != 200:
                print("ERROR: Should not found {0} : code {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
                exit(1)
        except Exception:
            print("ERROR: Cannot get {0}".format(link))
        roomId = "room"+str(res.json()[t-4]['id'])
        # check num=1 & roomName
        check(driver, roomId+"_user_num_field")
        check(driver, roomId+"_name_field")
        if driver.find_element_by_id(roomId+"_user_num_field").text != str(1):
            print("number of people in the chatroom "+str(t)+" isn't 1")
            exit(1)
        elif driver.find_element_by_id(roomId+"_name_field").text != roomName:
            print("Name of the chatroom "+str(t)+" isn't correct")
            exit(1)
    sleep(delayTime)
    roomId = "room"
    for t in range(1,4):
        try:
            res = requests.get(link+"chatroom/", auth=(uname,upwd))
            if res.status_code != 200:
                print("ERROR: Should not found {0} : code {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
                exit(1)
        except Exception:
            print("ERROR: Cannot get {0}".format(link))
        roomId = "room"+str(res.json()[t-4]['id'])

        check(driver, roomId+"_join_field")
        check(driver, roomId+"_chat_field")
        driver.find_element_by_id(roomId+"_join_field").click()
        sleep(delayTime)
        alert(driver,"You already join in this room")
    sleep(delayTime)
    driver.find_element_by_id(roomId+"_chat_field").click()
    sleep(delayTime)
    check(driver, "change_room_button_field")
    driver.find_element_by_id("change_room_button_field").click()
    sleep(delayTime)
    return roomId[4:]

def joinUserVerification(driver, link, uname, upwd, roomId): 
    check(driver, "room"+roomId+"_chat_field")
    driver.find_element_by_id("room"+roomId+"_chat_field").click()
    sleep(delayTime)
    try:
        res = requests.get(link+"chatroom/"+roomId+"/user/", auth=(uname, upwd))
        if res.status_code != 200:
           print("ERROR: Should not found {0} : code {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
           exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
    print("3-1 check whether you joined in the chat room")
    userId= res.json()[-1]['id']
    check(driver, "u"+str(userId)+"_username_field")
    if driver.find_element_by_id("u"+str(userId)+"_username_field" ).text  != uname:
        print("You are not in the chatroom!")
        exit(1)
    
def sendTextVerification(driver, link, uname, upwd, roomId):
    check(driver, 'post_text_button_field')
    driver.find_element_by_id("post_text_button_field").click()
    sleep(delayTime)
    alert(driver, "Please input message correctly") 
    sleep(delayTime)
    print("4-1. send messages")
    check(driver, 'input_text_field')
    textCont= "text1"
    driver.find_element_by_id("input_text_field").send_keys(textCont)
    driver.find_element_by_id("post_text_button_field").click()
    sleep(delayTime)
    try:
        res = requests.get(link+"chatroom/"+roomId+"/text/", auth=(uname, upwd)) 
        if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id = {2}, pwd = {3}".format(link+"chatroom/"+roomId+"/text/", res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        exit(1)
    print("4-2. get messages")
    sleep(delayTime)
    textId=res.json()[-1]['id']
    check(driver, "t"+str(textId)+"_text_field")
    check(driver, "t"+str(textId)+"_writer_field")
    if driver.find_element_by_id("t"+str(textId)+"_text_field").text != textCont:
        print("Text message isn't match!")
        exit(1)
    elif driver.find_element_by_id("t"+str(textId)+"_writer_field").text != uname:
        print("Text writer isn't match!")
        exit(1)
"""
def signOutVerification(driver):
    check(driver, "sign_out")
    driver.find_element_by_id("sign_out").click()"""

def B_chatRoomVerification(driver, roomId):
    # in the ~/main/
    check(driver, "chat_button_field")
    driver.find_element_by_id('chat_button_field').click()
    sleep(delayTime)
    # in the ~/room/
    check(driver, "room"+roomId+"_chat_field")
    driver.find_element_by_id('room'+roomId+'_chat_field').click()
    sleep(delayTime)
    check(driver, "input_text_field")
    check(driver, "post_text_button_field")
    driver.find_element_by_id("input_text_field").send_keys("this text cannot be sent")
    driver.find_element_by_id('post_text_button_field').click()
    sleep(delayTime)
    alert(driver, "You didn't join in this room. Please join in first.") 
    sleep(delayTime*2)
    print("2-1. join the room")
    # at room list 
    check(driver, "room"+roomId+"_join_field")
    driver.find_element_by_id("room"+roomId+"_join_field").click()
    sleep(delayTime)
    check(driver, "room"+roomId+"_user_num_field")
    if driver.find_element_by_id("room"+roomId+"_user_num_field").text != str(2):
        print("# of people in the chatroom1 isn't correct")
        exit(1)
    check(driver, "room"+roomId+"_chat_field")
    driver.find_element_by_id('room'+roomId+'_chat_field').click()
   
def B_sendTextVerification(driver, link, uname, upwd, roomId ):
    print("get messages")
    try:
       res = requests.get(link+"chatroom/"+roomId+"/user/", auth=(uname, upwd))
       if res.status_code != 200:
         print("ERROR: Cannot get {0} : {1}, id = {2}, pwd= {3}".format(link+"chatroom/"+roomId+"/user/", res.status_code, uname, upwd))
         exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        sleep(delayTime)
    userId=res.json()[-1]['id']
    sleep(delayTime)
    check(driver, "u"+str(userId)+"_username_field")
    if driver.find_element_by_id("u"+str(userId)+"_username_field").text != uname:
        print("Text writer isn't match!")
        exit(1)

    print("send message")
    check(driver, "input_text_field")
    check(driver, "input_text_field")
    check(driver, "post_text_button_field")
    textCont= "text2"
    driver.find_element_by_id("input_text_field").send_keys(textCont)
    driver.find_element_by_id("post_text_button_field").click()
    sleep(delayTime)
    try:
        res = requests.get(link+"chatroom/"+roomId+"/text/", auth=(uname, upwd)) 
        if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
    sleep(delayTime)
    textId=res.json()[0]['id']
    sleep(delayTime)
    sleep(delayTime)
    check(driver, "t"+str(textId)+"_text_field")
    check(driver, "t"+str(textId)+"_writer_field")
    if driver.find_element_by_id("t"+str(textId)+"_text_field").text != textCont:
        print("Text message isn't match!")
        exit(1)
    elif driver.find_element_by_id("t"+str(textId)+"_writer_field").text != uname:
        print("Text writer isn't match!")
        exit(1)


