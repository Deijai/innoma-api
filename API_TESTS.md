# 🚀 API COMPLETA - Sistema de Agendamentos

## 🔐 1. Autenticação

### Login
```http
POST http://localhost:3100/api/auth/signin
Content-Type: application/json

{
  "email": "admin@sistema.com",
  "password": "admin123"
}
```

---

## 🏥 2. Especialidades (COM PAGINAÇÃO)

### 2.1 Listar Especialidades com Paginação
```http
GET http://localhost:3100/api/specialties?page=1&limit=5
Authorization: Bearer TOKEN
```

### 2.2 Listar Especialidades com Filtros
```http
GET http://localhost:3100/api/specialties?search=cardio&isActive=true&page=1&limit=10
Authorization: Bearer TOKEN
```

### 2.3 Criar Especialidade
```http
POST http://localhost:3100/api/specialties
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Endocrinologia",
  "description": "Especialidade que trata distúrbios hormonais"
}
```

---

## 👥 3. Usuários (CRUD COMPLETO + MELHORIAS)

### 3.1 Listar Usuários com Filtros Avançados
```http
GET http://localhost:3100/api/users?roles=DOCTOR&specialties=ID_CARDIOLOGIA&page=1&limit=10
Authorization: Bearer TOKEN
```

### 3.2 Buscar Médicos por Especialidade
```http
GET http://localhost:3100/api/users/doctors-by-specialty/ID_ESPECIALIDADE?page=1&limit=5
Authorization: Bearer TOKEN
```

### 3.3 Estatísticas do Sistema (ADMIN only)
```http
GET http://localhost:3100/api/users/stats
Authorization: Bearer TOKEN_ADMIN
```

**Resposta esperada:**
```json
{
  "totalUsers": 15,
  "totalDoctors": 5,
  "totalPatients": 8,
  "totalActiveUsers": 14,
  "totalInactiveUsers": 1,
  "totalSpecialties": 7,
  "totalActiveSpecialties": 7,
  "usersByRole": {
    "USER": 2,
    "DOCTOR": 5,
    "ADMIN": 1,
    "PATIENT": 8
  }
}
```

### 3.4 Verificar Email Disponível
```http
POST http://localhost:3100/api/users/check-email
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "email": "teste@email.com"
}
```

**Resposta esperada:**
```json
{
  "email": "teste@email.com",
  "available": true,
  "message": "Email is available"
}
```

### 3.5 Criar Médico (com validação de CRM único)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Dr. Carlos Silva",
  "email": "dr.carlos@email.com",
  "password": "123456",
  "roles": ["DOCTOR"],
  "specialties": ["ID_CARDIOLOGIA", "ID_CLINICA_GERAL"],
  "crm": "12345-SP",
  "phone": "11999999999"
}
```

---

## 🎯 4. NOVAS VALIDAÇÕES IMPLEMENTADAS

### ✅ CRM Único
```http
# Tentar criar médico com CRM duplicado (deve dar erro)
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Dr. Outro",
  "email": "dr.outro@email.com", 
  "password": "123456",
  "roles": ["DOCTOR"],
  "specialties": ["ID_CARDIOLOGIA"],
  "crm": "12345-SP"
}
```
**❌ Erro esperado:** `"CRM already exists"`

### ✅ Especialidades apenas para DOCTOR
```http
# Tentar criar USER com especialidades (deve dar erro)
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "User com Especialidade",
  "email": "user@email.com",
  "password": "123456", 
  "roles": ["USER"],
  "specialties": ["ID_CARDIOLOGIA"]
}
```
**❌ Erro esperado:** `"Only DOCTOR users can have specialties"`

---

## 📊 5. EXEMPLOS DE RESPOSTAS PAGINADAS

### Especialidades:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Cardiologia",
      "description": "Especialidade do coração",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 7,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Usuários:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Dr. Carlos Silva",
      "email": "dr.carlos@email.com",
      "roles": ["DOCTOR"],
      "specialties": [
        {
          "id": "...",
          "name": "Cardiologia",
          "description": "..."
        }
      ],
      "crm": "12345-SP",
      "phone": "11999999999",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

### Médicos por Especialidade:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Dr. João Cardiologista",
      "email": "dr.joao@email.com",
      "roles": ["DOCTOR"],
      "specialties": [
        {
          "id": "...",
          "name": "Cardiologia",
          "description": "..."
        }
      ],
      "crm": "54321-RJ",
      "isActive": true
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

---

## 🔍 6. FILTROS DISPONÍVEIS

### Especialidades:
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `isActive` - true/false (padrão: true)
- `search` - Buscar no nome ou descrição

### Usuários:
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `roles` - Array de roles: USER, DOCTOR, ADMIN, PATIENT
- `isActive` - true/false
- `search` - Buscar no nome ou email
- `specialties` - Array de IDs de especialidades

---

## 🧪 7. CHECKLIST DE TESTES

### ✅ Paginação:
- [ ] Especialidades com page/limit
- [ ] Usuários com page/limit
- [ ] Médicos por especialidade com page/limit

### ✅ Filtros:
- [ ] Usuários por role
- [ ] Usuários por especialidade
- [ ] Busca por nome/email

### ✅ Validações:
- [ ] CRM único entre médicos
- [ ] Especialidades apenas para DOCTOR
- [ ] Email único no sistema

### ✅ Funcionalidades Especiais:
- [ ] Estatísticas do sistema (ADMIN)
- [ ] Verificação de email disponível
- [ ] Busca de médicos por especialidade

---

## 🚀 8. PRÓXIMOS PASSOS

Com todas essas funcionalidades implementadas, o sistema está pronto para:

1. **Agendamentos** - Relacionar médicos, pacientes e horários
2. **Dashboard** - Usar as estatísticas para gráficos
3. **Busca Avançada** - Sistema completo de filtros
4. **Relatórios** - Dados organizados e paginados

---

**🎉 SISTEMA COMPLETO E OTIMIZADO! 🎉**