from rest_framework import serializers

# Robust imports for models and fallback for users serializer to avoid
# "attempted relative import with no known parent package" when the module is
# executed as a top-level script or loaded outside a package context.
from importlib import import_module
from django.apps import apps

# Prefer Django's app registry to retrieve models which avoids issues with
# relative imports when modules are executed outside a package context.
try:
    Post = apps.get_model('posts', 'Post')
    Like = apps.get_model('posts', 'Like')
    Comment = apps.get_model('posts', 'Comment')
    if not (Post and Like and Comment):
        raise LookupError("app registry did not return expected models")
except Exception:
    # Fallback to explicit module import for non-Django or analysis contexts
    _model_module_names = ('posts.models', 'Posts.models')
    for _mname in _model_module_names:
        try:
            _mod = import_module(_mname)
            Post = getattr(_mod, 'Post')
            Like = getattr(_mod, 'Like')
            Comment = getattr(_mod, 'Comment')
            break
        except Exception:
            continue
    else:
        raise ImportError(
            "Could not import Post, Like, Comment models from known locations: %r"
            % (_model_module_names,)
        )

try:
    _users_mod = import_module('users.serializers')
    UserSerializer = getattr(_users_mod, 'UserSerializer')
except Exception:
    # Fallback minimal UserSerializer if the users.serializers module cannot be resolved
    # (helps static analysis/IDE errors while maintaining runtime compatibility if the real
    # users.serializers is not available at analysis time).
    class UserSerializer(serializers.Serializer):
        id = serializers.IntegerField(read_only=True)
        username = serializers.CharField(read_only=True)
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content', 'image', 'created_at', 
            'updated_at', 'likes_count', 'comments_count', 'is_liked', 'comments'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'image']