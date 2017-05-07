from django.db import models
class Like(models.Model):
    parent = models.ForeignKey('Article',
            related_name='likedfs',
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
    class Meta:
        ordering = ['-created_time']
