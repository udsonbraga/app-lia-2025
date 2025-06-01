
# Guia de Migração: Node.js + Supabase → Django + PostgreSQL

## 1. Preparação do Ambiente Django

### Instalar Python e Dependências
```bash
cd django_backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### Configurar Banco PostgreSQL
```bash
# Instalar PostgreSQL
# Ubuntu: sudo apt install postgresql postgresql-contrib
# Mac: brew install postgresql
# Windows: Download do site oficial

# Criar banco
sudo -u postgres psql
CREATE DATABASE lia_db;
CREATE USER lia_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE lia_db TO lia_user;
\q
```

### Configurar .env
```env
SECRET_KEY=sua-secret-key-super-segura
DEBUG=True
DB_NAME=lia_db
DB_USER=lia_user
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

## 2. Executar Migrações Django

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

## 3. Migrar Dados do Supabase

### Script de Migração (Python)
```python
# migration_script.py
import os
import django
import json
from datetime import datetime
from supabase import create_client, Client

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lia_project.settings')
django.setup()

from accounts.models import User, UserProfile
from diary.models import DiaryEntry
from contacts.models import SafeContact

# Conectar ao Supabase
supabase: Client = create_client(
    "SUA_SUPABASE_URL",
    "SUA_SUPABASE_KEY"
)

def migrate_users():
    # Buscar usuários do Supabase
    users_data = supabase.table('profiles').select('*').execute()
    
    for user_data in users_data.data:
        # Criar usuário Django
        user, created = User.objects.get_or_create(
            id=user_data['id'],
            defaults={
                'email': user_data.get('email', ''),
                'name': user_data.get('name', ''),
                'phone': user_data.get('phone', ''),
                'username': user_data.get('email', user_data['id'])
            }
        )
        
        # Criar perfil
        UserProfile.objects.get_or_create(user=user)
        
        print(f"Migrated user: {user.email}")

def migrate_diary_entries():
    entries_data = supabase.table('diary_entries').select('*').execute()
    
    for entry_data in entries_data.data:
        try:
            user = User.objects.get(id=entry_data['user_id'])
            
            DiaryEntry.objects.get_or_create(
                id=entry_data['id'],
                defaults={
                    'user': user,
                    'title': entry_data.get('title', ''),
                    'content': entry_data.get('content', ''),
                    'date': entry_data.get('date'),
                    'mood': entry_data.get('mood'),
                    'location': entry_data.get('location'),
                    'attachments': entry_data.get('attachments', []),
                    'created_at': entry_data.get('created_at'),
                    'updated_at': entry_data.get('updated_at')
                }
            )
            print(f"Migrated diary entry: {entry_data['id']}")
        except User.DoesNotExist:
            print(f"User not found for diary entry: {entry_data['id']}")

def migrate_contacts():
    contacts_data = supabase.table('safe_contacts').select('*').execute()
    
    for contact_data in contacts_data.data:
        try:
            user = User.objects.get(id=contact_data['user_id'])
            
            SafeContact.objects.get_or_create(
                id=contact_data['id'],
                defaults={
                    'user': user,
                    'name': contact_data.get('name', ''),
                    'phone': contact_data.get('phone', ''),
                    'email': contact_data.get('email', ''),
                    'relationship': contact_data.get('relationship', ''),
                    'created_at': contact_data.get('created_at'),
                    'updated_at': contact_data.get('updated_at')
                }
            )
            print(f"Migrated contact: {contact_data['name']}")
        except User.DoesNotExist:
            print(f"User not found for contact: {contact_data['id']}")

if __name__ == "__main__":
    print("Iniciando migração...")
    migrate_users()
    migrate_diary_entries()
    migrate_contacts()
    print("Migração concluída!")
```

## 4. Atualizar Frontend

### 4.1 Variável de Ambiente
```env
# .env.local
VITE_DJANGO_API_URL=http://localhost:8000/api
```

### 4.2 Substituir apiService
```typescript
// Em vez de:
import { apiService } from "@/services/api";

// Use:
import { djangoApiService as apiService } from "@/services/djangoApi";
```

### 4.3 Atualizar AuthService
```typescript
// src/features/auth/services/authService.ts
import { djangoApiService as apiService } from "@/services/djangoApi";
// ... resto permanece igual
```

## 5. Testar Integração

### Backend Django
```bash
cd django_backend
python manage.py runserver 8000
```

### Frontend React
```bash
npm run dev  # Porta 8080
```

### Testar Endpoints
- Login: POST localhost:8000/api/auth/signin
- Diário: GET localhost:8000/api/diary/
- Admin: localhost:8000/admin/

## 6. Deploy

### Opções de Deploy Django:
1. **Heroku** - Fácil para começar
2. **Railway** - Moderno e simples
3. **DigitalOcean App Platform** - Escalável
4. **VPS próprio** - Máximo controle

### Exemplo Heroku:
```bash
# Instalar Heroku CLI
pip install gunicorn
echo "web: gunicorn lia_project.wsgi" > Procfile
echo "python-3.11.0" > runtime.txt

# Deploy
heroku create lia-django-backend
heroku addons:create heroku-postgresql:mini
heroku config:set DEBUG=False
git push heroku main
heroku run python manage.py migrate
```

## 7. Benefícios da Migração

✅ **Admin Interface** - Gerenciar dados visualmente
✅ **ORM Robusto** - Queries complexas fáceis  
✅ **Middlewares** - Segurança automática
✅ **Extensibilidade** - ML, analytics, etc.
✅ **Comunidade** - Vasta documentação
✅ **Deploy Flexível** - Muitas opções

## 8. Próximos Passos

1. Executar script de migração
2. Testar todas as funcionalidades
3. Configurar deploy do Django
4. Implementar novas features (ML, analytics)
5. Configurar backup automático
6. Adicionar monitoramento
