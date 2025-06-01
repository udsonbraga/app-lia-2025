
# Lia - Docker Setup

Este projeto agora usa uma arquitetura completa com Django backend e React frontend.

## Estrutura do Projeto

```
├── django_backend/          # Backend Django
│   ├── lia_project/        # Configurações do projeto
│   ├── accounts/           # App de autenticação
│   ├── diary/              # App de diário
│   ├── contacts/           # App de contatos
│   ├── emergency/          # App de emergência
│   ├── Dockerfile.django   # Docker para backend
│   └── requirements.txt    # Dependências Python
├── src/                    # Frontend React
├── Dockerfile              # Docker para frontend
├── docker-compose.yml      # Orquestração completa
└── nginx.conf              # Configuração do servidor web
```

## Tecnologias

### Backend
- **Django** + **Django REST Framework**
- **PostgreSQL** (banco de dados)
- **Redis** (cache e Celery)
- **Celery** (tarefas assíncronas)

### Frontend
- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **Shadcn UI**
- **Nginx** (servidor web)

## Como Executar

### Desenvolvimento com Docker (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up --build

# Acessar:
# Frontend: http://localhost:8080
# Backend API: http://localhost:8000/api
# Admin Django: http://localhost:8000/admin
```

### Desenvolvimento Local (Alternativo)

1. **Backend Django:**
```bash
cd django_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

2. **Frontend React:**
```bash
# Configurar variável de ambiente
echo "VITE_DJANGO_API_URL=http://localhost:8000/api" > .env.local

npm install
npm run dev     # Roda na porta 8080
```

## Serviços Docker

- **db**: PostgreSQL database
- **redis**: Redis para cache e Celery
- **backend**: Django API server
- **celery**: Worker para tarefas assíncronas
- **frontend**: React app servido pelo Nginx

## Comandos Úteis

```bash
# Ver logs dos serviços
docker-compose logs -f backend
docker-compose logs -f frontend

# Executar migrações
docker-compose exec backend python manage.py migrate

# Criar superuser
docker-compose exec backend python manage.py createsuperuser

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## Configuração de Produção

Para produção, ajuste:

1. **Backend (.env no django_backend/):**
```
DEBUG=False
SECRET_KEY=your-secret-key
DB_HOST=your-db-host
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

2. **Frontend:**
```
VITE_DJANGO_API_URL=https://your-api-domain.com/api
```

## API Endpoints

### Autenticação
- `POST /api/auth/signin/` - Login
- `POST /api/auth/signup/` - Registro
- `POST /api/auth/signout/` - Logout
- `GET /api/auth/profile/` - Perfil do usuário

### Diário
- `GET /api/diary/` - Listar entradas
- `POST /api/diary/` - Criar entrada
- `PUT /api/diary/{id}/` - Atualizar entrada
- `DELETE /api/diary/{id}/` - Deletar entrada

### Contatos
- `GET /api/contacts/` - Listar contatos
- `POST /api/contacts/` - Criar contato
- `PUT /api/contacts/{id}/` - Atualizar contato
- `DELETE /api/contacts/{id}/` - Deletar contato

### Emergência
- `POST /api/emergency/alert` - Enviar alerta de emergência
- `GET /api/emergency/alerts/` - Listar alertas

## Problemas Comuns

1. **Erro de conexão com banco**: Aguarde o PostgreSQL inicializar completamente
2. **CORS Error**: Verifique se `CORS_ALLOWED_ORIGINS` está configurado corretamente
3. **Migrations**: Execute `docker-compose exec backend python manage.py migrate`
