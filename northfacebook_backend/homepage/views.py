from django.shortcuts import render
from django.core.files import File
from django.contrib.auth.models import User
from django.db.models import Q
from homepage.models import *
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from homepage.serializers import *
from homepage.permissions import IsAuthenticatedOrPOSTOnly

from base64 import b64decode as decode
import re
# Create your views here.

@api_view(['GET', 'POST'])
def main_list(request):
    context = {'domain': request.META['HTTP_HOST']}
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        articles = Article.objects.filter(parent=0)
        serializer = ArticleSerializer(articles, many=True, context=context)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data, context=context)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def article_list(request):
    context = {'domain': request.META['HTTP_HOST']}
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True, context=context)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data, context=context)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def article_detail(request, pk):
    context = {'domain': request.META['HTTP_HOST']}
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = ArticleSerializer(article, context=context)
        return Response(serializer.data)
    elif request.method == 'PUT':
        if article.owner == request.user:
            print(request.data)
            if "image0" in request.data and request.data["image0"] == 'null':
                request.data["image0"] = None
            serializer = ArticleSerializer(article,data=request.data, context=context)
            if serializer.is_valid():
                serializer.save()
                print(serializer.data['youtube_video'])
                return Response(serializer.data)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)
    elif request.method == 'DELETE':
        if article.owner == request.user:
            article.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def like_list(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        likes = Like.objects.all()
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)

@api_view(['GET','DELETE'])
def like_detail(request, pk):
    try:
        like = Like.objects.get(pk=pk)
    except Like.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = LikeSerializer(like)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        if like.owner == request.user:
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET', 'POST'])
def like(request,pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    like = Like.objects.filter(parent=article.id)
    if request.method == 'GET':
        serializer = LikeSerializer(like,many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = LikeSerializer(data=request.data)
        if like.filter(owner=request.user.id).count()!=0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        if request.user.id == article.owner.id:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        if serializer.is_valid():
            serializer.save(owner=request.user,parent=article)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_nowchat(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = NowChatSerializer(request.user)
        chat = []
        for room_id in serializer.data:
            chat.append(Chat.objects.get(id=room_id))
        serializer = ChatRoomSerializer(chat, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def user_nonchat(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = NonChatSerializer(request.user)
        chat = []
        for room_id in serializer.data:
            room = Chat.objects.get(id=room_id)
            if not ChatUser.objects.filter(chatroom=room.id).exists():
                room.delete()
            elif not room.secret:
                chat.append(room)
        serializer = ChatRoomSerializer(chat, many=True)
        return Response(serializer.data)

@api_view(['GET','POST'])
def article_article(request,pk):
    context = {'domain': request.META['HTTP_HOST']}
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    articlearticle = Article.objects.filter(parent=article.id)
    if request.method == 'GET':
        serializer = ArticleSerializer(articlearticle,many=True, context=context)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data, context=context)
        if serializer.is_valid():
            serializer.save(owner=request.user,parent=article)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def total_article(request,pk):
    context = {'domain': request.META['HTTP_HOST']}
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    articlearticle = Article.objects.filter(parent=article.id)
    QS=Q(parent=article.id)
    for aa in articlearticle:
        QS=QS|Q(parent=aa.id)
    ta=Article.objects.filter(QS)
    if request.method == 'GET':
        serializer = ArticleSerializer(ta,many=True, context=context)
        return Response(serializer.data)


class AuthList(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        content = {
            'status': 'user is authenticated'
        }
        return Response(content)

@api_view(['GET', 'POST','DELETE'])
@permission_classes((IsAuthenticatedOrPOSTOnly,))
def user_list(request):
    if request.method == 'GET':
        serializer = UserSerializer(User.objects.all(), many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # requested data should contain username, password attributes.
        auth = request.data
        try: # if request is bad request, return 400
            username = auth['username']
            pwd = auth['password']
            if len(username)<4 or len(username)>20:
                return Response(status = status.HTTP_400_BAD_REQUEST)
            p = re.compile('\W+')
            if (p.search(username) != None or pwd == ''):
                return Response(status = status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response(status = status.HTTP_400_BAD_REQUEST)
        try: # if there is an user that has same username, return 405
            old_user = User.objects.get(username=username)
            return Response(status = status.HTTP_405_METHOD_NOT_ALLOWED)
        except User.DoesNotExist:
            pass
        user = User.objects.create_user(username, password=pwd)
        user.save()
        return Response(status = status.HTTP_201_CREATED)
    elif request.method == 'DELETE':
        # requested data should contain username attribute.
        request.user.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)

@api_view(['GET','PUT','DELETE'])
def user_detail(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        if user!=request.user:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serializer = UserSerializer(user,data=request.data)
        if serializer.is_valid():
            # if password is bad, return 400
            pwd=request.data['password']
            if(pwd==''):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        if user == request.user:
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

# for CHATTING
@api_view(['GET', 'POST'])
def chatroom_list(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        chat = Chat.objects.all()
        # Auto delete empty room
        for room in chat:
            roomuser = ChatUser.objects.filter(chatroom=room.id)
            if not roomuser.exists():
                room.delete()
        chat = Chat.objects.all()
        serializer = ChatRoomSerializer(chat, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        rd = request.data
        try:
            assert rd['room_name']!=None
            assert rd['room_name']!=''
            assert len(rd['room_name'])<60
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = ChatRoomSerializer(data=request.data)
        if serializer.is_valid():
            chatroom = serializer.save()
            serializer = ChatUserSerializer(data={})
            if serializer.is_valid():
                serializer.save(chatroom=chatroom, chatuser=request.user)
# 다른 유저를 초대하려면 POST시 request.data에 다음과 같이 추가하세요.
# "invite": ["swpp", "asdf"]

# 초대 유저 목록 중 없는 유저가 있으면 아무도 초대되지 않고,
# 자신이 초대 목록에 포함되어 있다고 중복 참여되지는 않습니다.
# invite 속성은 request.data에 포함되지 않아도 무방합니다.
                try:
                    invite = []
                    for other in rd['invite']:
                        user = User.objects.get(username=other)
                        if user != request.user:
                            invite.append(User.objects.get(username=other))
                except:
                    return Response(status=status.HTTP_201_CREATED)
                try:
                    for other in invite:
                        serializer = ChatUserSerializer(data={})
                        if serializer.is_valid():
                            serializer.save(chatroom=chatroom, chatuser=other)
                except:
                    pass
                return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def chatroom_detail(request,pk):
    try:
        chatroom = Chat.objects.get(pk=pk)
    except Chat.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if not ChatUser.objects.filter(chatroom=chatroom.id).exists():
        chatroom.delete()
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = ChatRoomSerializer(chatroom)
        return Response(serializer.data)

@api_view(['GET'])
def chatuser_list(request):
  if request.user.id == None:
    return Response(status=status.HTTP_403_FORBIDDEN)
  if request.method == 'GET':
    chatuser=ChatUser.objects.all()
    serializer = ChatUserSerializer(chatuser, many=True)
    return Response(serializer.data)

@api_view(['GET','POST','DELETE'])
def chatuser(request,pk):
  try: chatroom = Chat.objects.get(pk=pk)
  except Chat.DoesNotExist:
    return Response(status = status.HTTP_404_NOT_FOUND)
  if request.user.id == None:
    return Response(status= status.HTTP_403_FORBIDDEN)
  chatuser = ChatUser.objects.filter(chatroom=chatroom.id)
  if request.method == 'GET':
    if chatroom.secret:
        for t in chatuser:
          if t.chatuser == request.user:
            serializer = ChatUserSerializer(chatuser, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    serializer = ChatUserSerializer(chatuser, many=True)
    return Response(serializer.data)
  elif request.method == 'POST':
    if chatroom.secret:
      return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    for t in chatuser:
      if t.chatuser == request.user:
         return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    serializer = ChatUserSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(chatroom=chatroom, chatuser=request.user)
      return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)
  elif request.method == 'DELETE':
    for t in chatuser:
      if t.chatuser == request.user:
        exituser = ChatUser.objects.filter(chatroom=chatroom.id, chatuser=request.user)
        if exituser.exists():
          exituser.delete()
          if not ChatUser.objects.filter(chatroom=chatroom.id).exists():
            chatroom.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
          chatuser = ChatUser.objects.filter(chatroom=chatroom.id)
          return Response(ChatUserSerializer(chatuser, many=True).data)
        return Response(ChatUserSerializer(chatuser, many=True).data)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def text_list(request):
  if request.user.id == None:
     return Response(status=status.HTTP_403_FORBIDDEN)
  if request.method == 'GET':
     text = Text.objects.all()
     serializer = TextSerializer(text, many=True)
     return Response(serializer.data)

@api_view(['GET','POST'])
def text(request, pk):
  try: chatroom = Chat.objects.get(pk=pk)
  except Chat.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)
  if request.user.id == None:
    return Response(status=status.HTTP_403_FORBIDDEN)
  text = Text.objects.filter(room=chatroom.id)
  if request.method == 'GET':
    serializer = TextSerializer(text, many=True)
    return Response(serializer.data)
  elif request.method == 'POST':
    chatuser=ChatUser.objects.filter(chatroom=chatroom.id)
    for t in chatuser:
      if request.user == t.chatuser:
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid():
          serializer.save(writer=request.user, room=chatroom)
          return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#####담벼락#####
@api_view(['GET'])
def wall(request, username):
    context = {'domain': request.META['HTTP_HOST']}
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        try:
            owner = User.objects.get(username=username)
            serializer = WallSerializer(owner, context=context)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def profile_list(request):
    if request.user.id==None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    serializer = ProfileSerializer(Profile.objects.all(), many=True)
    if request.method == 'GET':
        return Response(serializer.data)

@api_view(['GET','PUT'])
def profile(request, username):
    context = {'domain': request.META['HTTP_HOST']}
    if request.user.id == None:
        return Response(status= status.HTTP_403_FORBIDDEN)
    try:
        user= User.objects.get(username=username)
        profile=Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer=ProfileSerializer(profile, context=context)
        return Response(serializer.data)
    if request.method == 'PUT':
        if profile.user!= request.user:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        data = request.data
        if 'myimage' in data and data['myimage'] == 'null':
            data['myimage'] = File(open('media/default/defaultImage.jpg', 'rb'))
        serializer = ProfileSerializer(profile, data=data, context=context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_403_FORBIDDEN)
# 동무 목록
@api_view(['GET'])
def friend_list(request, username):
    try: user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        friends = Friend.objects.filter(me=user, is_mutual=True)
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST'])
def add_friend_list(request, username):
    try: user = User.objects.get(username=username) # 동무추가 요청 페이지의 주인
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        if request.user == user:
            add_friends = Friend.objects.filter(me=user, is_mutual=False)
        else:
            add_friends = Friend.objects.filter(friend=request.user, me=user, is_mutual=False)
        serializer = FriendSerializer(add_friends, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if request.user == user: # 본인에게 동무추가 요청을 보내는 경우
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        friend = Friend.objects.filter(me=user, friend=request.user)
        if friend.exists(): # 이미 같은 사람에게 동무추가 요청을 보냈거나 이미 동무인 경우
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        friend = Friend.objects.filter(me=request.user, friend=user, is_mutual=False)
        if friend.exists(): # 상대가 이미 나에게 동무추가 요청을 보낸 경우
            serializer = FriendSerializer(data=request.data)
            if serializer.is_valid():
                friend.delete()
                serializer.save(me=user, friend=request.user, is_mutual=True)
                serializer = FriendSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(me=request.user, friend=user, is_mutual=True)
                return Response(status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = FriendSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(me=user, friend=request.user, is_mutual=False)
                return Response(status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def add_friend(request, username, friendname):
    try:
        user = User.objects.get(username=username)
        friend = User.objects.get(username=friendname)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    try: add_friend = Friend.objects.get(me=user, friend=friend, is_mutual=False)
    except Friend.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        if request.user == user or request.user == friend:
            serializer = FriendSerializer(add_friend)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    elif request.method == 'DELETE':
        if request.user == user or request.user == friend:
            add_friend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def my_add_friend_list(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        add_friends = Friend.objects.filter(friend=request.user, is_mutual=False)
        serializer = FriendSerializer(add_friends, many=True)
        return Response(serializer.data)

@api_view(['GET','POST','PUT'])
def sasang(request,username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.username == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        if request.user== user:
            sasang = Sasang.objects.filter(Q(first=user)|Q(second=user))
            serializer = SasangSerializer(sasang, many=True)
            return Response(serializer.data)
        else:
            sasang = Sasang.objects.filter(Q(first=user,second=request.user)|Q(first=request.user,second=user))
            serializer = SasangSerializer(sasang,many=True)
            return Response(serializer.data)
    if request.method == 'POST':
        if request.user==user or Sasang.objects.filter(Q(first=user,second=request.user)|Q(first=request.user,second=user)).exists() == True:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer=SasangSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(first=user,second=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        try:
            sasang = Sasang.objects.get(first=request.user,second=user)
        except Sasang.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = SasangSerializer(sasang,data=request.data)
        if serializer.is_valid():
            serializer.save(first=sasang.second,second=sasang.first,counter=sasang.counter+1)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

