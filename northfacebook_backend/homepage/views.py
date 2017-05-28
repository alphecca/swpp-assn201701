from django.shortcuts import render
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

# Create your views here.
@api_view(['GET', 'POST'])
def main_list(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        articles = Article.objects.filter(parent=0)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def article_list(request):
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def article_detail(request, pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = ArticleSerializer(article)
        return Response(serializer.data)
    elif request.method == 'PUT':
        if article.owner == request.user:
            serializer = ArticleSerializer(article,data=request.data)
            if serializer.is_valid():
                serializer.save()
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
def user_nowchat(request,pk): #TODO pk => username 버전으로 수정하기
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = NowChatSerializer(user)
        return Response(serializer.data)

@api_view(['GET'])
def user_nonchat(request,pk): #TODO pk => username 버전으로 수정하기
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = NonChatSerializer(user)
        return Response(serializer.data)

@api_view(['GET','POST'])
def article_article(request,pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    articlearticle = Article.objects.filter(parent=article.id)
    if request.method == 'GET':
        serializer = ArticleSerializer(articlearticle,many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user,parent=article)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def total_article(request,pk):
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
        serializer = ArticleSerializer(ta,many=True)
        return Response(serializer.data)


class AuthList(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        content = {
            'status': 'user is authenticated'
        }
        return Response(content)

@api_view(['GET', 'POST', 'DELETE'])
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
            if (username == '' or pwd == ''):
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

@api_view(['GET','DELETE'])
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
        serializer = ChatRoomSerializer(chat, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ChatRoomSerializer(data=request.data)
        if serializer.is_valid():
            chatroom = serializer.save()
            serializer = ChatUserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(chatroom=chatroom, chatuser=request.user)
                return Response(status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def chatroom_detail(request,pk):
    try:
        chatroom = Chat.objects.get(pk=pk)
    except Chat.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        serializer = ChatRoomSerializer(chatroom)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        chatroom.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    serializer = ChatUserSerializer(chatuser, many=True)
    return Response(serializer.data)
  elif request.method == 'POST':
    for t in chatuser:
      if t.chatuser == request.user:
         return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    serializer = ChatUserSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(chatroom=chatroom, chatuser=request.user)
      return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)
  elif request.method == 'DELETE':
    exituser = ChatUser.objects.filter(chatroom=chatroom.id, chatuser=request.user)
    if exituser.exists():
      exituser.delete()
      if not ChatUser.objects.filter(chatroom=chatroom.id).exists():
        chatroom.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
      return Response(ChatUserSerializer(chatuser, many=True).data)
    return Response(ChatUserSerializer(chatuser, many=True).data)


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
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        try:
            owner = User.objects.get(username=username)
            serializer = WallSerializer(owner)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

# 동무 목록
@api_view(['GET'])
def friend_list(request, username):
    try: user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.user.id == None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
#        if request.user != user:
#            return Response(status=status.HTTP_403_FORBIDDEN)
        friends = Friend.objects.filter(me=user, is_mutual=True) 
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE'])
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
            add_friends = Friend.objects.filter(friend=request.user, is_mutual=False)
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

