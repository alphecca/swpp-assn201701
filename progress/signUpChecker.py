import time
import sys
import http, base64
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
from selenium.webdriver.common.alert import Alert

if len(sys.argv) != 2:
    print("signUpChecker.py <url>")
    exit(1)

def check(driver, name):
    try:
        itm = driver.find_element_by_id(name)
    except NoSuchElementException:
        print("Cannot find %s" % name)
        exit(1)

def alertMessageVerification(driver, text):
    try:
        if Alert(driver).text == text:
            Alert(driver).accept()
        else:
            print("Alert message invalid: message should be [%s] but it's [%s]" %(text, Alert(driver).text))
            exit(1)
    except NoAlertPresentException:
        print("no alert")
        exit(1)

# SignUpPage element check
def signUpPageVerification(driver):
    check(driver, 'username_field')
    check(driver, 'password_field')
    check(driver, 'pwdverification_field')
    time.sleep(1)

# SignUpPage alert check
def signUpAlertVerification(driver):
    # no username
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    alertMessageVerification(driver, "Enter the username")
    # no password
    driver.find_element_by_id('username_field').send_keys('test1')
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    alertMessageVerification(driver, "Enter the password")
    # no pwd verification
    driver.find_element_by_id('password_field').send_keys('test1passwd')
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    alertMessageVerification(driver, "Enter the password verification")
    # password not matching
    driver.find_element_by_id('pwdverification_field').send_keys('test1passwd_diff')
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    alertMessageVerification(driver, "Password does not match")

def signUpPostVerification(driver, testNum):
    driver.find_element_by_id('username_field').clear()
    driver.find_element_by_id('password_field').clear()
    driver.find_element_by_id('pwdverification_field').clear()
    username = 'test'+str(testNum)
    password = username + 'passwd'
    driver.find_element_by_id('username_field').send_keys(username)
    driver.find_element_by_id('password_field').send_keys(password)
    driver.find_element_by_id('pwdverification_field').send_keys(password)
    driver.find_element_by_id('sign_up').click()
    time.sleep(1)
    alertMessageVerification(driver, "Username already exist! Try again!" if testNum<= 9 else "Succeed to sign up!")

def deleteUser_test10():
    backend_url = "wlxyzlw.iptime.org"
    gui_url = "localhost"

    newUserAuth = base64.b64encode(b"test10:test10passwd").decode("ascii")
    requestServer = http.client.HTTPConnection(backend_url, 8000) # TODO if the port number is changed, please change this code.
    requestServer.request('DELETE', "/users/", headers={
        "Authorization": "Basic " + newUserAuth
    })

def signInOutPageVerification(driver, testNum):
    #signout
    driver.find_element_by_id('sign_out').click()
    time.sleep(1)
    #no id, no pw
    driver.find_element_by_id('sign_in').click()
    time.sleep(1)
    alertMessageVerification(driver, "Fail to sign in! Try again. :(")
    #no pw
    driver.find_element_by_id('username_field').send_keys('test1')
    driver.find_element_by_id('sign_in').click()
    time.sleep(1)
    alertMessageVerification(driver, "Fail to sign in! Try again. :(")
    #id, different pw
    username='test'+str(testNum)
    password=username
    driver.find_element_by_id('username_field').clear()
    driver.find_element_by_id('username_field').send_keys(username)
    driver.find_element_by_id('password_field').send_keys(password)
    driver.find_element_by_id('sign_in').click()
    time.sleep(1)
    alertMessageVerification(driver, "Fail to sign in! Try again. :(")
    #correct id, correct pw
    password=username+'passwd'
    driver.find_element_by_id('username_field').clear()
    driver.find_element_by_id('password_field').clear()
    driver.find_element_by_id('username_field').send_keys(username)
    driver.find_element_by_id('password_field').send_keys(password)
    driver.find_element_by_id('sign_in').click()
    time.sleep(1)
    alertMessageVerification(driver, "Succeed to sign in! :)")

deleteUser_test10()
driver = webdriver.Chrome('/usr/local/bin/chromedriver')
driver.get(sys.argv[1])

check(driver, 'sign_up')
time.sleep(1)

driver.find_element_by_id('sign_up').click()
time.sleep(1)
signUpPageVerification(driver)
signUpAlertVerification(driver)
for i in range(1, 11):
    signUpPostVerification(driver, i)

check (driver, 'sign_out')
i=1
signInOutPageVerification(driver, i)

driver.quit()
print("Successful!")
