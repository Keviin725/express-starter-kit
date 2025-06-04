# Documentação da API - Express Starter Kit

## Configuração do Ambiente

As variáveis de ambiente necessárias estão definidas no arquivo `.env`:

- `PORT`: Porta onde o servidor será executado (ex: 3000)
- `MONGODB_URI`: URI de conexão com o banco de dados MongoDB
- `JWT_SECRET`: Chave secreta para assinatura dos tokens JWT
- `JWT_REFRESH_SECRET`: Chave secreta para assinatura dos tokens de refresh JWT
- `SMTP_HOST`: Host do servidor SMTP para envio de emails
- `SMTP_PORT`: Porta do servidor SMTP
- `SMTP_USER`: Usuário para autenticação SMTP
- `SMTP_PASS`: Senha para autenticação SMTP
- `SMTP_FROM`: Endereço de email remetente para emails enviados
- `APP_URL`: URL base da aplicação (ex: http://localhost:3000)

## Endpoints de Autenticação

### Registro de Usuário

- **URL:** `/api/auth/register`
- **Método:** `POST`
- **Descrição:** Registra um novo usuário, envia email de verificação e retorna tokens JWT.
- **Parâmetros (JSON):**
  - `phone` (string) - Telefone do usuário
  - `email` (string) - Email do usuário
  - `password` (string) - Senha do usuário
  - `name` (string) - Nome do usuário
- **Resposta de Sucesso:**
  - `accessToken`: Token JWT de acesso
  - `refreshToken`: Token JWT de refresh
  - `user`: Dados do usuário (id, phone, email, name, isVerified)

### Login

- **URL:** `/api/auth/login`
- **Método:** `POST`
- **Descrição:** Autentica usuário pelo telefone e senha, retorna tokens JWT.
- **Parâmetros (JSON):**
  - `phone` (string)
  - `password` (string)
- **Resposta de Sucesso:**
  - `accessToken`, `refreshToken`, `user` (dados do usuário)

### Verificação de Email

- **URL:** `/api/auth/verify-email/:token`
- **Método:** `GET`
- **Descrição:** Verifica o email do usuário usando o token enviado por email.
- **Resposta de Sucesso:** Mensagem de confirmação da verificação.

### Esqueci a Senha

- **URL:** `/api/auth/forgot-password`
- **Método:** `POST`
- **Descrição:** Envia email para redefinição de senha com token temporário.
- **Parâmetros (JSON):**
  - `email` (string)
- **Resposta de Sucesso:** Mensagem confirmando envio do email.

### Redefinir Senha

- **URL:** `/api/auth/reset-password/:token`
- **Método:** `POST`
- **Descrição:** Redefine a senha do usuário usando o token enviado por email.
- **Parâmetros (JSON):**
  - `password` (string) - Nova senha
- **Resposta de Sucesso:** Mensagem confirmando a redefinição da senha.

### Refresh Token

- **URL:** `/api/auth/refresh-token`
- **Método:** `POST`
- **Descrição:** Gera novos tokens JWT usando o refresh token.
- **Parâmetros (JSON):**
  - `refreshToken` (string)
- **Resposta de Sucesso:** Novos tokens JWT (`accessToken` e `refreshToken`).

### Rota Protegida - Perfil do Usuário

- **URL:** `/api/auth/me`
- **Método:** `GET`
- **Descrição:** Retorna os dados do usuário autenticado. Requer token de acesso válido no header `Authorization`.

---

## Considerações

- Os tokens JWT expiram em 1 hora (accessToken) e 7 dias (refreshToken).
- Os tokens de verificação e redefinição de senha possuem validade limitada (24 horas e 1 hora, respectivamente).
- A aplicação possui limitação de taxa para requisições de redefinição de senha para evitar abusos.

