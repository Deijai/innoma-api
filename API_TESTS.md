# 🧪 Testes de Validação - Especialidades APENAS para DOCTOR

## ✅ Testes que devem FUNCIONAR

### 1. Criar DOCTOR com especialidades (✅ OK)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Dr. João Silva",
  "email": "dr.joao@email.com",
  "password": "123456",
  "roles": ["DOCTOR"],
  "specialties": ["ID_CARDIOLOGIA"],
  "crm": "12345-SP"
}
```

### 2. Criar USER sem especialidades (✅ OK)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "password": "123456",
  "roles": ["USER"],
  "phone": "11999999999"
}
```

### 3. Criar PATIENT sem especialidades (✅ OK)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Ana Costa",
  "email": "ana@email.com",
  "password": "123456",
  "roles": ["PATIENT"],
  "birthDate": "1990-05-15",
  "cpf": "12345678901"
}
```

---

## ❌ Testes que devem dar ERRO

### 1. DOCTOR sem especialidades (❌ DEVE DAR ERRO)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Dr. Sem Especialidade",
  "email": "dr.sem@email.com",
  "password": "123456",
  "roles": ["DOCTOR"]
}
```
**Erro esperado:** `"DOCTOR must have at least one specialty"`

### 2. USER com especialidades (❌ DEVE DAR ERRO)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "João User",
  "email": "joao.user@email.com",
  "password": "123456",
  "roles": ["USER"],
  "specialties": ["ID_CARDIOLOGIA"]
}
```
**Erro esperado:** `"Only DOCTOR users can have specialties"`

### 3. PATIENT com CRM (❌ DEVE DAR ERRO)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Paciente com CRM",
  "email": "paciente@email.com",
  "password": "123456",
  "roles": ["PATIENT"],
  "crm": "12345-SP"
}
```
**Erro esperado:** `"Only DOCTOR users can have CRM"`

### 4. ADMIN com especialidades (❌ DEVE DAR ERRO)
```http
POST http://localhost:3100/api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Admin com Especialidade",
  "email": "admin2@email.com",
  "password": "123456",
  "roles": ["ADMIN"],
  "specialties": ["ID_CARDIOLOGIA"]
}
```
**Erro esperado:** `"Only DOCTOR users can have specialties"`

---

## 🔄 Testes de Atualização

### 1. Alterar USER para DOCTOR (deve exigir especialidades)
```http
PUT http://localhost:3100/api/users/ID_DO_USER
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "roles": ["DOCTOR"]
}
```
**Erro esperado:** `"DOCTOR must have at least one specialty"`

### 2. Alterar USER para DOCTOR com especialidades (✅ OK)
```http
PUT http://localhost:3100/api/users/ID_DO_USER
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "roles": ["DOCTOR"],
  "specialties": ["ID_CARDIOLOGIA"],
  "crm": "54321-RJ"
}
```

### 3. Alterar DOCTOR para USER (deve remover especialidades)
```http
PUT http://localhost:3100/api/users/ID_DO_DOCTOR
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "roles": ["USER"]
}
```
**Resultado esperado:** Especialidades e CRM devem ser removidos automaticamente

---

## 📋 Checklist de Validações

- ✅ **DOCTOR OBRIGATORIAMENTE** tem specialties
- ✅ **Apenas DOCTOR** pode ter specialties
- ✅ **Apenas DOCTOR** pode ter CRM
- ✅ **USER, PATIENT, ADMIN** NÃO podem ter specialties
- ✅ **Ao alterar role para DOCTOR** deve fornecer specialties
- ✅ **Ao alterar role de DOCTOR para outro** remove specialties automaticamente
- ✅ **Especialidades devem existir** e estar ativas
- ✅ **Formato de ObjectId** deve ser válido

---

## 🎯 Exemplo de Estrutura de Resposta DOCTOR

```json
{
  "id": "...",
  "name": "Dr. João Silva",
  "email": "dr.joao@email.com",
  "roles": ["DOCTOR"],
  "phone": "11888888888",
  "isActive": true,
  "specialties": [
    {
      "id": "...",
      "name": "Cardiologia",
      "description": "Especialidade médica dedicada ao coração"
    }
  ],
  "crm": "12345-SP",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Exemplo de Estrutura de Resposta USER/PATIENT

```json
{
  "id": "...",
  "name": "Maria Santos",
  "email": "maria@email.com",
  "roles": ["USER"],
  "phone": "11999999999",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
  // ✅ Note que NÃO tem specialties nem crm
}
```