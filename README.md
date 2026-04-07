# Sorteio do Amigo (e Inimigo) Secreto

Um sistema web completo, interativo e seguro para gerenciar o tradicional sorteio de Amigo Secreto, com o divertido adicional do **Inimigo Secreto**. Construído com uma arquitetura moderna separando Front-end (React) e Back-end (Django).

## Funcionalidades

* **Sorteio Duplo:** Suporte simultâneo para sorteio de "Amigo Secreto" e "Inimigo Secreto".
* **Algoritmo de Sorteio Avançado:** Utiliza um algoritmo robusto de embaralhamento (*derangement*) no back-end para garantir sorteios válidos mesmo com uma lista complexa de **exclusões** (regras de quem não pode tirar quem).
* **Autenticação Segura:** Login individual por participante usando tokens JWT para revelar seus resultados.
* **Gestão de Preferências:** Participantes podem adicionar e atualizar suas preferências de presentes ("gostos pessoais") a qualquer momento.
* **Alta Performance e Resiliência:** Front-end otimizado com sistema de **Cache Local (10 minutos)** para a lista de participantes, suportando picos de acessos simultâneos sem sobrecarregar o banco de dados gratuito.
* **UI/UX Temática:** Interface moderna, escura (Dark Mode) e responsiva com Tailwind CSS, incluindo efeitos visuais natalinos (neve caindo) e cores dinâmicas baseadas no gênero do participante.
* **Painel Administrativo:** Gestão completa de grupos, usuários, exclusões e disparo do sorteio através do painel nativo do Django Admin.

## Tecnologias Utilizadas

### Front-end
* **React** (com Vite)
* **TypeScript**
* **Tailwind CSS** (Estilização)
* **Lucide React** (Ícones)
* **Axios** (Comunicação com a API e Interceptors para JWT)

### Back-end
* **Python**
* **Django**
* **Django Rest Framework (DRF)** (Construção da API)
* **Simple JWT** (Autenticação)
* **PostgreSQL** (Banco de Dados em Nuvem hospedado no **Neon**)

### Infraestrutura & Deploy
* **Render** (Hospedagem do Front-end e Back-end)
* **Uptime Robot** (Monitoramento de disponibilidade)

---

## Como executar o projeto localmente

Para rodar este projeto na sua máquina, você precisará configurar o Back-end e o Front-end separadamente.

Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina as seguintes ferramentas:

Git

Node.js (versão 18+ recomendada)

Python (versão 3.10+ recomendada)

### 1. Configurando o Back-end (Django)

```bash
# Clone o repositório
git clone [https://github.com/rafatxx/sorteio-amigo.git](https://github.com/rafatxx/sorteio-amigo.git)

# Entre na pasta do backend (substitua pelo nome correto da sua pasta)
cd backend

# Crie um ambiente virtual (Windows)
python -m venv venv
venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações para criar o banco de dados local
python manage.py migrate

# Crie um superusuário para acessar o painel admin
python manage.py createsuperuser

# Inicie o servidor de desenvolvimento
python manage.py runserver

O back-end estará rodando em http://127.0.0.1:8000/. Acesse http://127.0.0.1:8000/admin/ para gerenciar o sistema.

2. Configurando o Front-end (React)
Abra um novo terminal e navegue até a pasta do front-end.

Bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz do frontend com a URL da API local
echo VITE_API_URL=[http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/) > .env

# Inicie o servidor de desenvolvimento
npm run dev
O front-end estará rodando em http://localhost:5173/.

Variáveis de Ambiente
Para o ambiente de produção, certifique-se de configurar as seguintes variáveis:

Front-end (.env):

VITE_API_URL: URL da sua API no Render (ex: https://seu-backend.onrender.com/api/)

Back-end (Configurações do Render):

DATABASE_URL: String de conexão do PostgreSQL (fornecida pelo Neon).

SECRET_KEY: Chave secreta do Django.

DEBUG: False (para produção).

ALLOWED_HOSTS: URL do seu back-end no Render.

CORS_ALLOWED_ORIGINS: URL do seu front-end no Render.

Autor
Desenvolvido por Rafael Teixeira (@rafatxx) e Victor Carmona (@carmowa).
