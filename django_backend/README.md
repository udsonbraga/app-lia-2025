
# Lia - Django Backend

Backend Django REST Framework para o aplicativo Lia de segurança feminina.

## Funcionalidades

- **Autenticação** com JWT/Token
- **Diário Seguro** com anexos
- **Contatos Seguros** e de emergência
- **Alertas de Emergência**
- **Interface Admin** completa
- **API REST** documentada

## Configuração Rápida

### 1. Instalar Dependências

```bash
cd django_backend
pip install -r requirements.txt
```

### 2. Configurar Banco de Dados

```bash
# Criar arquivo .env baseado no .env.example
cp .env.example .env

# Editar .env com suas configurações de banco
```

### 3. Executar Migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Criar Superusuário

```bash
python manage.py createsuperuser
```

### 5. Executar Servidor

```bash
python manage.py runserver
```

## Usando com Docker

```bash
# Executar com Docker Compose
docker-compose -f docker-compose.django.yml up --build

# Executar migrações
docker-compose -f docker-compose.django.yml exec web python manage.py migrate

# Criar superusuário
docker-compose -f docker-compose.django.yml exec web python manage.py createsuperuser
```

## APIs Disponíveis

### Autenticação
- `POST /api/auth/signup` - Criar conta
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET/PUT /api/auth/profile/` - Perfil do usuário

### Diário
- `GET/POST /api/diary/` - Listar/Criar entradas
- `GET/PUT/DELETE /api/diary/{id}/` - Gerenciar entrada específica

### Contatos
- `GET/POST /api/contacts/` - Contatos seguros
- `GET/PUT/DELETE /api/contacts/{id}/` - Gerenciar contato
- `GET/POST /api/contacts/emergency/` - Contatos de emergência

### Emergência
- `POST /api/emergency/alert` - Enviar alerta
- `GET /api/emergency/alerts/` - Histórico de alertas

## Estrutura do Projeto

```
django_backend/
├── lia_project/          # Configurações principais
├── accounts/             # Autenticação e usuários
├── diary/               # Diário seguro
├── contacts/            # Contatos seguros
├── emergency/           # Sistema de emergência
├── requirements.txt     # Dependências
└── manage.py           # CLI do Django
```

## Migração de Dados

Para migrar dados do Supabase para PostgreSQL, você pode:

1. Exportar dados do Supabase
2. Executar o script de migração (a ser criado)
3. Importar para o novo banco PostgreSQL

## Admin Interface

Acesse `/admin/` para gerenciar dados através da interface administrativa do Django.

## Próximos Passos

1. Implementar envio real de SMS/Email para emergências
2. Adicionar análise de sentimentos nos relatos do diário
3. Implementar notificações push
4. Adicionar sistema de backup automático
5. Configurar monitoramento e logs
