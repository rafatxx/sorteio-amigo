from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'grupos', views.GrupoViewSet)
router.register(r'participantes', views.ParticipanteViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('menu/', views.MeuMenuView.as_view(), name='meu-menu'),
]