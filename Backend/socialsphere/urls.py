from django.contrib import admin
from django.urls import path, include
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/posts/', include('posts.urls')),
]

if settings.DEBUG:
    try:
        from django.conf.urls.static import static
    except Exception:
        # If django isn't installed in this environment (e.g. static analysis),
        # provide a noop fallback so the module import doesn't fail.
        static = lambda *a, **k: []
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)