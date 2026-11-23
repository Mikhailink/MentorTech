# MentorTech

Plataforma web de mentoria em tecnologia com autenticação, sprints, code reviews e aprovação de responsável para usuários menores de idade.

## Requisitos

- Node.js 20+
- MongoDB Atlas
- Chave do Resend e domínio verificado para envio de e-mails em produção

## Rodar localmente

1. Instale as dependências: `npm install`
2. Copie `.env.example` para `.env.local` e preencha as variáveis.
3. Gere um segredo com `openssl rand -base64 32`.
4. Inicie o projeto com `npm run dev`.

## MongoDB Atlas

1. Crie um cluster no MongoDB Atlas.
2. Em **Database Access**, crie um usuário de banco com senha forte.
3. Em **Network Access**, autorize a rede de saída adequada para o ambiente. Evite liberar acesso amplo permanentemente.
4. Em **Connect > Drivers**, copie a connection string e substitua usuário, senha e nome do banco.
5. Configure a URI em `MONGODB_URI`.

## Resend

1. Crie uma chave de API no Resend.
2. Verifique o domínio de envio ou use o domínio de teste conforme as limitações do serviço.
3. Configure `RESEND_API_KEY` e `RESEND_FROM_EMAIL`.
4. Em produção, o envio do link de aprovação falha se a chave não estiver definida.

## Deploy na Vercel

1. Importe o repositório no painel da Vercel.
2. Configure as variáveis de `.env.example` em **Project Settings > Environment Variables**.
3. Use a URL pública HTTPS em `NEXTAUTH_URL` e `GUARDIAN_APPROVAL_BASE_URL`.
4. Configure a allowlist do Atlas para permitir a conexão da aplicação.
5. Faça o deploy e teste cadastro, login, link de aprovação e bloqueio das APIs.

## Teste do controle parental

1. Cadastre um mentee com idade menor que 18 e e-mail de responsável.
2. Em desenvolvimento sem Resend, copie do console o link de aprovação.
3. Antes da aprovação, tente acessar `/dashboard/mentee` e as APIs protegidas: o acesso deve ser bloqueado.
4. Abra o link de aprovação e entre com o e-mail do responsável por link mágico.
5. Após a aprovação, o acesso às APIs é permitido mediante nova sessão.

## Observações

- A aprovação do cadastro e a aprovação de uma mentoria são controles distintos.
- O endpoint de aprovação do responsável usa um token de uso único com expiração.
- Antes de produção, configure monitoramento, política de retenção de dados, rate limiting, backup e revisão de segurança.