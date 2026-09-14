# 🚀 WEBSALES AI - SaaS para Vender Sites com Inteligência Artificial

![WebSales AI](/public/logo.svg)

## 📋 Sobre

**WebSales AI** é uma plataforma SaaS moderna que usa Claude (Inteligência Artificial) para ajudar profissionais de vendas a vender sites para pequenas empresas de forma escalável e eficiente.

### O Problema
- 20 milhões de pequenas empresas na América Latina não têm website
- Consultores de vendas de sites precisam de 50+ leads para fechar 1 venda
- Gerar propostas personalizadas leva horas

### A Solução
- **IA integrada:** Claude gera prompts em segundos
- **Busca automática:** Encontra empresas sem site em um nicho/região
- **Rastreador:** Acompanha leads no funil de vendas
- **ROI transparente:** Calcula exatamente quanto cada projeto vale

---

## ⚡ Features Principais

✅ **Busca de Empresas** - Encontra negócios sem site usando web scraping
✅ **Gerador de Prompts com IA** - Claude personaliza mensagens de abordagem
✅ **Rastreador de Leads** - Acompanhe funil de vendas em tempo real
✅ **Dashboard Analytics** - Veja ROI, conversões, receita
✅ **Integração Stripe** - Pagamentos recorrentes
✅ **Autenticação JWT** - Segurança de dados com RLS
✅ **Modo Dark/Light** - Interface moderna e responsiva

---

## 🏗️ Arquitetura Técnica

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** - Estilo utilitário
- **Framer Motion** - Animações suaves
- **React Hook Form** + Zod - Validação
- **Axios** - HTTP client

### Backend
- **Vercel Functions** - APIs serverless
- **Claude API** - Inteligência artificial
- **Supabase PostgreSQL** - Banco de dados
- **Stripe** - Pagamentos

### Hospedagem
- **Vercel** - Frontend + APIs
- **Supabase** - Database
- **CDN Vercel** - Distribuição global

---

## 📁 Estrutura do Projeto

```
websales-ai/
├── 📄 websales-ai-app.jsx          # App React principal
├── 📄 stripe-integration.jsx       # Componentes de pagamento
├── 📄 hooks.ts                     # Hooks customizados
├── 📄 tailwind.config.js           # Configuração Tailwind
├── 📄 postcss.config.js            # PostCSS
├── 📄 package.json                 # Dependências
├── 📄 vite.config.js               # Config Vite
│
├── api/                            # Vercel Functions
│   ├── search-companies.ts         # Buscar empresas
│   ├── generate-prompt.ts          # Gerar prompts com IA
│   ├── create-checkout.ts          # Checkout Stripe
│   ├── webhook-stripe.ts           # Webhooks Stripe
│   └── get-emails.ts               # Email finder (Hunter.io)
│
├── 📋 DEPLOYMENT.md                # Guia deployment Vercel
├── 📋 MONETIZATION-STRATEGY.md     # Estratégia de negócio
├── 📋 USER-GUIDE.md                # Manual do usuário
├── 📋 database-setup.sql           # SQL Supabase
├── 📋 api-routes-guide.md          # Documentação APIs
│
└── .env.example                    # Variáveis de ambiente
```

---

## 🚀 Quick Start

### 1. Clonar Repositório
```bash
git clone https://github.com/seu-usuario/websales-ai.git
cd websales-ai
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas chaves
```

### 4. Executar Localmente
```bash
npm run dev
# Acesse http://localhost:5173
```

### 5. Build para Produção
```bash
npm run build
npm run preview
```

---

## 🔧 Configuração de Variáveis de Ambiente

### Claude API
```
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
```
Obtenha em: https://console.anthropic.com

### Stripe
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```
Obtenha em: https://dashboard.stripe.com

### Supabase
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxx
```
Crie em: https://app.supabase.com

### Hunter.io
```
VITE_HUNTER_API_KEY=xxxxxxxxxxxxx
```
Obtenha em: https://hunter.io/api

---

## 📦 Dependências Principais

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "zustand": "^4.3.7",
  "react-hook-form": "^7.42.0",
  "zod": "^3.21.4",
  "axios": "^1.4.0",
  "framer-motion": "^10.12.4",
  "lucide-react": "^0.263.1",
  "@anthropic-ai/sdk": "^0.9.1",
  "stripe": "^12.1.1",
  "tailwindcss": "^3.3.0"
}
```

---

## 📚 Documentação

### Guias Disponíveis
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Como fazer deploy no Vercel
- **[MONETIZATION-STRATEGY.md](./MONETIZATION-STRATEGY.md)** - Plano de negócio
- **[USER-GUIDE.md](./USER-GUIDE.md)** - Manual do usuário
- **[api-routes-guide.md](./api-routes-guide.md)** - Documentação das APIs
- **[database-setup.sql](./database-setup.sql)** - Setup do Supabase

---

## 🔐 Segurança

### Implementações
- ✅ **RLS (Row Level Security)** - Dados isolados por usuário
- ✅ **JWT Authentication** - Tokens seguros
- ✅ **CORS** - Proteção contra requisições maliciosas
- ✅ **Rate Limiting** - Proteção contra abuse
- ✅ **Validação de Input** - Zod schemas
- ✅ **HTTPS** - SSL/TLS automático no Vercel

### Best Practices
```typescript
// ✅ Sempre validar input
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ✅ Usar env vars para secrets
const apiKey = process.env.CLAUDE_API_KEY;

// ✅ Implementar rate limiting
const rateLimit = 100; // requisições/hora

// ✅ Verificar autenticação
const user = await auth.currentUser();
if (!user) throw new Error('Unauthorized');
```

---

## 📊 Banco de Dados - Supabase

### Tabelas Principais
- `users` - Contas de usuários
- `leads` - Leads rastreados
- `generated_prompts` - Prompts gerados com IA
- `communications` - Histórico de contatos
- `success_cases` - Vendas convertidas
- `subscriptions` - Planos pagos
- `credit_usage` - Uso de créditos

### Executar SQL
```bash
# 1. Ir para Supabase SQL Editor
# 2. Colar conteúdo de database-setup.sql
# 3. Executar
```

---

## 🎨 Design System

### Cores
```
Primary: #6366F1 (Indigo)
Secondary: #10B981 (Emerald)
Danger: #EF4444 (Red)
Dark: #0F172A (Slate-950)
Light: #F8FAFC (Slate-50)
```

### Componentes Reutilizáveis
- `<Button>` - Botões com variantes
- `<Card>` - Cartões com sombra
- `<Badge>` - Labels coloridas
- `<Input>` - Campos de entrada
- `<Modal>` - Diálogos

---

## 🧪 Testando Localmente

### Login de Teste
```
Email: demo@websales.ai
Senha: Qualquer uma (demo)
```

### Testar Stripe
Use números de teste:
```
Cartão: 4242 4242 4242 4242
Expira: 12/25
CVC: 123
```

### Testar Claude API
A IA funciona localmente com sua chave. Teste gerando prompts.

---

## 📈 Métricas & Monitoramento

### KPIs a Acompanhar
- **DAU** (Daily Active Users)
- **MRR** (Monthly Recurring Revenue)
- **Churn Rate** (Taxa de cancelamento)
- **CAC** (Customer Acquisition Cost)
- **LTV** (Lifetime Value)
- **Conversion Rate** (Free → Pro)

### Ferramentas
- **Vercel Analytics** - Performance
- **Supabase Logs** - Database
- **Stripe Dashboard** - Pagamentos

---

## 🤝 Contribuindo

Quer contribuir? Ótimo!

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
```typescript
// Use TypeScript strict
// Componentes em PascalCase
// Variáveis em camelCase
// Sempre adicione tipos

const MyComponent: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};
```

---

## 📝 Roadmap

### V1.0 (Lançamento)
- ✅ Buscar empresas
- ✅ Gerador de prompts com IA
- ✅ Rastreador de leads
- ✅ Dashboard básico
- ✅ Autenticação JWT
- ✅ Pagamentos com Stripe

### V1.5 (Melhorias)
- 📅 Email finder (Hunter.io)
- 📅 API access
- 📅 Integração Zapier
- 📅 Templates de prompts
- 📅 Analytics avançado

### V2.0 (Premium)
- 📅 White-label option
- 📅 Marketplace de templates
- 📅 Integrações personalizadas
- 📅 Certificação WebSales

---

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma issue!

```
Título: [BUG] Descrição breve
Descrição:
- Passos para reproduzir
- Comportamento esperado
- Comportamento atual
- Screenshots se aplicável
```

---

## 📞 Suporte & Contato

- 📧 Email: support@websales.ai
- 💬 Discord: https://discord.gg/websales
- 🐦 Twitter: @WebSalesAI
- 🌐 Website: https://websales.ai

---

## 📄 Licença

Este projeto é propriedade intelectual.
Uso: Comercial com restrições.

---

## 🙏 Agradecimentos

- Claude/Anthropic - IA
- Vercel - Hosting
- Supabase - Database
- Stripe - Pagamentos
- Tailwind Labs - CSS Framework

---

## 🎯 Status do Projeto

| Feature | Status | % |
|---------|--------|---|
| Frontend | ✅ Completo | 100% |
| Backend (APIs) | ✅ Completo | 100% |
| Database | ✅ Completo | 100% |
| Autenticação | ✅ Completo | 100% |
| Stripe Integration | ✅ Completo | 100% |
| Claude Integration | ✅ Completo | 100% |
| Deployment | 📅 Guia | - |
| Documentação | ✅ Completo | 100% |

---

## 📊 Estatísticas

- **Arquivos:** 8+ arquivos principais
- **Linhas de código:** 2.000+ linhas React
- **API Endpoints:** 5 endpoints
- **Tabelas DB:** 8 tabelas
- **Componentes:** 15+ componentes reutilizáveis

---

**Desenvolvido com ❤️ para ajudar profissionais a vender sites melhor**

*Last updated: Janeiro 2024*
*Status: Production Ready ✅*
