import time
import sys
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
            return
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
    alertMessageVerification(driver, "Enter the username")
    time.sleep(1)
    Alert(driver).accept()
    # no password
    driver.find_element_by_id('username_field').send_keys('test1')
    driver.find_element_by_id('sign_up').click()
    alertMessageVerification(driver, "Enter the password")
    time.sleep(1)
    Alert(driver).accept()
    # no pwd verification
    driver.find_element_by_id('password_field').send_keys('test1passwd')
    driver.find_element_by_id('sign_up').click()
    alertMessageVerification(driver, "Enter the password verification")
    time.sleep(1)
    Alert(driver).accept()
    # password not matching
    driver.find_element_by_id('pwdverification_field').send_keys('test1passwd_diff')
    driver.find_element_by_id('sign_up').click()
    alertMessageVerification(driver, "Password does not match")
    time.sleep(1)
    Alert(driver).accept()

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
    alertMessageVerification(driver, "Username already exist! Try again!" if testNum<= 10 else "Succeed to sign up!")

driver = webdriver.Chrome('/usr/local/bin/chromedriver')
driver.get(sys.argv[1])
check(driver, 'sign_up')
time.sleep(1)

driver.find_element_by_id('sign_up').click()
time.sleep(1)
signUpPageVerification(driver)
signUpAlertVerification(driver)
for i in range(1, 12):
    signUpPostVerification(driver, i)

driver.quit()
print("Successful!")
