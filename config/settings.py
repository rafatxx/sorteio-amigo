"""
Django settings for config project.
"""
import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CARREGAMENTO DO .env (APENAS PARA DESENVOLVIMENTO LOCAL) ---
# O Render ignora isso e usa suas próprias variáveis de ambiente
load_dotenv(BASE_DIR / '.env')


# --- CONFIGURAÇÕES DE PRODUÇÃO (LIDAS DO AMBIENTE) ---

# Chave secreta. No local, lê do .env. No Render, lê das "Environment Variables".
SECRET_KEY = os.getenv('SECRET_KEY')

# O DEBUG será 'True' se a variável de ambiente DEBUG for "True", senão será 'False'
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Hosts permitidos (lê do Render ou do .env)
# Ex: "api.onrender.com,localhost"
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

# Configurações de CORS (lê do Render ou do .env)
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')


# --- O RESTO DAS CONFIGURAÇÕES DO DJANGO ---

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    #Apps de terceiros
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',

    #Apps locais
    'grupos',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# Lê a DATABASE_URL do ambiente (Render) ou do .env (Local)
DATABASES = {
    'default': dj_database_url.config(
        # 'default' é o fallback se DATABASE_URL não for encontrado
        default=os.getenv('DATABASE_URL'), 
        conn_max_age=600
    )
}
# Se você ainda quiser usar seu Postgres local quando 'DATABASE_URL' não estiver definida:
# if 'default' not in DATABASES or not DATABASES['default']:
#     DATABASES['default'] = {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('DB_NAME_LOCAL'),
#         'USER': os.getenv('DB_USER_LOCAL'),
#         'PASSWORD': os.getenv('DB_PASSWORD_LOCAL'),
#         'HOST': os.getenv('DB_HOST_LOCAL'),
#         'PORT': os.getenv('DB_PORT_LOCAL'),
#     }


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
# Adicione esta linha para o Gunicorn (servidor de produção) encontrar seus arquivos estáticos
STATIC_ROOT = BASE_DIR / 'staticfiles'


# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}