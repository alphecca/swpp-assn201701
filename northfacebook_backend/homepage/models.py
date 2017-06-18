from django.db import models
from django.db.models import signals
from django.contrib.auth.models import User
import base64

class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,primary_key=True)
#    owner= models.ForeignKey('auth.User', on_delete=models.CASCADE)
    myname = models.TextField()
    mybelong = models.TextField()
    myintro = models.TextField()
    myimage = models.ImageField(upload_to='profiles/', default='default/defaultImage.jpg')

# 클래스 밖에 정의된 함수입니다 
def create_profile(sender, instance, created, **kwargs):
    #create Profile for every new User model
    if created:
        Profile.objects.create(user=instance)
signals.post_save.connect(create_profile, sender='auth.User', weak=False)
#, dispatch_uid='models.create_profile'

class Like(models.Model):
    parent = models.ForeignKey('Article',
            on_delete=models.CASCADE)
    owner = models.ForeignKey('auth.User',
            on_delete=models.CASCADE)

class Article(models.Model):
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    text = models.TextField()
    parent = models.ForeignKey('Article',
        on_delete=models.CASCADE,default=0)
    owner = models.ForeignKey('auth.User',
        on_delete=models.CASCADE)
    children_num = models.IntegerField(default=0)
    like_num = models.IntegerField(default=0)
    depth = models.IntegerField(default=0)
    image0 = models.ImageField(upload_to='articles/', null=True, blank=True, default=None)
    youtube_video = models.TextField(default='None')
    class Meta:
        ordering = ['-created_time']

class Chat(models.Model):
    room_name = models.TextField()
    secret = models.BooleanField(default=False)
    chatuser_num = models.IntegerField(default=0)

class ChatUser(models.Model):
   chatroom = models.ForeignKey('Chat', related_name='chatroom', on_delete=models.CASCADE)
   chatuser = models.ForeignKey('auth.User', related_name='chatuser', on_delete=models.CASCADE)

class Text(models.Model):
    text = models.TextField()
    room = models.ForeignKey('Chat', related_name='room',on_delete=models.CASCADE)
    writer = models.ForeignKey('auth.User', related_name='writer', on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_time']

class Friend(models.Model):
    me = models.ForeignKey('auth.User', related_name='me', on_delete=models.CASCADE)
    friend = models.ForeignKey('auth.User', related_name='friend', on_delete=models.CASCADE)
    is_mutual = models.BooleanField()
class Sasang(models.Model):
    first = models.ForeignKey('auth.User',
            related_name='first',
            on_delete=models.CASCADE)
    second = models.ForeignKey('auth.User',
            related_name='second',
            on_delete=models.CASCADE)
    counter = models.PositiveIntegerField(default=1)

