-- ═══════════════════════════════════════════════════════════════
-- WEBSALES AI - DATABASE SETUP (SUPABASE PostgreSQL)
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ CREATE TABLES

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  credits INT DEFAULT 10,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  website_exists BOOLEAN DEFAULT false,
  potential_value DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'contato_inicial',
  source VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de prompts gerados
CREATE TABLE IF NOT EXISTS generated_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  prompt_text TEXT NOT NULL,
  tone VARCHAR(50),
  industry VARCHAR(100),
  sent BOOLEAN DEFAULT false,
  response_received BOOLEAN DEFAULT false,
  response_text TEXT,
  ai_model VARCHAR(50) DEFAULT 'claude-3-5-sonnet',
  tokens_used INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de comunicações/contatos
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  channel VARCHAR(50), -- 'email', 'whatsapp', 'phone'
  sent_at TIMESTAMP,
  response_at TIMESTAMP,
  response_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de sucesso (casos de conversão)
CREATE TABLE IF NOT EXISTS success_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  project_value DECIMAL(10, 2),
  commission_value DECIMAL(10, 2),
  completion_date DATE,
  client_feedback TEXT,
  roi_percentage DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de planos e assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, canceled, past_due
  current_period_start DATE,
  current_period_end DATE,
  cancel_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de uso/limite de créditos
CREATE TABLE IF NOT EXISTS credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation VARCHAR(100), -- 'search', 'prompt_generation', 'email_lookup'
  credits_spent INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de templates de prompts
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry VARCHAR(100),
  template_text TEXT,
  tone VARCHAR(50),
  conversion_rate DECIMAL(5, 2),
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 2️⃣ CREATE INDEXES

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_prompts_user_id ON generated_prompts(user_id);
CREATE INDEX idx_prompts_lead_id ON generated_prompts(lead_id);
CREATE INDEX idx_communications_user_id ON communications(user_id);
CREATE INDEX idx_success_cases_user_id ON success_cases(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_credit_usage_user_id ON credit_usage(user_id);

-- ═══════════════════════════════════════════════════════════════
-- 3️⃣ ROW LEVEL SECURITY (RLS)

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Policies para tabela USERS
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policies para tabela LEADS
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para tabela GENERATED_PROMPTS
CREATE POLICY "Users can view their own prompts" ON generated_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create prompts" ON generated_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts" ON generated_prompts
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies para tabela COMMUNICATIONS
CREATE POLICY "Users can view their communications" ON communications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create communications" ON communications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para tabela SUCCESS_CASES
CREATE POLICY "Users can view their success cases" ON success_cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create success cases" ON success_cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para tabela SUBSCRIPTIONS
CREATE POLICY "Users can view their subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 4️⃣ VIEWS ÚTEIS

-- View para dashboard stats
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.email,
  u.plan,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT CASE WHEN l.status = 'contrato_assinado' THEN l.id END) as converted_leads,
  COALESCE(SUM(sc.commission_value), 0) as total_revenue,
  AVG(sc.roi_percentage) as avg_roi
FROM users u
LEFT JOIN leads l ON u.id = l.user_id
LEFT JOIN success_cases sc ON u.id = sc.user_id
GROUP BY u.id, u.email, u.plan;

-- View para funil de leads
CREATE OR REPLACE VIEW leads_funnel AS
SELECT
  user_id,
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY user_id), 2) as percentage
FROM leads
GROUP BY user_id, status
ORDER BY user_id, 
  CASE status
    WHEN 'contato_inicial' THEN 1
    WHEN 'contato_enviado' THEN 2
    WHEN 'resposta_positiva' THEN 3
    WHEN 'negociacao' THEN 4
    WHEN 'proposta_enviada' THEN 5
    WHEN 'contrato_assinado' THEN 6
    WHEN 'recusado' THEN 7
  END;

-- ═══════════════════════════════════════════════════════════════
-- 5️⃣ SAMPLE DATA (Dados de exemplo)

-- Inserir usuário de teste
INSERT INTO users (email, password_hash, full_name, company_name, plan, credits)
VALUES ('demo@websales.ai', '$2b$10$...', 'Demo User', 'Demo Company', 'free', 10);

-- Inserir leads de exemplo
INSERT INTO leads (user_id, company_name, industry, location, email, phone, potential_value, status)
VALUES (
  (SELECT id FROM users WHERE email = 'demo@websales.ai'),
  'Pizzaria Do Centro',
  'Alimentação',
  'São Paulo, SP',
  'contato@pizzaria.com',
  '11987654321',
  5000,
  'contato_enviado'
);

-- ═══════════════════════════════════════════════════════════════
-- 6️⃣ FUNÇÕES ÚTEIS

-- Função para incrementar uso de créditos
CREATE OR REPLACE FUNCTION use_credits(p_user_id UUID, p_credits INT, p_operation VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE users SET credits = credits - p_credits WHERE id = p_user_id;
  
  INSERT INTO credit_usage (user_id, operation, credits_spent, description)
  VALUES (p_user_id, p_operation, p_credits, p_operation || ' used');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar status de lead
CREATE OR REPLACE FUNCTION update_lead_status(p_lead_id UUID, p_new_status VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE leads
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_lead_id;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular ROI
CREATE OR REPLACE FUNCTION calculate_roi(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total_investment DECIMAL;
  v_total_revenue DECIMAL;
BEGIN
  SELECT COALESCE(SUM(credits_spent * 0.01), 0) INTO v_total_investment
  FROM credit_usage WHERE user_id = p_user_id;
  
  SELECT COALESCE(SUM(commission_value), 0) INTO v_total_revenue
  FROM success_cases WHERE user_id = p_user_id;
  
  IF v_total_investment = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ((v_total_revenue - v_total_investment) / v_total_investment) * 100;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- 7️⃣ TRIGGERS

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
