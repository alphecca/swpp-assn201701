from rest_framework import serializers
from django.contrib.auth.models import User
from homepage.models import *
from django.db.models import Sum, Q
import base64
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    '''
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        user = super(UserSerializer, self).create(validated_data)
        self.update_or_create_profile(user, profile_data)
        return user
    '''
    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
    '''
    def update_or_create_profile(self, user, profile_data):
        Profile.objects.update_or_create(user=user, defaults=profile_data)
    '''
    class Meta:
        model = User
        #article
        fields = ('id','username','password')

class LikeSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.username')
    parent=serializers.ReadOnlyField(source='parent.id')
    class Meta:
        model = Like
        fields = ('id','parent','owner')

class ArticleSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.username')
    owner_img = serializers.SerializerMethodField()
    parent=serializers.ReadOnlyField(source='parent.id')
    children_num = serializers.SerializerMethodField()
    depth = serializers.SerializerMethodField()
    like_num = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    root = serializers.SerializerMethodField()
    def get_images(self, obj):
        imgs = []
        if obj.image0 == None: #TODO 이후 최대 이미지 3장까지 올릴 수 있도록 + 프론트에서 이미지 불러오는 식으로 하고 싶은데 그거 삽질 한 이후에 수정하기
            return imgs
        try:
            imgs.append('http://'+self.context['domain']+obj.image0.url)
            return imgs
        except ValueError:
            return []
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
    def get_root(serlf, obj):
        try:
            o = Article.objects.get(pk=obj.parent.id)
            try:
                oo = Article.objects.get(pk=o.parent.id)
                return oo.id
            except:
                return o.id
        except:
            return 0
    def get_owner_img(self, obj):
        profile = Profile.objects.get(user=obj.owner)
        return 'http://'+self.context['domain']+profile.myimage.url
    class Meta:
        model = Article
        fields = ('id','parent','owner',
        'like_num','depth','text','children_num',
        'created_time','updated_time', 'images', 'image0', 'owner_img', 'youtube_video', 'root')

# for CHATTING
class ChatRoomSerializer(serializers.ModelSerializer):
    user_num = serializers.SerializerMethodField()
    def get_user_num(self, obj):
        return ChatUser.objects.filter(chatroom=obj.id).count()

    class Meta:
        model = Chat
        fields = ('id', 'user_num', 'room_name', 'secret')

class NowChatSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        ca = Chat.objects.all()
        nowchat = []
        for x in ca:
            cu = ChatUser.objects.filter(chatroom=x.id)
            for y in cu:
                if obj == y.chatuser:
                    nowchat.append(x.id)
                    break
        return nowchat
    class Meta:
        model = User


class NonChatSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        ca = Chat.objects.all()
        nonchat = []
        for x in ca:
            cu = ChatUser.objects.filter(chatroom=x.id)
            nonchat.append(x.id)
            for y in cu:
                if obj == y.chatuser:
                    nonchat.pop()
                    break
        return nonchat
    class Meta:
        model = User



class ChatUserSerializer(serializers.ModelSerializer):
    chatuser = serializers.ReadOnlyField(source='chatuser.username')
    chatroom = serializers.ReadOnlyField(source='chatroom.id')
    class Meta:
        model = ChatUser
        fields = ('id', 'chatroom', 'chatuser')

class TextSerializer(serializers.ModelSerializer):
    writer = serializers.ReadOnlyField(source='writer.username')
    room = serializers.ReadOnlyField(source='room.id')
    class Meta:
       model = Text
       fields = ('id','room', 'text', 'writer', 'created_time')

class WallSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        articles = Article.objects.filter(owner=obj)
        likes = Like.objects.filter(owner=obj)
        test = Article.objects.filter(id__in=likes.values('parent_id'))
        total = articles | test
        serializer = ArticleSerializer(total, many=True, context=self.context)
        return serializer.data
    class Meta:
        model = User

class ProfileSerializer(serializers.ModelSerializer):
    user= serializers.ReadOnlyField(source='user.username')
    domain = serializers.SerializerMethodField()
    def get_domain(self, obj):
        return 'http://'+self.context['domain']+obj.myimage.url
    class Meta:
        model = Profile
        fields = ('user','myname','mybelong','myintro', 'myimage', 'domain')

class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.ReadOnlyField(source='friend.username')
    me = serializers.ReadOnlyField(source='me.username')
    class Meta:
        model = Friend
        fields = ('friend','me',)

class SasangSerializer(serializers.ModelSerializer):
    first=serializers.ReadOnlyField(source='first.username')
    second=serializers.ReadOnlyField(source='second.username')
    class Meta:
       model = Sasang
       fields = ('first','second','counter')

