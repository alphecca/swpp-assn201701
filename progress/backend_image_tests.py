import json
import requests
import sys
from time import sleep
from random import randint
from backend_ import *
import os
import base64
#from poster.encode import MultiParam

if len(sys.argv) != 2:
    print("backend_image_tests.py <url>")
    print("Example: backend_images_tests.py http://wlxyzlw.iptime.org:8000/")
    exit(1)

userN = 10
user_pairs = create_users(userN)
unknownname = 'unknown_user'
unknownpwd = 'unknown_userpwd'

user_link = sys.argv[1] + 'users/'
article_link = sys.argv[1] + 'article/'

print("0. Checking url. (If the program stops, quit with CONTROL-C.)")
forbidden_or_error_anon("GET", user_link) # Check if the url is valid.
forbidden_or_error_anon('GET', article_link)

print("1. Creating new users")
try:
    for i in range(1,userN+1):
        username = "test{0}".format(i)
        pwd = "test{0}passwd".format(i)
        res = requests.delete(user_link, auth=(username, pwd))
    for i in range(5):
         requests.delete(user_link, auth=("test{0}".format(i), "newtest{0}passwd".format(i)))
except Exception:
    pass

for i in range(1,userN):
    username = "test{0}".format(i)
    password = "test{0}passwd".format(i)
    body = {"username": username.encode("ascii"), "password": password.encode("ascii")} #encoded
    post_or_error_anon(user_link, body)
    method_not_allowed_or_error_anon_data("POST", user_link, body)

print("2. GET & POST image article list.")
img = {"image0": ('testImage.png', open('testImage.png', 'rb'), 'image/png')}
data = {"text": "test"}
#post_or_error(article_link, data, user_pairs[0][0], user_pairs[0][1])
post_image_or_error(article_link, img, data, user_pairs[0][0], user_pairs[0][1])
data = get_json_or_error(article_link, 'test2', 'test2passwd')
#forbidden_image_or_error(article_link, img, data)

print("3. GET & POST image reply")
articleId = str(data[0]["id"])
#forbidden_image_or_error(article_link+articleId+'/article/', img, data)
post_image_or_error(article_link+articleId+'/article/', img, data, user_pairs[0][0], user_pairs[0][1])
get_json_or_error(article_link+articleId+'/article/', 'test2', 'test2passwd')

print("Final. Deleting all data that test has created.")
for user in user_pairs:
    delete_or_error(user_link, user[0], user[1])
