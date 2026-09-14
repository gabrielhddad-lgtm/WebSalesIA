import React, { useState } from 'react';
import { CreditCard, Check, Loader, X } from 'lucide-react';
import { useStripeCheckout } from './hooks';
import { Button, Card, Badge } from './websales-ai-app';

// ═══════════════════════════════════════════════════════════════
// PRICING PAGE - Planos e Preços
// ═══════════════════════════════════════════════════════════════

export const PricingPage = ({ userEmail, currentPlan, onPlanChange }) => {
  const { createCheckout, loading, error } = useStripeCheckout();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'para sempre',
      description: 'Perfeito para começar',
      features: [
        'Até 10 buscas por mês',
        'Gerador de prompts básico',
        'Rastreador de leads',
        'Suporte por email',
        'Reports mensais',
      ],
      excluded: [
        'Buscas ilimitadas',
        'Integração com Hunter.io',
        'Email finder avançado',
        'Prioridade de suporte',
        'API access',
      ],
      color: 'primary',
      popular: false,
    },
    {
      id: 'pro',
      name: 'PRO',
      price: 90,
      period: '/mês (pago anualmente R$ 900)',
      description: 'Para profissionais sérios',
      features: [
        'Buscas ilimitadas',
        'Gerador de prompts avançado (IA)',
        'Email finder com Hunter.io',
        'Rastreador de leads avançado',
        'Reports customizados',
        'Suporte prioritário 24/7',
        'Integração com Zapier',
        'API access',
        'Analytics avançado',
        'Templates de prompts customizados',
      ],
      excluded: [],
      color: 'secondary',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'confira com nosso time',
      description: 'Solução personalizada',
      features: [
        'Tudo do plano PRO',
        'SLA garantido',
        'Account manager dedicado',
        'Integração customizada',
        'Treinamento incluído',
        'White-label option',
      ],
      excluded: [],
      color: 'primary',
      popular: false,
    },
  ];

  const handleUpgrade = async (planId) => {
    if (planId === 'free') {
      // Já está no free ou downgrade
      alert('Você está no plano Free');
      return;
    }

    if (planId === 'enterprise') {
      // Redirect to contact form
      window.location.href = 'mailto:enterprise@websales.ai?subject=Solicitar Plano Enterprise';
      return;
    }

    setSelectedPlan(planId);
    try {
      await createCheckout(userEmail, planId);
    } catch (err) {
      console.error('Erro no checkout:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Preços Transparentes
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Comece grátis. Upgrade quando precisar.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${plan.popular ? 'md:scale-105 md:z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge variant="success">🌟 Mais Popular</Badge>
                </div>
              )}

              <Card
                className={`flex flex-col h-full ${
                  plan.popular
                    ? 'ring-2 ring-emerald-500 dark:ring-emerald-400'
                    : ''
                }`}
              >
                {/* Plan Name */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  {typeof plan.price === 'number' ? (
                    <>
                      <div className="text-5xl font-bold text-slate-900 dark:text-white">
                        R$ {plan.price}
                        <span className="text-xl text-slate-600 dark:text-slate-400">
                          {plan.price > 0 && '/mês'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {plan.period}
                      </p>
                    </>
                  ) : (
                    <div>
                      <div className="text-5xl font-bold text-slate-900 dark:text-white">
                        {plan.price}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {plan.period}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  variant={plan.popular ? 'secondary' : 'outline'}
                  size="lg"
                  className="w-full mb-6"
                  disabled={loading && selectedPlan === plan.id}
                >
                  {loading && selectedPlan === plan.id ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processando...
                    </>
                  ) : currentPlan === plan.id ? (
                    `✓ Seu Plano Atual`
                  ) : plan.id === 'enterprise' ? (
                    `Entre em Contato`
                  ) : (
                    `Começar com ${plan.name}`
                  )}
                </Button>

                {/* Features List */}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Incluso neste plano:
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <Check className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.excluded.length > 0 && (
                    <>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                        Não incluso:
                      </h3>
                      <ul className="space-y-3">
                        {plan.excluded.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-400 dark:text-slate-500"
                          >
                            <X size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Perguntas Frequentes
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Posso trocar de plano a qualquer momento?',
                a: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.',
              },
              {
                q: 'Há contrato de longo prazo?',
                a: 'Não. Todos os planos funcionam com ciclos mensais. Você pode cancelar a qualquer momento sem penalidades.',
              },
              {
                q: 'Qual é a política de reembolso?',
                a: 'Oferecemos reembolso de 30 dias se não estiver satisfeito. Sem perguntas feitas.',
              },
              {
                q: 'Posso conseguir uma demonstração para o plano Enterprise?',
                a: 'Absolutamente! Entre em contato conosco e agende uma chamada com nosso time de vendas.',
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FAQ ITEM
// ═══════════════════════════════════════════════════════════════

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Card className="cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">{question}</h3>
        <span className={`text-indigo-600 transform transition-transform ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      {open && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {answer}
        </p>
      )}
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// STRIPE CHECKOUT COMPONENT
// ═══════════════════════════════════════════════════════════════

export const StripeCheckout = ({ email, plan, onSuccess, onCancel }) => {
  const { createCheckout, loading, error } = useStripeCheckout();

  const handleCheckout = async () => {
    try {
      await createCheckout(email, plan);
      onSuccess?.();
    } catch (err) {
      console.error('Erro no checkout:', err);
    }
  };

  return (
    <Card>
      <div className="text-center">
        <CreditCard size={48} className="mx-auto text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Upgrade para PRO
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Acesso ilimitado a todas as funcionalidades por R$ 90/mês
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleCheckout}
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Ir para Pagamento
              </>
            )}
          </Button>

          <Button
            onClick={onCancel}
            variant="ghost"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAYMENT SUCCESS COMPONENT
// ═══════════════════════════════════════════════════════════════

export const PaymentSuccess = ({ sessionId }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 flex items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full mb-4">
          <Check className="text-emerald-600" size={32} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Pagamento Confirmado! 🎉
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Seu upgrade para o plano PRO foi concluído com sucesso. Aproveite todas as funcionalidades ilimitadas!
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/dashboard'}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Voltar ao Dashboard
          </Button>

          <Button
            onClick={() => window.location.href = '/finder'}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Começar a Buscar Empresas
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          ID da Sessão: {sessionId}
        </p>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAYMENT CANCELED COMPONENT
// ═══════════════════════════════════════════════════════════════

export const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 flex items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
          <X className="text-amber-600" size={32} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Pagamento Cancelado
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Você cancelou o processo de pagamento. Se tiver dúvidas, entre em contato com nosso suporte.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/pricing'}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Voltar aos Planos
          </Button>

          <Button
            onClick={() => window.location.href = 'mailto:support@websales.ai'}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Contatar Suporte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PricingPage;
