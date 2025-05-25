
# Lia - Arquitetura Separada Backend + Frontend

Este projeto agora possui uma arquitetura separada com backend Node.js e frontend React.

## Estrutura do Projeto

```
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares (auth, etc)
│   │   ├── config/         # Configurações (database, etc)
│   │   └── server.js       # Servidor principal
│   ├── Dockerfile          # Docker para backend
│   └── package.json        # Dependências do backend
├── src/                    # Frontend React
├── Dockerfile              # Docker para frontend
└── docker-compose.yml      # Orquestração dos serviços
```

## Tecnologias

### Backend
- **Node.js** + **Express.js**
- **Supabase** (banco de dados e auth)
- **JWT** para autenticação
- **Joi** para validação
- **Helmet** + **CORS** para segurança

### Frontend
- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **Shadcn UI**
- **React Router** (roteamento)

## Como Executar

### Desenvolvimento Local

1. **Backend:**
```bash
cd backend
npm install
npm run dev     # Roda na porta 3001
```

2. **Frontend:**
```bash
npm install
npm run dev     # Roda na porta 8080
```

### Production com Docker

```bash
# Construir e executar ambos os serviços
docker-compose up --build

# Acessar:
# Frontend: http://localhost:8080
# Backend API: http://localhost:3001/api
```

## API Endpoints

### Autenticação
- `POST /api/auth/signup` - Criar conta
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Usuários
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil

### Diário
- `GET /api/diary` - Listar entradas
- `POST /api/diary` - Criar entrada
- `PUT /api/diary/:id` - Atualizar entrada
- `DELETE /api/diary/:id` - Deletar entrada

### Contatos Seguros
- `GET /api/contacts` - Listar contatos
- `POST /api/contacts` - Criar contato
- `PUT /api/contacts/:id` - Atualizar contato
- `DELETE /api/contacts/:id` - Deletar contato

### Emergência
- `POST /api/emergency/alert` - Enviar alerta de emergência

## Configuração

### Backend (.env)
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Frontend
```
VITE_API_URL=http://localhost:3001/api
```

## Segurança

- **CORS** configurado para permitir apenas o frontend
- **Helmet** para headers de segurança
- **Autenticação JWT** via Supabase
- **Rate limiting** (pode ser adicionado)
- **Validação de dados** com Joi

## Deploy

Para deploy em produção, você pode:
1. Usar Docker Compose em um servidor
2. Deploy separado (backend no Heroku/Railway, frontend no Vercel/Netlify)
3. Kubernetes para orquestração avançada
