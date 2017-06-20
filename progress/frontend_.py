"""
DESCRIPTION
이 파일은 프론트엔드 테스트에서 사용할 함수를 정의하기 위해 만들어진 파이썬 파일입니다.
이 파일에서는 테스트를 실행하는 코드를 작성하지 마세요.
"""

from time import sleep
import sys
import http, base64
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

from backend_ import *

delayTime = 2
# 특정 id를 가진 컴퍼넌트가 존재하는지 확인
def check(driver, name):
    try:
        itm = driver.find_element_by_id(name)
    except NoSuchElementException:
        print("Cannot find %s" % name)
        exit(1)

# alert 확인
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


#####SIGN IN PAGE#####
# sign in page의 렌더링 확인
def signInPageVerification(driver):
    check(driver, "username_field")
    check(driver, "password_field")
    check(driver, "sign_in")
    check(driver, "sign_up")

# 로그인 관련 전반적인 기능 확인
def signInVerification(driver, username, password):
    signInPageVerification(driver)
    driver.find_element_by_id("username_field").clear() # reset username field
    driver.find_element_by_id("password_field").clear() # reset password field
    driver.find_element_by_id("sign_in").click()
    sleep(delayTime)
    alert(driver, "그런 려권은 없는데?")
    driver.find_element_by_id("username_field").send_keys(username)
    driver.find_element_by_id("sign_in").click()
    sleep(delayTime)
    alert(driver, "그런 려권은 없는데?")
    driver.find_element_by_id("password_field").send_keys(password)
    driver.find_element_by_id("sign_in").click()
    sleep(delayTime)
#alert(driver, "Succeed to sign in! :)")

#####SIGN OUT CHECK#####
def signOutVerification(driver, username):
    check(driver, "sign_out")
    check(driver, "user_data_field")
    if driver.find_element_by_id("user_data_field").text != username + " 동무 어서오시오!":
        print("username does not match!")
        exit(1)
    driver.find_element_by_id("sign_out").click()
    sleep(delayTime*2)
    signInPageVerification(driver)

#####SIGN UP CHECK#####
def signUpPageVerification(driver):
    check(driver, 'username_field')
    check(driver, 'password_field')
    check(driver, 'pwdverification_field')
    check(driver, 'to_main')

def signUpAlertVerification(driver, username, password):
    # no username
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "아이디를 입력하시오!")
    # no password
    driver.find_element_by_id('username_field').send_keys('test')
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "비밀번호를 입력하시오!")
    # no pwd verification
    driver.find_element_by_id('password_field').send_keys('testpasswd')
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "비밀번호를 확인하시오!")
    # password not matching
    driver.find_element_by_id('pwdverification_field').send_keys('testpasswd_diff')
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "비밀번호가 일치하지 않소!")

def signUpVerification(driver, testNum):
    signUpPageVerification(driver)
    username='test'+str(testNum)
    password = username + 'passwd'
    driver.find_element_by_id('username_field').clear()
    driver.find_element_by_id('password_field').clear()
    driver.find_element_by_id('pwdverification_field').clear()
    signUpAlertVerification(driver, username, password)
    driver.find_element_by_id('to_main').click()
    sleep(delayTime)
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    driver.find_element_by_id('username_field').send_keys(username)
    driver.find_element_by_id('password_field').send_keys(password)
    driver.find_element_by_id('pwdverification_field').send_keys(password)
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    if testNum < 10:
        alert(driver, "이미 같은 성명이 있소.")

#####MAIN PAGE#####
# article view verification
def articleVerification(driver, article, depth):
    articleId = "a"+str(article["id"])+"_field"
    writerId = "a"+str(article["id"])+"_writer_field"
    textId = "a"+str(article["id"])+"_text_field"
    createdId = "a"+str(article["id"])+"_created_field"
    updatedId = "a"+str(article["id"])+"_updated_field"
    detailId = "a"+str(article["id"])+"_detail_button_field"
    likeId = "a"+str(article["id"])+"_like_field"
    likeButtonId = "a"+str(article["id"])+"_like_button_field"
    replyId = "a"+str(article["id"])+"_reply_field"
    replyButtonId = "a"+str(article["id"])+"_reply_button_field" # ids in article component
    check(driver, articleId)
    check(driver, writerId)
    check(driver, textId)
    check(driver, createdId)
    check(driver, updatedId)
    check(driver, likeId)
    if depth < 2:
        check(driver, replyId)
    check(driver, likeButtonId)
    if depth == 1:
        check(driver, replyButtonId)
    if depth == 0:
        check(driver, detailId) # component check finished
    #Contents checking
    if driver.find_element_by_id(writerId).text != article["owner"]:
        print("Owner not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(textId).text != article["text"].replace('\r', ''):
        print("Text not match on article %d" % article["id"])
        print(driver.find_element_by_id(textId).text)
        print(article["text"])
        exit(1)
    elif driver.find_element_by_id(likeId).text != str(article["like_num"]):
        print("Like num not match on article %d" % article["id"])
        exit(1)
    elif depth < 2 and driver.find_element_by_id(replyId).text != str(article["children_num"]):
        print("Reply num not match on article %d" % article["id"])
        exit(1)

## like, edit, delete, detail button verification
def likeVerification(driver, article_id, isClicked):
    likeId = "a"+str(article_id)+"_like_button_field"
    check(driver, likeId)
    driver.find_element_by_id(likeId).click()
    sleep(delayTime)
    if isClicked == True:
        alert(driver, "동무는 이 글을 더이상 좋아할 수 없소.")

def replyVerification(driver, article_id, text):
    detailId = "a"+str(article_id)+"_detail_button_field"
    check(driver, detailId)
    driver.find_element_by_id(detailId).click()
    sleep(delayTime)
    writeVerification(driver, text)

def editVerification(driver, article_id, text):
    editId = "a"+str(article_id)+"_edit_button_field"
    check(driver, editId)
    driver.find_element_by_id(editId).click()
    sleep(delayTime)
    check(driver, "edit_article_field")
    check(driver, "edit_text_field")
    check(driver, "edit_button_field")
    driver.find_element_by_id("edit_text_field").send_keys(text)
    driver.find_element_by_id("edit_button_field").click()

def deleteVerification(driver, article_id):
    deleteId = "a"+str(article_id)+"_delete_button_field"
    check(driver, deleteId)
    driver.find_element_by_id(deleteId).click()

def detailVerification(driver, article_id):
    detailId = "a"+str(article_id)+"_detail_button_field"
    check(driver, detailId)
    driver.find_element_by_id(detailId).click()
    sleep(delayTime)

## error checking functions for edit and delete
def editErrorVerification(driver, article_id):
    editId = "a"+str(article_id)+"_edit_button_field"
    check(driver, editId)
    driver.find_element_by_id(editId).click()
    sleep(delayTime)
    alert(driver, "당신 글이 아니오!")

def deleteErrorVerification(driver, article_id):
    deleteId = "a"+str(article_id)+"_delete_button_field"
    check(driver, deleteId)
    driver.find_element_by_id(deleteId).click()
    sleep(delayTime)
    alert(driver, "당신의 글이 아니오.")

## main page rendering test
def mainPageVerification(driver, articles):
    sleep(delayTime)
    check(driver, "article_list_field")
    check(driver, "to_my_wall")
    check(driver, 'chat_button_field')
    for article in articles:
        articleVerification(driver, article, 0)

#####WRITE PAGE#####
# write page verification (article, not reply)
def writeVerification(driver, text):
    check(driver, "add_article_field")
    check(driver, "post_text_field")
    check(driver, "post_button_field") # check rendering
    driver.find_element_by_id("post_text_field").send_keys(text)
    driver.find_element_by_id("post_button_field").click()
"""def writePageVerification(driver, text):
    sleep(delayTime)
    check(driver, "add_article_field")
    check(driver, "post_text_field")
    check(driver, "post_button_field") # check rendering
    driver.find_element_by_id("post_text_field").send_keys(text)
    driver.find_element_by_id("post_button_field").click()"""

#####DETAIL PAGE#####
def detailPageVerification(driver, article, replies):
    articleVerification(driver, article, 0)
    check(driver, "to_main_page_field")
    check(driver, "reply_list_field")
    for reply in replies:
        replyArticleVerification(driver, reply)

def replyArticleVerification(driver, article):
    articleId = "a"+str(article["id"])+"_field"
    writerId = "a"+str(article["id"])+"_writer_field"
    textId = "a"+str(article["id"])+"_text_field"
    createdId = "a"+str(article["id"])+"_created_field"
    updatedId = "a"+str(article["id"])+"_updated_field"
    likeId = "a"+str(article["id"])+"_like_field"
    likeButtonId = "a"+str(article["id"])+"_like_button_field"
    replyId = "a"+str(article["id"])+"_reply_field"
    replyButtonId = "a"+str(article["id"])+"_reply_button_field" # ids in article component
    check(driver, articleId)
    check(driver, writerId)
    check(driver, textId)
    check(driver, createdId)
    check(driver, updatedId)
    check(driver, likeId)
    check(driver, replyId)
    check(driver, likeButtonId)
    check(driver, replyButtonId)
    #Contents checking
    if driver.find_element_by_id(writerId).text != "id: "+article["owner"]:
        print("Owner not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(textId).text != article["text"]:
        print("Text not match on article %d" % article["id"])
        print(driver.find_element_by_id(textId).text)
        print(article["text"])
        exit(1)
    elif driver.find_element_by_id(likeId).text != str(article["like_num"]):
        print("Like num not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(replyId).text != str(article["children_num"]):
        print("Reply num not match on article %d" % article["id"])
        exit(1)

#####WALL PAGE#####
def wallPageVerification(driver, articles, username):
    check(driver, "wall_info")
    if driver.find_element_by_id('wall_info').text != username+"의 담벼락":
        print("username not match")
        exit(1)
    for article in articles:
        labelId = "a"+str(article["id"])+"_label"
        label = ""
        if article["owner"] != username:
            label = "가 좋아요한 글입니다."
        elif article["depth"] > 0:
            label = "가 작성한 댓글입니다."
        else:
            label = "가 작성한 글입니다."
        check(driver, labelId)
        if driver.find_element_by_id(labelId).text != username+label:
            print("label not match")
            print(username+label)
            print(driver.find_element_by_id(labelId).text)
            exit(1)
        #articleVerification(driver, article, article["depth"])

def wallArticleVerification(driver, article):
    articleId = "a"+str(article["id"])+"_field"
    writerId = "a"+str(article["id"])+"_writer_field"
    textId = "a"+str(article["id"])+"_text_field"
    createdId = "a"+str(article["id"])+"_created_field"
    updatedId = "a"+str(article["id"])+"_updated_field"
    detailId = "a"+str(article["id"])+"_detail_button_field"
    likeId = "a"+str(article["id"])+"_like_field"
    replyId = "a"+str(article["id"])+"_reply_field"
    check(driver, articleId)
    check(driver, writerId)
    check(driver, textId)
    check(driver, createdId)
    check(driver, updatedId)
    check(driver, likeId)
    check(driver, detailId) # component check finished
    #Contents checking
    if driver.find_element_by_id(writerId).text != article["owner"]:
        print("Owner not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(textId).text != article["text"].replace('\r', ''):
        print("Text not match on article %d" % article["id"])
        print(driver.find_element_by_id(textId).text)
        print(article["text"])
        exit(1)
    elif driver.find_element_by_id(likeId).text != str(article["like_num"]):
        print("Like num not match on article %d" % article["id"])
        exit(1)
    elif depth < 2 and driver.find_element_by_id(replyId).text != str(article["children_num"]):
        print("Reply num not match on article %d" % article["id"])
        exit(1)

#####FRIEND PAGE#####
def toMyProfile(driver):
    check(driver, "to_my_profile")
    driver.find_element_by_id("to_my_profile").click()
    sleep(delayTime)

def profileToFriend(driver):
    check(driver, "friend_list_button_field")
    driver.find_element_by_id("friend_list_button_field").click()
    sleep(delayTime)

def profileToAddFriend(driver):
    check(driver, "friend_add_button_field")
    driver.find_element_by_id("friend_add_button_field").click()
    sleep(delayTime*2)

def profileURLVerification(driver, frontend_link, profuser):
    if driver.current_url != frontend_link+"profile/"+profuser+"/":
        print("Profile page URL does not match with {0}".format(profuser))
        exit(1)

def friendToAddFriend(driver):
    check(driver, "add_friend_button_field")
    driver.find_element_by_id("add_friend_button_field").click()
    sleep(delayTime*2)

def friendToNameProfile(driver, username):
    check(driver, "f_"+username+"_name_field")
    driver.find_element_by_id("f_"+username+"_name_field").click()
    sleep(delayTime)

def friendNoListVerification(driver):
    sleep(delayTime)
    check(driver, "f_list_field")
    if driver.find_element_by_id("f_list_field").text != "자네에게는 아직 동무가 없다우. 다른 인민들에게 동무가 되자고 요청을 보내보라우.":
        print("No friend list message does not match")
        exit(1)

def friendURLVerification(driver, frontend_link, profuser):
    if driver.current_url != frontend_link+"friend/"+profuser+"/":
        print("Friend page URL does not match with {0}".format(profuser))
        exit(1)

def addFriendToBack(driver, profuser):
    check(driver, "fr_"+profuser+"_back_button_field")
    driver.find_element_by_id("fr_"+profuser+"_back_button_field").click()
    sleep(delayTime)

def addFriendToFriend(driver, profuser):
    check(driver, "fr_"+profuser+"_friend_button_field")
    driver.find_element_by_id("fr_"+profuser+"_friend_button_field").click()
    sleep(delayTime)

def addFriendToOk(driver, username):
    check(driver, "fr_"+username+"_ok_button_field")
    driver.find_element_by_id("fr_"+username+"_ok_button_field").click()
    sleep(delayTime*2)

def addFriendToDecline(driver, username):
    check(driver, "fr_"+username+"_decline_button_field")
    driver.find_element_by_id("fr_"+username+"_decline_button_field").click()
    sleep(delayTime*3)

def addFriendToNameProfile(driver, username):
    check(driver, "fr_"+username+"_name_field")
    driver.find_element_by_id("fr_"+username+"_name_field").click()
    sleep(delayTime)

def addFriendNoListVerification(driver):
    sleep(delayTime)
    check(driver, "fr_list_field")
    if driver.find_element_by_id("fr_list_field").text != "아, 자네에게 온 요청이 없다우.":
        print("No friend request list message does not match")
        exit(1)

def addFriendToMRDecline(driver, username):
    check(driver, "mr_"+username+"_decline_field")
    driver.find_element_by_id("mr_"+username+"_decline_field").click()
    sleep(delayTime*2)

def addFriendToMRNameProfile(driver, username):
    check(driver, "mr_"+username+"_name_field")
    driver.find_element_by_id("mr_"+username+"_name_field").click()
    sleep(delayTime)

def addFriendMRNoListVerification(driver):
    sleep(delayTime)
    check(driver, "mr_list_field")
    if driver.find_element_by_id("mr_list_field").text != "아, 자네는 아무에게도 요청을 보내지 않았다우.":
        print("No my request list message does not match")
        exit(1)

def toAddFriend(driver, frontend_link, username):
    driver.get(frontend_link+"addfriend/"+username+"/")
    sleep(delayTime*3)

#####PROFILE PAGE#####
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
    alert(driver, "제대로 입력하시오.")
    driver.find_element_by_id('cancel_button_field').click()
    sleep(delayTime)
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
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    sleep(delayTime)
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

        check(driver, roomId+"_quit_field")
        check(driver, roomId+"_chat_field")
        if t != 3:
            driver.find_element_by_id(roomId+"_quit_field").click()
        sleep(delayTime)
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
    alert(driver, "제대로 된 입력을 주시오.")
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

def B_chatRoomVerification(driver, roomId):
    # in the ~/main/
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    sleep(delayTime)
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
    alert(driver, "참여하고 얘기하시오.")
    sleep(delayTime*2)
    print("2-1. join the room")
    # at room list
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    sleep(delayTime)
    check(driver, "room"+roomId+"_join_field")
    driver.find_element_by_id("room"+roomId+"_join_field").click()
    sleep(delayTime*2)
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
#####PROFILE PAGE#####
def changeProfile_T(driver, text1, text2, text3):
    check(driver, "change_detail_button_field")
    driver.find_element_by_id("change_detail_button_field").click()
    sleep(delayTime)
    check(driver, "myname")
    check(driver, "mybelong")
    check(driver, "myintro")
    check(driver, "change_intro")
    driver.find_element_by_id("myname").send_keys(text1)
    driver.find_element_by_id("mybelong").send_keys(text2)
    driver.find_element_by_id("myintro").send_keys(text3)
    driver.find_element_by_id("change_intro").click()
    sleep(delayTime)
    check(driver, "p_name")
    check(driver, "p_belong")
    check(driver, "p_intro")
    if "이름:"+text1 != driver.find_element_by_id("p_name").text:
        print("content isn't match")
        exit(1)
    if "소속:"+text2 != driver.find_element_by_id("p_belong").text:
        print("content isn't match")
        exit(1)
    if "소개말:"+text3 != driver.find_element_by_id("p_intro").text:
        print("content isn't match")
        exit(1)
def changeProfile_F(driver):
    check(driver, "change_detail_button_field")
    driver.find_element_by_id("change_detail_button_field").click()
    sleep(delayTime)
    alert(driver, "남의 려권 입니다.")

def changePW_T(driver,uname, oldpw, newpw):
    check(driver, "change_pw_button_field")
    driver.find_element_by_id("change_pw_button_field").click()
    sleep(delayTime)
    check(driver, "curr_pw")
    check(driver, "new_pw")
    check(driver, "new_pw_RE")
    check(driver, "change_pw")
    driver.find_element_by_id("curr_pw").send_keys(oldpw)
    driver.find_element_by_id("new_pw").send_keys(newpw)
    driver.find_element_by_id("new_pw_RE").send_keys(newpw)
    driver.find_element_by_id("change_pw").click()
    sleep(delayTime)
    signInPageVerification(driver)
    driver.find_element_by_id("username_field").send_keys(uname)
    driver.find_element_by_id("password_field").send_keys(oldpw)
    driver.find_element_by_id("sign_in").click()
    sleep(delayTime)
    alert(driver, "그런 려권은 없는데?")
    sleep(delayTime)
    driver.find_element_by_id("username_field").clear()
    driver.find_element_by_id("password_field").clear()
    driver.find_element_by_id("username_field").send_keys(uname)
    driver.find_element_by_id("password_field").send_keys(newpw)
    driver.find_element_by_id("sign_in").click()
    sleep(delayTime)
    check(driver, "sign_out")

def changePW_F(driver):
    check(driver, "change_pw_button_field")
    driver.find_element_by_id("change_pw_button_field").click()
    sleep(delayTime)
    alert(driver, "남의 려권 입니다.")
    sleep(delayTime)

def escapeBook_T(driver, uname, upwd):
    check(driver, "escape_account_button_field")
    driver.find_element_by_id("escape_account_button_field").click()
    sleep(delayTime)
    check(driver, "escape_book")
    driver.find_element_by_id("escape_book").click()
    sleep(1)
    sleep(1)
    driver.find_element_by_id("username_field").send_keys(uname)
    driver.find_element_by_id("password_field").send_keys(upwd)
    driver.find_element_by_id("sign_in").click()
    sleep(delayTime)
    alert(driver, "그런 려권은 없는데?")

def escapeBook_F(driver):
    check(driver, "escape_account_button_field")
    driver.find_element_by_id("escape_account_button_field").click()
    sleep(delayTime)
    alert(driver, "탈Book할거면 너나해ㅡㅡ")
    sleep(delayTime)

def Sasang(driver, status, text):
    check(driver, status)
    if driver.find_element_by_id(status).text != text:
        print(status+" does not match with "+text)
        exit(1)
    sleep(delayTime)

def mySasang(driver, statusnum, username, num):
    sleep(delayTime)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    sleep(delayTime)
    check(driver, 'sasang_status_'+statusnum)
    if driver.find_element_by_id('sasang_status_'+statusnum).text != '지금까지 '+username+'와 총사상검증 횟수는 '+num+'번이오!':
        print("my sasang_status does not correct")
        exit(1)
    sleep(delayTime)

def yourSasang(driver,num):
    sleep(delayTime)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    sleep(delayTime)
    check(driver, 'sasang_status')
    if driver.find_element_by_id('sasang_status').text != '지금까지 총사상검증 횟수는 '+num+'번이오!':
        print("sasang_status does not correct")
        exit(1)
    sleep(delayTime)

def get_with_zoom(driver, url, zoom):
    driver.get(url)
    driver.execute_script("document.body.style.zoom=\'"+zoom+"%\'")
    sleep(delayTime)

def click_with_zoom(driver, com_id, zoom):
    driver.execute_script("document.body.style.zoom=\'"+zoom+"%\'")
    check(driver, com_id)
    element=driver.find_element_by_id(com_id).click()
    driver.execute_script("arguments[0].click();", element)
    sleep(delayTime)

