from rest_framework import serializers
from django.contrib.auth.models import User
from homepage.models import *
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #article
        fields = ('id','username')

class LikeSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.id')
    parent=serializers.ReadOnlyField(source='article.id')
    class Meta:
        model = Like
        fields = ('id','parent','owner')

class ArticleSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.id')
    parent=serializers.ReadOnlyField(source='article.id')
    children_num = serializers.SerializerMethodField()
    like_num = serializers.SerializerMethodField()
    def get_children_num(self,obj):
        return Article.objects.filter(parent=obj.id).count()
    def get_like_num(self,obj):
        return Like.objects.filter(parent=obj.id).count()
    class Meta:
        model = Article
        fields = ('id','owner','parent','created_time',
                'updated_time','text',
                'children_num','like_num')

