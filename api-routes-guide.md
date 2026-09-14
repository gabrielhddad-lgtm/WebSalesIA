# 📡 API ROUTES PARA VERCEL FUNCTIONS

Coloque todos os arquivos em `/api` na raiz do projeto.

## Estrutura de Pastas

```
projeto/
├── api/
│   ├── search-companies.ts
│   ├── generate-prompt.ts
│   ├── create-checkout.ts
│   ├── webhook-stripe.ts
│   └── get-emails.ts
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── App.tsx
└── package.json
```

## 1️⃣ API: `/api/search-companies.ts`

Busca empresas SEM site usando Cheerio (web scraping)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { niche, location } = await req.json();

  try {
    // Aqui você faria a busca em diretórios de negócios
    // Exemplo com Google Business (scraped data)
    // Ou integração com APIs como:
    // - Apollo.io
    // - RocketReach
    // - Clearbit
    // - Hunter.io

    const companies = [
      {
        id: 1,
        name: 'Empresa Local',
        industry: niche,
        website: null,
        email: 'contato@empresa.com',
        phone: '11987654321',
        city: location,
        potential: 'R$ 5.000',
      },
    ];

    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar empresas' },
      { status: 500 }
    );
  }
}
```

## 2️⃣ API: `/api/generate-prompt.ts`

Gera prompts personalizados usando Claude API

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { company, industry, city, tone } = await req.json();

  try {
    const systemPrompt = `Você é um especialista em vendas de sites para pequenas empresas.
Sua tarefa é gerar uma mensagem de abordagem personalizada e persuasiva.
A mensagem deve ser curta (máximo 150 palavras), incluir dados sobre ROI e ser em tom ${tone}.
Inclua um CTA claro no final.`;

    const userMessage = `Gere uma mensagem de vendas para:
- Empresa: ${company}
- Ramo: ${industry}
- Cidade: ${city}
- Tom: ${tone}

A mensagem deve persuadir o proprietário sobre os benefícios de ter um site moderno.`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const generatedText = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({
      prompt: generatedText,
      tokens_used: response.usage.input_tokens + response.usage.output_tokens,
    });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar prompt' },
      { status: 500 }
    );
  }
}
```

## 3️⃣ API: `/api/create-checkout.ts`

Cria sessão de checkout Stripe

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { email, plan } = await req.json();

  try {
    // IDs dos produtos no Stripe (substitua pelos seus)
    const priceIds = {
      pro_monthly: 'price_1Nxxxxxx',
      pro_annual: 'price_2Nxxxxxx',
    };

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds.pro_monthly,
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing`,
      metadata: {
        userId: email,
        plan: 'pro',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar checkout' },
      { status: 500 }
    );
  }
}
```

## 4️⃣ API: `/api/webhook-stripe.ts`

Webhook para atualizar plano do usuário após pagamento

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Atualizar usuário para PRO no banco de dados
        console.log('Usuário atualizado para PRO:', session.customer_email);
        break;

      case 'customer.subscription.deleted':
        // Downgrade para Free
        console.log('Assinatura cancelada');
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    );
  }
}
```

## 5️⃣ API: `/api/get-emails.ts`

Busca emails com Hunter.io

```typescript
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { domain } = await req.json();

  try {
    const response = await axios.get(`https://api.hunter.io/v2/domain-search`, {
      params: {
        domain,
        api_key: process.env.HUNTER_API_KEY,
      },
    });

    const emails = response.data.data.emails.map((email: any) => ({
      email: email.value,
      name: email.first_name + ' ' + email.last_name,
      position: email.position,
      confidence: email.confidence,
    }));

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Hunter.io error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar emails' },
      { status: 500 }
    );
  }
}
```

## 📊 Endpoints Resumo

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/search-companies` | Busca empresas sem site |
| POST | `/api/generate-prompt` | Gera prompt com Claude |
| POST | `/api/create-checkout` | Cria sessão Stripe |
| POST | `/api/webhook-stripe` | Processa webhooks Stripe |
| POST | `/api/get-emails` | Busca emails com Hunter.io |

## 🔐 Segurança

1. **Verificar JWT** nas requisições autenticadas
2. **Rate limiting** para evitar abuso
3. **CORS configurado** apenas para seu domínio
4. **Variáveis de ambiente** nunca expostas
5. **Validação de input** em todas as requisições
