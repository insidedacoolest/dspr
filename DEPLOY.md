# DSPR / D-Spare Garage — publicar o site

Mesmo sistema dos sites Drift Factory e Akina: Next.js + base de dados SQLite (Prisma) +
painel de administração. O site público está em inglês; o painel também.
Precisa de um servidor Node.js (ex. cPanel → "Setup Node.js App").

## 1. Criar a app no cPanel
- **Node.js version**: 20.9 ou superior (idealmente 22+)
- **Application mode**: Production
- **Application startup file**: `server.js`

## 2. Enviar os ficheiros
Envia tudo **exceto** `node_modules`, `.next` e `app/generated`.

## 3. Variáveis de ambiente (`.env` ou painel do cPanel)
```
DATABASE_URL="file:./dev.db"
SESSION_SECRET="um-valor-aleatorio-longo"
ADMIN_EMAIL="email-do-cliente@dominio.com"
ADMIN_PASSWORD="uma-password-forte"
```

### Pagamentos (PayPal + cartão) e emails
```
SITE_URL="https://dominio-do-cliente.com"

PAYPAL_ENV="live"                 # "sandbox" para testes
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."

SMTP_HOST="mail.dominio-do-cliente.com"
SMTP_PORT="465"
SMTP_USER="shop@dominio-do-cliente.com"
SMTP_PASS="..."
MAIL_FROM="D-Spare Garage <shop@dominio-do-cliente.com>"
```
- **PayPal**: em developer.paypal.com → *Apps & Credentials* → criar app (conta **Business** do cliente).
  Usar as chaves *Sandbox* para testar e as *Live* para vender. O botão "Debit or Credit Card"
  permite pagar com cartão sem conta PayPal.
- **Email**: qualquer SMTP serve (email do cPanel da Namecheap, Private Email, Resend…).
  Sem SMTP configurado, os emails são gravados em `mail-outbox/` (útil só em desenvolvimento).
- O email que recebe os avisos de encomenda define-se no painel: *Site content → Contact & social*.
- Portes (valor fixo e "grátis acima de") em *Site content → Shop*.

## 4. Instalar, preparar a base de dados e compilar
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.mjs   # só na 1ª vez: cria o admin + dados de exemplo (APAGA pilotos/produtos/etc.)
npm run build
```
Depois clica **Restart** na app do cPanel.

## 5. Usar
- Site: o domínio
- Painel: `/admin/login` com o email/password do passo 3 (muda-se depois em Admin → Account)
- **Admin → Site content**: todos os textos, fotos, contactos, logo e SEO, separados por página.

## Notas
- As fotos de exemplo são miniaturas do YouTube do Brandon — substituir por fotos reais no painel.
- Imagens carregadas no painel ficam em `public/uploads/` — a pasta precisa de permissão de escrita.
- Faz cópias de segurança regulares do `dev.db` (encomendas, marcações e conteúdos).
- **Não corras o seed depois de ir ao ar** — substitui os conteúdos pelos de exemplo.

## Desenvolvimento local
```bash
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.mjs
npx next dev -p 3003
```
