
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

- Cadastro e login de usuários com autenticação via token JWT e refresh token.
- Criação, edição e exclusão de transações financeiras (entry/outlet).
- Relacionamento de transações com categorias personalizadas.
- Filtros por período (data) e categoria no dashboard.
- Dashboard com atualização reativa (após qualquer ação).
- Exportação de transações em PDF e CSV.
- Resumo financeiro dinâmico com cards de entrada, saída e saldo total.
- Interface totalmente em inglês.
- Interface responsiva e moderna com Tailwind CSS.
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
   cd ../fincheck-frontend
   npm install
   npm run dev
   ```

---

## 💬 Principais desafios

- Implementar autenticação segura com JWT e refresh token.
- Lidar com relações entre tabelas no Prisma (ex: categoria e transações).
- Criar filtros dinâmicos e atualizações reativas no dashboard.
- Exportar dados para arquivos PDF e CSV no backend.
- Separar responsabilidades no frontend (modularização de funções).

---

## 🧑‍💻 Autor

Desenvolvido por [Eric Martins (Zenkai)](https://github.com/Eric6ix?tab=repositories)

---

## 📌 Status

🚀 Projeto em constante evolução — novas funcionalidades estão sendo desenvolvidas.
