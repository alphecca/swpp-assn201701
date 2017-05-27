from rest_framework import serializers
from django.contrib.auth.models import User
from homepage.models import *
from django.db.models import Sum, Q

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #article
        fields = ('id','username')

class LikeSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.username')
    parent=serializers.ReadOnlyField(source='article.id')
    class Meta:
        model = Like
        fields = ('id','parent','owner')

class ArticleSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.username')
    parent=serializers.ReadOnlyField(source='article.id')
    children_num = serializers.SerializerMethodField()
    depth = serializers.SerializerMethodField()
    like_num = serializers.SerializerMethodField()
    def get_children_num(self,obj):
        article=Article.objects.filter(parent=obj.id)
        s=article.count()
        for o in article:
            s+=Article.objects.filter(parent=o.id).count()
        return s
    def get_like_num(self,obj):
        return Like.objects.filter(parent=obj.id).count()
    def get_depth(self,obj):
        try:
            o=Article.objects.get(pk=obj.parent.id)
            try:
                Article.objects.get(pk=o.parent.id)
                return 2
            except:
                return 1
        except:
            return 0
    class Meta:
        model = Article
        fields = ('id','parent','owner',
        'like_num','depth','text','children_num',
        'created_time','updated_time')

# for CHATTING
class ChatRoomSerializer(serializers.ModelSerializer):
    user_num = serializers.SerializerMethodField()
    def get_user_num(self, obj):
        return ChatUser.objects.filter(chatroom=obj.id).count()

    class Meta:
        model = Chat
        fields = ('id','user_num', 'room_name')

class NowChatSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        ca=Chat.objects.all()
        nowchat=[]
        for x in ca:
            cu = ChatUser.objects.filter(chatroom=x.id)
            for y in cu:
                if obj==y.chatuser:
                    nowchat.append(x.id)
                    break
        return nowchat
    class Meta:
        model = User


class NonChatSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        ca=Chat.objects.all()
        nonchat=[]
        for x in ca:
            cu = ChatUser.objects.filter(chatroom=x.id)
            nonchat.append(x.id)
            for y in cu:
                if obj==y.chatuser:
                    nonchat.pop()
                    break
        return nonchat
    class Meta:
        model = User


class ChatUserSerializer(serializers.ModelSerializer):
    chatuser = serializers.ReadOnlyField(source='chatuser.username')
    chatroom=serializers.ReadOnlyField(source='chatroom.id')
    class Meta:
        model = ChatUser
        fields = ('id', 'chatroom', 'chatuser')

class TextSerializer(serializers.ModelSerializer):
    writer=serializers.ReadOnlyField(source='writer.username')
    room = serializers.ReadOnlyField(source='room.id')
    class Meta:
       model = Text
       fields = ('id','room', 'text', 'writer', 'created_time')

class WallSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        articles = Article.objects.filter(owner=obj)
        likes = Like.objects.filter(owner=obj)
        test = Article.objects.filter(id__in= likes.values('parent_id'))
        total = articles | test
        return total.order_by('-created_time').values()
    class Meta:
        model = User
