# TODO Use tmux to run server and tests simultaneously
python3 ../northfacebook_backend/manage.py runserver
python3 backend_tests.py http://127.0.0.1:8000/
#python3 inittest.py http://127.0.0.1:8000/
#python3 signUpChecker.py http://127.0.0.1:3000/
