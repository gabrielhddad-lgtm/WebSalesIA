import { useState, useCallback } from 'react';
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════
// HOOK: useClaudePrompt
// Gera prompts personalizados usando Claude IA
// ═══════════════════════════════════════════════════════════════

export const useClaudePrompt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');

  const generatePrompt = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/generate-prompt', {
        company: data.company,
        industry: data.industry,
        city: data.city,
        tone: data.tone || 'profissional',
      });

      setPrompt(response.data.prompt);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao gerar prompt';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generatePrompt, prompt, loading, error };
};

// ═══════════════════════════════════════════════════════════════
// HOOK: useCompanyFinder
// Busca empresas sem site em uma determinada região/nicho
// ═══════════════════════════════════════════════════════════════

export const useCompanyFinder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);

  const searchCompanies = useCallback(async (niche, location) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/search-companies', {
        niche,
        location,
      });

      setCompanies(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar empresas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchCompanies, companies, loading, error };
};

// ═══════════════════════════════════════════════════════════════
// HOOK: useStripeCheckout
// Integração com Stripe para checkout
// ═══════════════════════════════════════════════════════════════

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCheckout = useCallback(async (email, plan = 'pro') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/create-checkout', {
        email,
        plan,
      });

      // Redirecionar para Stripe Checkout
      if (response.data.sessionId) {
        const stripe = await window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (stripeError) {
          setError(stripeError.message);
          throw stripeError;
        }
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar checkout';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCheckout, loading, error };
};

// ═══════════════════════════════════════════════════════════════
// HOOK: useEmailFinder
// Busca emails de contato usando Hunter.io API
// ═══════════════════════════════════════════════════════════════

export const useEmailFinder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState([]);

  const findEmails = useCallback(async (domain) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/get-emails', {
        domain,
      });

      setEmails(response.data.emails);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao buscar emails';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { findEmails, emails, loading, error };
};

// ═══════════════════════════════════════════════════════════════
// HOOK: useLeadManagement
// Gerenciar status e dados de leads
// ═══════════════════════════════════════════════════════════════

export const useLeadManagement = (initialLeads = []) => {
  const [leads, setLeads] = useState(initialLeads);

  const addLead = useCallback((lead) => {
    const newLead = {
      id: Date.now(),
      ...lead,
      createdAt: new Date(),
    };
    setLeads([...leads, newLead]);
    return newLead;
  }, [leads]);

  const updateLeadStatus = useCallback((leadId, newStatus) => {
    setLeads(leads.map(lead =>
      lead.id === leadId
        ? { ...lead, status: newStatus, updatedAt: new Date() }
        : lead
    ));
  }, [leads]);

  const deleteLead = useCallback((leadId) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  }, [leads]);

  const addNote = useCallback((leadId, note) => {
    setLeads(leads.map(lead =>
      lead.id === leadId
        ? {
          ...lead,
          notes: [...(lead.notes || []), { text: note, date: new Date() }],
        }
        : lead
    ));
  }, [leads]);

  return { leads, addLead, updateLeadStatus, deleteLead, addNote };
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════════

// Calcular ROI
export const calculateROI = (revenue, investment) => {
  if (investment === 0) return 0;
  return ((revenue - investment) / investment) * 100;
};

// Formatar moeda brasileira
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatar data
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

// Validar email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar telefone brasileiro
export const validatePhone = (phone) => {
  const regex = /^(\+55\s?)?(\(?[0-9]{2}\)?)\s?9?[0-9]{4}-?[0-9]{4}$/;
  return regex.test(phone);
};

// Gerar slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

// Copiar para clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar:', err);
    return false;
  }
};

// Calcular tempo decorrido (ex: "2 horas atrás")
export const timeAgo = (date) => {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
  if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
  if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  return formatDate(date);
};

// Validar força de senha
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const strengths = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
  return {
    score: strength,
    label: strengths[strength],
    color: ['red', 'orange', 'yellow', 'green', 'emerald'][strength],
  };
};

// Gerar ID único
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce para otimizar requisições
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle para limitar chamadas de função
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// API Wrapper com retry
export const apiCall = async (url, options = {}, retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios({
        url,
        ...options,
      });
      return response.data;
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// Export all utilities
export const utilities = {
  calculateROI,
  formatCurrency,
  formatDate,
  validateEmail,
  validatePhone,
  generateSlug,
  copyToClipboard,
  timeAgo,
  getPasswordStrength,
  generateId,
  debounce,
  throttle,
  apiCall,
};
