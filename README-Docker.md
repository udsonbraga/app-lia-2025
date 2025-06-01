
# Docker Setup - Python/Django Backend

Este projeto utiliza Docker para facilitar o desenvolvimento e deployment. O backend é desenvolvido em Python com Django.

## Arquitetura

- **Frontend**: React + TypeScript + Vite (servido via Nginx)
- **Backend**: Python + Django + Django REST Framework
- **Banco de Dados**: PostgreSQL
- **Cache/Queue**: Redis
- **Task Queue**: Celery

## Pré-requisitos

- Docker
- Docker Compose

## Como executar

### 1. Clone o repositório
```bash
git clone <repo-url>
cd lia-project
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

### 3. Execute o projeto
```bash
docker-compose up --build
```

### 4. Acesse a aplicação
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

## Comandos úteis

### Executar migrações
```bash
docker-compose exec backend python manage.py migrate
```

### Criar superusuário
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Visualizar logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery
```

### Parar os serviços
```bash
docker-compose down
```

### Rebuildar apenas um serviço
```bash
docker-compose up --build backend
```

## Estrutura do Projeto

```
lia-project/
├── lia_project/          # Configurações principais do Django
├── accounts/             # App de autenticação e usuários
├── diary/               # App do diário
├── contacts/            # App de contatos de segurança
├── emergency/           # App de emergência
├── src/                 # Frontend React
├── docker-compose.yml   # Configuração do Docker
├── Dockerfile.python    # Dockerfile para o backend Python
├── Dockerfile          # Dockerfile para o frontend
├── requirements.txt    # Dependências Python
└── manage.py          # Django management script
```

## Desenvolvimento

### Backend (Django)
- O código do backend está em Python/Django
- APIs REST disponíveis em `/api/`
- Admin interface em `/admin/`

### Frontend (React)
- Código em TypeScript
- Vite como bundler
- Servido via Nginx em produção

### Banco de Dados
- PostgreSQL como banco principal
- Redis para cache e filas de tarefas

## Troubleshooting

### Erro de conexão com banco
```bash
docker-compose down
docker-compose up --build
```

### Reinstalar dependências
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Acessar container
```bash
docker-compose exec backend bash
docker-compose exec frontend sh
```
