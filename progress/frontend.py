import time
import sys
import http, base64
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

from backend import *

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
    except NoAlertPresentException:
        print("No Alert Error")
        exit(1)



#####SIGN IN PAGE#####
def signInPageVerification(driver):
    check(driver, "username_field")
    check(driver, "password_field")
    check(driver, "sign_in")
    check(driver, "sign_up") # sign in page의 rendering확인

def signInVerification(driver, username, password):
    signInPageVerification(driver)
    driver.find_element_by_id("username_field").clear() # reset username field
    driver.find_element_by_id("password_field").clear() # reset password field
    driver.find_element_by_id("sign_in").click()
    time.sleep(1)
    alert(driver, "User not exist!")
    driver.find_element_by_id("username_field").send_keys(username)
    driver.find_element_by_id("sign_in").click()
    time.sleep(1)
    alert(driver, "User not exist!")
    driver.find_element_by_id("password_field").send_keys(password)
    driver.find_element_by_id("sign_in").click()
    time.sleep(1)
    alert(driver, "Succeed to sign in! :)")

#####SIGN OUT CHECK#####
def signOutVerification(driver):
    check(driver, "sign_out")
    driver.find_element_by_id("sign_out").click()
    time.sleep(0.5)
    signInPageVerification(driver)

#####SIGN UP CHECK#####
def signUpPageVerification(driver):
    check(driver, 'username_field')
    check(driver, 'password_field')
    check(driver, 'pwdverification_field')

def signUpAlertVerification(driver, username, password):
    # no username
    driver.find_element_by_id('sign_up').click()
    time.sleep(0.5)
    alert(driver, "Enter the username")
    # no password
    driver.find_element_by_id('username_field').send_keys('test')
    driver.find_element_by_id('sign_up').click()
    time.sleep(0.5)
    alert(driver, "Enter the password")
    # no pwd verification
    driver.find_element_by_id('password_field').send_keys('testpasswd')
    driver.find_element_by_id('sign_up').click()
    time.sleep(0.5)
    alert(driver, "Enter the password verification")
    # password not matching
    driver.find_element_by_id('pwdverification_field').send_keys('testpasswd_diff')
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    alert(driver, "Password does not match")

def signUpVerification(driver, testNum):
    username = 'test'+str(testNum)
    password = username + 'passwd'
    driver.find_element_by_id('username_field').clear()
    driver.find_element_by_id('password_field').clear()
    driver.find_element_by_id('pwdverification_field').clear()
    signUpAlertVerification(driver, username, password)
    driver.find_element_by_id('username_field').clear()
    driver.find_element_by_id('password_field').clear()
    driver.find_element_by_id('pwdverification_field').clear()
    driver.find_element_by_id('username_field').send_keys(username)
    driver.find_element_by_id('password_field').send_keys(password)
    driver.find_element_by_id('pwdverification_field').send_keys(password)
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    if testNum < 10:
        alert(driver, "Unknown Error Occurred")

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
    if driver.find_element_by_id(writerId).text != "id: "+article["owner"]:
        print("Owner not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(textId).text != article["text"]:
        print("Text not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(createdId).text != "Created: "+article["created_time"]:
        print("Created time not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(updatedId).text != "Last update: "+article["updated_time"]:
        print("Updated time not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(likeId).text != str(article["like_num"]):
        print("Like num not match on article %d" % article["id"])
        exit(1)
    elif driver.find_element_by_id(replyId).text != str(article["children_num"]):
        print("Reply num not match on article %d" % article["id"])
        exit(1)

def likeVerification(driver, article_id, isClicked):
    likeId = "a"+str(article_id)+"_like_button_field"
    check(driver, likeId)
    driver.find_element_by_id(likeId).click()
    sleep(0.5)
    if isClicked == True:
        alert(driver, "You already like this post!")

def replyVerification(driver, article_id, text):
    replyId = "a"+str(article_id)+"_reply_button_field"
    check(driver, replyId)
    driver.find_element_by_id(replyId).click()
    sleep(0.5)
    writePageVerification(driver, text)

def editVerification(driver, article_id, text):
    editId = "a"+str(article_id)+"_edit_button_field"
    check(driver, editId)
    driver.find_element_by_id(editId).click()
    sleep(1)
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
    sleep(0.5)

def mainPageVerification(driver, articles):
    time.sleep(1)
    check(driver, "article_list_field")
    check(driver, "write_button_field")
    for article in articles:
        articleVerification(driver, article)

#####WRITE PAGE#####
# write page verification (article, not reply)
def writePageVerification(driver, text):
    time.sleep(1)
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
        articleVerification(driver, reply)
