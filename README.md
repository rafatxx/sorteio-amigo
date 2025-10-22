# 🎉 Amigo Secreto e Inimigo Secreto - Sorteios Online 

Este é um software para realizar sorteios de *Amigo Secreto* e *Inimigo Secreto* com uma dinâmica mais personalizada, para facilitar e agilizar o processo de sorteio dentro de grandes grupos. A aplicação tem como foco a utilização de um sistema onde os participantes podem visualizar seus amigos e inimigos secretos com base em uma lista de amigos próximos, além de poderem registrar seus gostos para ajudar na escolha de presentes.

## 🔧 Tecnologias Utilizadas

- **Frontend**: React Native
- **Backend**: C
- **Banco de Dados**: PostgreSQL

## 📋 Funcionalidades

### 1. **Cadastro de Participantes**
Cada participante do sorteio é registrado no banco de dados com as seguintes informações:
- **ID**
- **Nome**
- **Gênero**
- **Lista de Amigos Próximos** (Relacional entre participantes para impedir que pessoas "não próximas" se tirem no sorteio)

### 2. **Sorteio de Amigo e Inimigo Secreto**
A aplicação possui duas abas:
- **Amigo Secreto**: Mostra a lista de todos os participantes e realiza o sorteio para descobrir quem é o amigo secreto de cada um.
- **Inimigo Secreto**: Exibe a lista de participantes e sorteia quem será o inimigo secreto de cada pessoa.

### 3. **Filtro de Amigos Próximos**
O sorteio leva em consideração a configuração de amigos próximos de cada participante, garantindo que:
- Um participante **não sorteie alguém que não seja seu amigo próximo**.
- Isso ajuda a tornar a dinâmica mais interessante e divertida para grupos grandes.

### 4. **Acesso por Senha**
Ao clicar em um participante, é aberto um modal para o usuário inserir a senha associada ao participante. Isso garante que cada pessoa consiga ver apenas quem é o seu amigo e inimigo secreto.

### 5. **Preferências para Presentes**
Cada participante pode cadastrar seus gostos pessoais, como:
- **Esportes**
- **Video-games**
- **Filmes**
- **Hobbies**

Essas preferências podem ser utilizadas no futuro para sugerir presentes mais personalizados para o sorteio.

## 🔑 Como Rodar o Projeto

### 1. **Clonando o Repositório**
```bash
git clone https://github.com/seu-usuario/amigo-secreto-inimigo-secreto.git
cd amigo-secreto-inimigo-secreto

### 1. **Clonando o Repositório**

No frontend (React Native):

cd frontend
npm install

No backend (C):

cd backend
make

### 3. **Configuração do Banco de Dados**

Utilize o PostgreSQL para criar o banco de dados com a estrutura necessária. Abaixo está um exemplo de como configurar a base:

CREATE DATABASE amigo_secreto;

CREATE TABLE participantes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  genero VARCHAR(50) NOT NULL
);

CREATE TABLE proximos (
  participante_id INT REFERENCES participantes(id),
  amigo_id INT REFERENCES participantes(id)
);

CREATE TABLE preferencias (
  participante_id INT REFERENCES participantes(id),
  gosto VARCHAR(255)
);

CREATE TABLE senhas (
  participante_id INT REFERENCES participantes(id),
  senha VARCHAR(255) NOT NULL
);

### **4. Rodando o Projeto**

Para rodar o frontend (React Native):

npx react-native run-android  # Para Android
npx react-native run-ios  # Para iOS (se estiver em ambiente macOS)

Para rodar o backend, se for um servidor que utiliza o C:

./server

# 📂 Estrutura do Projeto

amigo-secreto-inimigo-secreto/
├── backend/                  # Código fonte do servidor (C)
│   ├── src/                  # Código fonte em C
│   ├── Makefile              # Makefile para compilação do backend
│   └── README.md             # Instruções para o backend
├── frontend/                 # Código fonte do frontend (React Native)
│   ├── src/                  # Componentes e lógica de UI
│   ├── App.js                # Ponto de entrada do React Native
│   └── README.md             # Instruções para o frontend
├── database/                 # Scripts de criação e migração do banco de dados
├── README.md                 # Este arquivo
└── LICENSE                   # Licença do projeto

# ⚙️ Fluxo do Sorteio

Cadastro dos Participantes: Ao iniciar, todos os participantes devem ser cadastrados com nome, gênero e suas preferências.

Configuração de Amigos Próximos: Cada participante pode definir uma lista de amigos próximos para garantir que apenas essas pessoas possam ser sorteadas.

Realização do Sorteio: O sistema realizará o sorteio, levando em conta as configurações de amigos próximos e permitindo que cada participante visualize seu amigo e inimigo secreto após inserir a senha.

Visualização das Preferências: As preferências registradas pelos participantes serão exibidas para facilitar a escolha dos presentes.

🛠️ Funcionalidades Futuras

Notificações: Enviar notificações para os participantes sobre o sorteio e o que eles podem fazer com as preferências cadastradas.

Sugestões de Presentes: Com base nos gostos dos participantes, sugerir ideias de presentes.

Personalização do Sorteio: Opções para alterar regras do sorteio, como incluir/incluir certos participantes, etc.