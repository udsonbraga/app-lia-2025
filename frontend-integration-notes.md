
# Notas de Integração Frontend -> Django

## Mudanças Necessárias no Frontend

### 1. Atualizar URL da API

No arquivo `src/services/api.ts`, alterar:
```typescript
const API_BASE_URL = 'http://localhost:8000/api'; // Era 3001, agora 8000
```

### 2. Estrutura de Resposta das APIs

As APIs Django retornam estruturas ligeiramente diferentes:

**Diário:**
- GET `/api/diary/` retorna `{ entries: [...] }`
- POST `/api/diary/` retorna `{ entry: {...} }`

**Contatos:**
- GET `/api/contacts/` retorna `{ contacts: [...] }`
- POST `/api/contacts/` retorna `{ contact: {...} }`

### 3. Autenticação

O Django usa **Token Authentication**. O token é retornado em:
```json
{
  "session": {
    "access_token": "token_aqui"
  }
}
```

### 4. Campo 'text' vs 'content'

No frontend, DiaryEntry usa `text`, mas Django usa `content`.
O serializer já trata isso automaticamente.

### 5. Anexos

Django suporta upload real de arquivos, diferente do Supabase Storage.
Os anexos ficam em `/media/diary_attachments/`.

## Vantagens da Migração

1. **Admin Interface** - Gerenciar dados via web
2. **ORM Robusto** - Queries complexas mais fáceis
3. **Middlewares** - Segurança, CORS, cache automáticos
4. **Extensibilidade** - Fácil adicionar ML, analytics, etc.
5. **Deploy Flexível** - Heroku, Railway, VPS, etc.

## Banco de Dados

### Tabelas Criadas:
- `accounts_user` - Usuários (substitui auth.users)
- `accounts_userprofile` - Perfis de usuário
- `accounts_userdisguisesettings` - Configurações de disfarce
- `accounts_userfeedback` - Feedback dos usuários
- `diary_diaryentry` - Entradas do diário
- `diary_diaryattachment` - Anexos do diário
- `contacts_safecontact` - Contatos seguros
- `contacts_emergencycontact` - Contatos de emergência
- `emergency_emergencyalert` - Alertas de emergência

### Compatibilidade com Supabase:
- Mantém UUIDs como chaves primárias
- Estrutura similar de dados
- Campos created_at/updated_at preservados
