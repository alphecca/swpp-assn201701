"""
DESCRIPTION
이 파일은 백엔드 테스트에서 사용할 함수를 정의하기 위해 만들어진 파이썬 파일입니다.
이 파일에서는 테스트를 실행하는 코드를 작성하지 마세요.
"""

import json
import requests
from time import sleep
from random import randint


# create test username and password on userlist (not on server)
def create_users(N):
    ls = []
    for i in range(1, N):
        ls.append(("test{0}".format(i), "test{0}passwd".format(i)))
    return ls

# get json data or print error
def get_json_or_error(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.get(link, auth=(uname, upwd))
        if res.status_code != 200:
            print("ERROR: Cannot get {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
        resjson = res.json()
        return resjson
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        exit(1)

# delete or print error
def delete_or_error(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.delete(link, auth=(uname, upwd))
        if res.status_code != 204:
            print("ERROR: Cannot delete {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot delete {0}".format(link))
        exit(1)

# delete or print error(response statusCode is 200)
def delete_or_error_200(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.delete(link, auth=(uname, upwd))
        if res.status_code != 200:
            print("ERROR: Cannot delete {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot delete {0}".format(link))
        exit(1)

# put data or error
def put_or_error(link, data, uname, upwd):
    sleep(0.05)
    try:
        res = requests.put(link, data=data, auth=(uname, upwd))
        if res.status_code != 200:
            print("ERROR: Cannot put {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
        resjson = res.json()
        return resjson
    except Exception:
        print("ERROR: Cannot put {0}".format(link))
        exit(1)

# send post to link or error
def post_or_error(link, data, uname, upwd):
    sleep(0.05)
    try:
        res = requests.post(link, data=data, auth=(uname, upwd))
        if res.status_code != 201:
            print("ERROR: Cannot post {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot post {0}".format(link))
        exit(1)

# error should be arised if anonymous user tries to post
def post_or_error_anon(link, data):
    sleep(0.05)
    try:
        res = requests.post(link, data=data)
        if res.status_code != 201:
            print("ERROR: Cannot post {0} : {1}".format(link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot post {0}".format(link))
        exit(1)

# not found error should be arised
def not_found_or_error(link, uname, upwd):
    sleep(0.05)
    try:
        res = requests.get(link, auth=(uname, upwd))
        if res.status_code != 404:
            print("ERROR: Should not found {0} : code {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot get {0}".format(link))
        exit(1)

# forbidden error should be arised
def forbidden_or_error(method, link, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, auth=(uname, upwd)) # If you want to test with other methods like POST, add elif code here.
        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} : code {2}, id = {3}, pwd = {4}".format(method, link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def forbidden_or_error_data(method, link, data, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, data=data, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, data=data, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, data=data, auth=(uname, upwd)) # If you want to test with other methods like POST, add elif code here.
        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} : code {2}, id = {3}, pwd = {4}".format(method, link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def forbidden_or_error_anon(method, link):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link)
        elif method == "DELETE":
            res = requests.delete(link)
        elif method == "POST":
            res = requests.post(link)
        elif method == "PUT":
            res = requests.put(link) # If you want to test with other methods like POST, add elif code here.
        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} with no auth : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def forbidden_or_error_anon_data(method, link, data):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data)
        elif method == "DELETE":
            res = requests.delete(link, data=data)
        elif method == "POST":
            res = requests.post(link, data=data)
        elif method == "PUT":
            res = requests.put(link, data=data)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 403:
            print("ERROR: Should not be allowed to {0} {1} with no auth : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def method_not_allowed_or_error_data(method, link, data, uname, upwd):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, data=data, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, data=data, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, data=data, auth=(uname, upwd))
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 405:
            print("ERROR: Should not be allowed to {0} {1} with duplicated username : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def method_not_allowed_or_error_anon_data(method, link, data):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data)
        elif method == "DELETE":
            res = requests.delete(link, data=data)
        elif method == "POST":
            res = requests.post(link, data=data)
        elif method == "PUT":
            res = requests.put(link, data=data)
# If you want to test with other methods like POST, add elif code here.

        if res.status_code != 405:
            print("ERROR: Should not be allowed to {0} {1} with duplicated username : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def bad_request_or_error_data(method, link, data, uname, upwd): 
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data, auth=(uname, upwd))
        elif method == "DELETE":
            res = requests.delete(link, data=data, auth=(uname, upwd))
        elif method == "POST":
            res = requests.post(link, data=data, auth=(uname, upwd))
        elif method == "PUT":
            res = requests.put(link, data=data, auth=(uname, upwd))
        if res.status_code != 400:
            print("ERROR: Should not be allowed to {0} {1} with bad request : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def bad_request_or_error_anon_data(method, link, data):
    sleep(0.05)
    try:
        if method == "GET":
            res = requests.get(link, data=data)
        elif method == "DELETE":
            res = requests.delete(link, data=data)
        elif method == "POST":
            res = requests.post(link, data=data)
        elif method == "PUT":
            res = requests.put(link, data=data) # If you want to test with other methods like POST, add elif code under here.
        if res.status_code != 400:
            print("ERROR: Should not be allowed to {0} {1} with bad request : code {2}".format(method, link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot {0} {1}".format(method, link))
        exit(1)

def check_key(homepage_json, key):
    if key not in homepage_json:
        print("{0} not in {1}.".format((key, homepage_json)))
        exit(1)

# image article post
def post_image_or_error(link, img, data, uname, upwd):
    sleep(0.05)
    try:
        res = requests.post(link, files=img, data=data, auth=(uname, upwd))
        if res.status_code != 201:
            print("ERROR: Cannot post {0} : {1}, id = {2}, pwd = {3}".format(link, res.status_code, uname, upwd))
            exit(1)
    except Exception:
        print("ERROR: Cannot post {0}".format(link))
        exit(1)

def forbidden_image_or_error(link, img, data):
    sleep(0.05)
    try:
        res = requests.post(link, data=data, files=img)
        if res.status_code != 403:
            print("ERROR: Should not be allowed to post {0} with forbidden: code {1}".format(link, res.status_code))
            exit(1)
    except Exception:
        print("ERROR: Cannot post {0}".format(link))
        exit(1)
