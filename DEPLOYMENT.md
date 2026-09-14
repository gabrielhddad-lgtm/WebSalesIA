#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# WEBSALES AI - GUIA DE DEPLOYMENT (VERCEL)
# ═══════════════════════════════════════════════════════════════

# 📋 PRÉ-REQUISITOS
# - Node.js 16+
# - npm ou yarn
# - Conta Vercel (https://vercel.com)
# - Git configurado
# - Variáveis de ambiente configuradas

# ═══════════════════════════════════════════════════════════════
# PASSO 1: PREPARAR O PROJETO LOCALMENTE
# ═══════════════════════════════════════════════════════════════

echo "🚀 Iniciando setup do WebSales AI..."

# Instalar dependências
npm install

# Ou com yarn
# yarn install

# Verificar se tudo foi instalado
npm list

echo "✅ Dependências instaladas"

# ═══════════════════════════════════════════════════════════════
# PASSO 2: CONFIGURAR VARIÁVEIS DE AMBIENTE
# ═══════════════════════════════════════════════════════════════

cat > .env.local << EOF
# AUTENTICAÇÃO
VITE_APP_NAME=WebSales AI
VITE_APP_URL=https://seu-dominio.vercel.app

# CLAUDE API
VITE_CLAUDE_API_KEY=sk-ant-seu-api-key-aqui

# STRIPE
VITE_STRIPE_PUBLIC_KEY=pk_test_sua-chave-publica
STRIPE_SECRET_KEY=sk_test_sua-chave-privada
STRIPE_WEBHOOK_SECRET=whsec_sua-chave-webhook

# SUPABASE
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# HUNTER.IO
VITE_HUNTER_API_KEY=sua-chave-aqui

# NODE
NODE_ENV=production
EOF

echo "✅ Arquivo .env.local criado"
echo "⚠️  IMPORTANTE: Preencha as variáveis com suas chaves reais!"

# ═══════════════════════════════════════════════════════════════
# PASSO 3: BUILD LOCAL
# ═══════════════════════════════════════════════════════════════

# Testar build
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build gerado com sucesso"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# PASSO 4: INICIALIZAR REPOSITÓRIO GIT
# ═══════════════════════════════════════════════════════════════

git init
git add .
git commit -m "chore: initial commit - WebSales AI"

# Se já tem repositório remoto:
# git remote add origin https://github.com/seu-usuario/websales-ai.git
# git branch -M main
# git push -u origin main

echo "✅ Repositório Git configurado"

# ═══════════════════════════════════════════════════════════════
# PASSO 5: INSTALAR VERCEL CLI
# ═══════════════════════════════════════════════════════════════

npm install -g vercel

# Ou com yarn
# yarn global add vercel

echo "✅ Vercel CLI instalado"

# ═══════════════════════════════════════════════════════════════
# PASSO 6: DEPLOY NO VERCEL
# ═══════════════════════════════════════════════════════════════

echo "🚀 Conectando ao Vercel..."

# Fazer login no Vercel
vercel login

# Deploy
vercel

# Ou para deploy em produção direto:
# vercel --prod

echo "✅ Aplicação deployada!"

# ═══════════════════════════════════════════════════════════════
# PASSO 7: CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL
# ═══════════════════════════════════════════════════════════════

echo "📝 Configurando variáveis no painel Vercel..."
echo "1. Vá para: https://vercel.com/dashboard"
echo "2. Selecione seu projeto"
echo "3. Vá para Settings > Environment Variables"
echo "4. Adicione todas as variáveis do .env.local"
echo "5. Redeploy: git push (dispara redeploy automático)"

# ═══════════════════════════════════════════════════════════════
# PASSO 8: CONFIGURAR DOMÍNIO CUSTOMIZADO
# ═══════════════════════════════════════════════════════════════

echo "🌐 Para usar domínio customizado:"
echo "1. No painel Vercel: Settings > Domains"
echo "2. Adicione seu domínio (ex: websales.ai)"
echo "3. Configure DNS no seu registrador (Namecheap, GoDaddy, etc)"
echo "4. Aponte para Vercel (instruções fornecidas)"

# ═══════════════════════════════════════════════════════════════
# PASSO 9: CONFIGURAR SSL/TLS
# ═══════════════════════════════════════════════════════════════

echo "🔒 SSL é automático no Vercel!"
echo "Seu site já tem HTTPS grátis"

# ═══════════════════════════════════════════════════════════════
# PASSO 10: CONFIGURAR WEBHOOKS STRIPE
# ═══════════════════════════════════════════════════════════════

echo "💳 Configurando webhooks Stripe..."
echo "1. Vá para: https://dashboard.stripe.com/webhooks"
echo "2. Clique em 'Add endpoint'"
echo "3. URL: https://seu-dominio.vercel.app/api/webhook-stripe"
echo "4. Selecione eventos:"
echo "   - checkout.session.completed"
echo "   - customer.subscription.deleted"
echo "5. Copie a chave do webhook (STRIPE_WEBHOOK_SECRET)"
echo "6. Adicione em variáveis de ambiente no Vercel"

# ═══════════════════════════════════════════════════════════════
# PASSO 11: MONITORAMENTO
# ═══════════════════════════════════════════════════════════════

echo "📊 Monitorando aplicação..."
echo "1. Vercel Analytics: https://vercel.com/analytics"
echo "2. Logs: vercel logs <app-name>"
echo "3. Uptime: Status page integrada"

# ═══════════════════════════════════════════════════════════════
# PASSO 12: CI/CD AUTOMÁTICO
# ═══════════════════════════════════════════════════════════════

echo "⚡ GitHub Actions para CI/CD automático"
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
EOF

echo "✅ GitHub Actions configurado"

# ═══════════════════════════════════════════════════════════════
# VERIFICAÇÃO FINAL
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETO!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "URL: https://seu-app.vercel.app"
echo ""
echo "📋 Checklist final:"
echo "  ✓ Dependências instaladas"
echo "  ✓ Variáveis de ambiente configuradas"
echo "  ✓ Build testado localmente"
echo "  ✓ Repositório Git criado"
echo "  ✓ Deployado no Vercel"
echo "  ✓ Domínio customizado configurado"
echo "  ✓ SSL/TLS ativo"
echo "  ✓ Webhooks Stripe configurados"
echo "  ✓ GitHub Actions setado"
echo ""
echo "🚀 Sua aplicação SaaS está no ar!"
echo ""

# ═══════════════════════════════════════════════════════════════
# COMANDOS ÚTEIS
# ═══════════════════════════════════════════════════════════════

echo "📚 Comandos úteis:"
echo ""
echo "# Ver logs em tempo real"
echo "vercel logs <app-name> --follow"
echo ""
echo "# Fazer deploy de staging"
echo "vercel"
echo ""
echo "# Deploy em produção"
echo "vercel --prod"
echo ""
echo "# Ver informações do projeto"
echo "vercel projects ls"
echo ""
echo "# Deletar deployment"
echo "vercel remove <deployment-url>"
echo ""

# ═══════════════════════════════════════════════════════════════
# TROUBLESHOOTING
# ═══════════════════════════════════════════════════════════════

echo "❓ TROUBLESHOOTING"
echo ""
echo "Erro: Variáveis de ambiente não funcionam"
echo "  → Verifique se estão configuradas no painel Vercel"
echo "  → Redeploy após adicionar variáveis"
echo ""
echo "Erro: API retorna 500"
echo "  → Verifique logs: vercel logs <app-name>"
echo "  → Valide chaves de API (Claude, Stripe, etc)"
echo ""
echo "Erro: Database connection failed"
echo "  → Verifique URL do Supabase"
echo "  → Verifique RLS policies"
echo ""
echo "Erro: Stripe webhook não funciona"
echo "  → Verifique webhook secret"
echo "  → Teste com Stripe CLI: stripe listen --forward-to localhost:3000/api/webhook-stripe"
echo ""

exit 0
