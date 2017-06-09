from time import sleep
import sys
import http, base64
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

from backend_ import *

delayTime = 1.5
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
    sleep(delayTime)
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
    alert(driver, "Enter the username")
    # no password
    driver.find_element_by_id('username_field').send_keys('test')
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "Enter the password")
    # no pwd verification
    driver.find_element_by_id('password_field').send_keys('testpasswd')
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "Enter the password verification")
    # password not matching
    driver.find_element_by_id('pwdverification_field').send_keys('testpasswd_diff')
    driver.find_element_by_id('sign_up').click()
    sleep(delayTime)
    alert(driver, "Password does not match")

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
        alert(driver, "This username already exists")

#####MAIN PAGE#####
# article view verification
def articleVerification(driver, article):
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
    check(driver, replyId)
    check(driver, likeButtonId)
    check(driver, replyButtonId)
    check(driver, detailId) # component check finished
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

## like, edit, delete, detail button verification
def likeVerification(driver, article_id, isClicked):
    likeId = "a"+str(article_id)+"_like_button_field"
    check(driver, likeId)
    driver.find_element_by_id(likeId).click()
    sleep(delayTime)
    if isClicked == True:
        alert(driver, "You cannot like this post!")

def replyVerification(driver, article_id, text):
    replyId = "a"+str(article_id)+"_reply_button_field"
    check(driver, replyId)
    driver.find_element_by_id(replyId).click()
    sleep(delayTime)
    writePageVerification(driver, text)

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
    alert(driver, "This is not your article!")

def deleteErrorVerification(driver, article_id):
    deleteId = "a"+str(article_id)+"_delete_button_field"
    check(driver, deleteId)
    driver.find_element_by_id(deleteId).click()
    sleep(delayTime)
    alert(driver, "This is not your article")

## main page rendering test
def mainPageVerification(driver, articles):
    sleep(delayTime)
    check(driver, "article_list_field")
    check(driver, "write_button_field")
    check(driver, "to_my_wall")
    for article in articles:
        articleVerification(driver, article)

#####WRITE PAGE#####
# write page verification (article, not reply)
def writePageVerification(driver, text):
    sleep(delayTime)
    check(driver, "add_article_field")
    check(driver, "post_text_field")
    check(driver, "post_button_field") # check rendering
    driver.find_element_by_id("post_text_field").send_keys(text)
    driver.find_element_by_id("post_button_field").click()

#####DETAIL PAGE#####
def detailPageVerification(driver, article, replies):
    articleVerification(driver, article)
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
        articleVerification(driver, article)

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
    sleep(delayTime)

def profileURLVerification(driver, frontend_link, profuser):
    if driver.current_url != frontend_link+"profile/"+profuser+"/":
        print("Profile page URL does not match with {0}".format(profuser))
        exit(1)

def friendToAddFriend(driver):
    check(driver, "add_friend_button_field")
    driver.find_element_by_id("add_friend_button_field").click()
    sleep(delayTime)

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
    sleep(delayTime*2)

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
    sleep(delayTime)
