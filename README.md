# 💰 FinCheck

Aplicação web para **gestão financeira pessoal**, desenvolvida com foco em aprendizado fullstack e organização de finanças de forma simples e intuitiva.

---

## 🔧 Tecnologias utilizadas

### Backend
- Node.js
- Express
- Prisma (ORM)
- PostgreSQL
- JWT para autenticação
- Docker (para container do banco)

### Frontend
- React
- Axios
- Tailwind CSS
- React Router DOM

---

## ✨ Funcionalidades atuais

- Cadastro e login de usuários com autenticação via token JWT.
- Criação de transações financeiras (entrada/saída).
- Listagem de transações do usuário logado.
- Exclusão de transações.
- Interface responsiva e moderna.
- Proteção de rotas via token JWT.
- Docker para ambiente local do PostgreSQL.
  
---

## 📌 Como rodar o projeto

### Pré-requisitos
- Node.js v18+
- Docker
- Yarn ou npm

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Eric6ix/fincheck.git
   cd fincheck
   ```

2. **Suba o container do banco**
   ```bash
   docker run --name fincheck-db -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=fincheck -p 5432:5432 -d postgres:16
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz da API:
   ```env
   DATABASE_URL="postgresql://root:root@localhost:5432/fincheck"
   JWT_SECRET="sua_chave_secreta"
   ```

4. **Instale dependências e rode as migrations**
   ```bash
   cd fincheck-api
   npm install
   npx prisma migrate dev --name init
   ```

5. **Rode o backend**
   ```bash
   npm run dev
   ```

6. **Rode o frontend**
   ```bash
   cd ../fincheck-web
   npm install
   npm run dev
   ```

---

## 💬 Principais desafios

- Entender e configurar corretamente a autenticação JWT com expiração.
- Manuseio do Prisma e relações no banco (como transações e categorias).
- Manter a persistência de dados via Docker e PostgreSQL local.
- Proteger as rotas da aplicação com base no token do usuário.

---

## 🧑‍💻 Autor

Desenvolvido por [Eric Martins (Zenkai)](https://github.com/Eric6ix?tab=repositories)

---

## 📌 Status

🚧 Projeto em desenvolvimento — novas funcionalidades serão adicionadas em breve.