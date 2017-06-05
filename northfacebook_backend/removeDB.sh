rm -f tmp.db db.sqlite3
rm -r homepage/migrations
python3 manage.py makemigrations homepage
python3 manage.py migrate
