#! /bin/bash
echo "원격 서버의 사이트에서 프론트엔드 셀레늄 테스트를 실행합니다."
echo "네트워크 상태가 좋지 않거나 테스트 중 누군가가 원격 사이트에서 행동을 하면 테스트가 방해받을 수 있습니다."
echo "테스트가 끝까지 실행되지 않는 경우 네트워크 상태를 확인하시고 다시 테스트를 실행해 주시기 바랍니다."
echo "테스트를 두 번 실행해도 같은 오류가 발생한다면, 제작진들에게 연락 바랍니다."
python3 frontend_article_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_article_detail_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_chatting_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_friend_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_more_article_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_profile_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_sasang_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
python3 frontend_wall_tests.py http://wlxyzlw.iptime.org:8000/ http://wlxyzlw.iptime.org:3000/
