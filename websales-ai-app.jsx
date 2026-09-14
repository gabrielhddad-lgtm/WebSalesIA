import React, { useState, useContext, createContext, useEffect } from 'react';
import { AlertCircle, BarChart3, Zap, Users, ArrowRight, LogOut, Settings, Menu, X, Send, TrendingUp, Check, Lock, Eye, EyeOff } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM & THEME CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const colors = {
  primary: '#6366F1',
  secondary: '#10B981',
  danger: '#EF4444',
  dark: '#0F172A',
  light: '#F8FAFC',
  neutral: '#64748B',
  slate950: '#0F172A',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate500: '#64748B',
  slate700: '#334155',
};

// ═══════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('free');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de autenticação
    const storedUser = localStorage.getItem('websales_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setPlan(JSON.parse(storedUser).plan || 'free');
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const userData = { email, plan: 'free', credits: 10 };
    localStorage.setItem('websales_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setPlan('free');
  };

  const logout = () => {
    localStorage.removeItem('websales_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePlan = (newPlan) => {
    const updatedUser = { ...user, plan: newPlan };
    localStorage.setItem('websales_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setPlan(newPlan);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, updatePlan, plan }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ═══════════════════════════════════════════════════════════════
// COMPONENTES REUTILIZÁVEIS
// ═══════════════════════════════════════════════════════════════

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 justify-center';
  
  const variants = {
    primary: `bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-400`,
    secondary: `bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-400`,
    outline: `border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800`,
    ghost: `text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`,
    danger: `bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-400`,
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${hover ? 'hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600' : 'shadow-md'} transition-all ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ label, error, type = 'text', className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
    <input
      type={type}
      className={`w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
      {...props}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (email && password) {
        login(email, password);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4">
            <Zap className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">WebSales AI</h1>
          <p className="text-slate-600 dark:text-slate-400">Venda sites com inteligência artificial</p>
        </div>

        {/* Login Card */}
        <Card className="mb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Conta de demonstração:<br/>
              <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mt-2 inline-block">demo@websales.ai</code>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="space-y-3">
          {[
            { icon: Zap, text: 'IA integrada com Claude' },
            { icon: Users, text: 'Busca automática de leads' },
            { icon: TrendingUp, text: 'Análise de ROI em tempo real' },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <feature.icon size={18} className="text-indigo-600" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HEADER/NAVBAR
// ═══════════════════════════════════════════════════════════════

const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout, plan } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'finder', label: 'Buscar Empresas', icon: Users },
    { id: 'generator', label: 'Gerador IA', icon: Zap },
    { id: 'leads', label: 'Leads', icon: TrendingUp },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">WebSales AI</h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentPage === page.id
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <page.icon size={16} />
                {page.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Badge variant={plan === 'pro' ? 'success' : 'primary'}>
              {plan === 'pro' ? '🚀 PRO' : '📦 Free'}
            </Badge>

            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm">Sair</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-600 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setCurrentPage(page.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <page.icon size={16} />
                {page.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 mt-2 pt-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════

const DashboardPage = ({ setCurrentPage }) => {
  const { user, plan } = useAuth();
  const [stats] = useState({
    totalLeads: 24,
    conversions: 6,
    revenue: 18000,
    roi: 380,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Bem-vindo, {user?.email.split('@')[0]}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Aqui está seu resumo de vendas de sites</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Leads Gerados', value: stats.totalLeads, icon: Users, color: 'indigo' },
          { label: 'Conversões', value: stats.conversions, icon: Check, color: 'emerald' },
          { label: 'Receita', value: `R$ ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
          { label: 'ROI', value: `${stats.roi}%`, icon: BarChart3, color: 'indigo' },
        ].map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-emerald-100 dark:bg-emerald-900'}`}>
                <stat.icon className={stat.color === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Leads Recentes</h2>
            <div className="space-y-4">
              {[
                { company: 'Tech Solutions', status: 'em_progresso', value: 'R$ 5.000' },
                { company: 'Comércio Local', status: 'contato', value: 'R$ 3.000' },
                { company: 'Restaurante XYZ', status: 'em_progresso', value: 'R$ 4.500' },
              ].map((lead, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{lead.company}</p>
                    <Badge variant={lead.status === 'em_progresso' ? 'success' : 'warning'} className="mt-2">
                      {lead.status === 'em_progresso' ? '🔄 Em Progresso' : '📞 Contato'}
                    </Badge>
                  </div>
                  <p className="font-bold text-indigo-600">{lead.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setCurrentPage('finder')}
              >
                <Users size={18} />
                Buscar Empresas
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => setCurrentPage('generator')}
              >
                <Zap size={18} />
                Gerar Prompt IA
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
              >
                <BarChart3 size={18} />
                Ver Relatórios
              </Button>
            </div>

            {plan === 'free' && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 p-4 rounded-lg">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">🚀 Desbloqueie WebSales PRO</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Acesso ilimitado a buscas, prompts IA e análise avançada</p>
                <Button variant="primary" size="sm" className="w-full">
                  Começar Teste Grátis
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FINDER PAGE (Buscar Empresas)
// ═══════════════════════════════════════════════════════════════

const FinderPage = ({ setCurrentPage }) => {
  const { plan } = useAuth();
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (plan === 'free') {
      alert('Você atingiu o limite de buscas. Upgrade para PRO!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setResults([
        {
          id: 1,
          company: 'Pizzaria Do Centro',
          industry: 'Alimentação',
          website: false,
          city: location || 'São Paulo',
          email: 'contato@pizzariadocentro.com',
          phone: '(11) 98765-4321',
          potential: 'R$ 4.500',
        },
        {
          id: 2,
          company: 'Clínica Odontológica Smile',
          industry: 'Saúde',
          website: false,
          city: location || 'São Paulo',
          email: 'admin@smiledental.com',
          phone: '(11) 97654-3210',
          potential: 'R$ 5.000',
        },
        {
          id: 3,
          company: 'Salão de Beleza Glamour',
          industry: 'Beleza',
          website: false,
          city: location || 'São Paulo',
          email: 'glamour@salao.com',
          phone: '(11) 96543-2109',
          potential: 'R$ 3.500',
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Buscar Empresas SEM SITE</h1>
        <p className="text-slate-600 dark:text-slate-400">Use IA para encontrar potenciais clientes no seu nicho</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nicho/Ramo de negócio"
              placeholder="Ex: Restaurante, Clínica, Salão..."
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            />
            <Input
              label="Cidade/Estado"
              placeholder="Ex: São Paulo, Rio de Janeiro"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !niche || !location}
            className="w-full"
          >
            {loading ? 'Buscando...' : 'Buscar Empresas'}
            <Zap size={18} />
          </Button>
        </form>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {results.length} empresas encontradas
            </h2>
            <Badge variant="success">{results.length * 4.2}k potencial</Badge>
          </div>

          {results.map((company) => (
            <Card key={company.id} hover>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{company.company}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="primary">{company.industry}</Badge>
                    <Badge variant="warning">📍 {company.city}</Badge>
                    <Badge variant="danger">❌ Sem site</Badge>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p><strong>Email:</strong> {company.email}</p>
                    <p><strong>Telefone:</strong> {company.phone}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-right">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Potencial:</p>
                    <p className="text-xl font-bold text-emerald-600">{company.potential}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setCurrentPage('generator')}
                  >
                    Gerar Prompt
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!results && (
        <Card className="text-center py-12">
          <Users size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Preencha os filtros acima para começar a busca</p>
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// AI PROMPT GENERATOR
// ═══════════════════════════════════════════════════════════════

const GeneratorPage = () => {
  const [selectedCompany, setSelectedCompany] = useState('Pizzaria Do Centro');
  const [tone, setTone] = useState('profissional');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGeneratePrompt = () => {
    setLoading(true);
    
    setTimeout(() => {
      const prompts = {
        pizzaria: `Olá! 👋 Vi que a ${selectedCompany} tem uma presença física excelente em São Paulo, mas não encontrei um site. 

Sabia que 78% dos clientes pesquisam online ANTES de ligar? 

Temos um pacote especial para restaurantes: Um site moderno + cardápio digital + integração com aplicativos de delivery = Até 40% de aumento em pedidos.

A maioria dos restaurantes em SP que modernizou sua presença online nos últimos 6 meses viu crescimento médio de R$ 8.000+ por mês.

Quer conversar sobre como isso pode funcionar para você? 📞`,

        clinica: `Olá! 👋 Sua clínica oferece um serviço excelente, mas achei que seria ótimo explorar como um site profissional pode atrair mais pacientes.

Números que você deve conhecer:
- 89% dos pacientes pesquisam online antes de agendar
- Um site com agendamento online aumenta conversão em 65%
- Pacientes que encontram você no Google têm 3x maior valor

Temos um solution específica para clínicas: Site responsivo + sistema de agendamento + SEO local.

Vamos tomar um café de 15min para discutir? ☕`,
      };

      const niche = selectedCompany.toLowerCase().includes('pizzaria') ? 'pizzaria' : 'clinica';
      setGeneratedPrompt(prompts[niche] || prompts.pizzaria);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Gerador de Prompts IA</h1>
        <p className="text-slate-600 dark:text-slate-400">Crie mensagens personalizadas baseadas em dados reais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Configuração</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Empresa</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Pizzaria Do Centro</option>
                <option>Clínica Odontológica Smile</option>
                <option>Salão de Beleza Glamour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tom de Voz</label>
              <div className="space-y-2">
                {['profissional', 'casual', 'urgente', 'consultivo'].map((t) => (
                  <label key={t} className="flex items-center">
                    <input
                      type="radio"
                      name="tone"
                      value={t}
                      checked={tone === t}
                      onChange={(e) => setTone(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleGeneratePrompt}
              disabled={loading}
            >
              {loading ? 'Gerando...' : 'Gerar Prompt'}
              <Zap size={18} />
            </Button>
          </div>
        </Card>

        {/* Generated Prompt */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sua Mensagem</h2>
              {generatedPrompt && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  {copied ? '✅ Copiado!' : 'Copiar'}
                </Button>
              )}
            </div>

            {generatedPrompt ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border-l-4 border-indigo-600">
                <p className="text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                  {generatedPrompt}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Send size={32} className="mx-auto mb-4 opacity-50" />
                <p>Clique em "Gerar Prompt" para criar sua mensagem personalizada</p>
              </div>
            )}

            {generatedPrompt && (
              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  <strong>💡 Dica:</strong> Customize este prompt conforme necessário antes de enviar. Sua personalização aumenta em até 3x a taxa de resposta!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// LEADS TRACKER
// ═══════════════════════════════════════════════════════════════

const LeadsPage = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      company: 'Pizzaria Do Centro',
      status: 'contato_enviado',
      date: '2024-01-15',
      value: 'R$ 4.500',
      notes: 'Resposta positiva ao primeiro contato',
    },
    {
      id: 2,
      company: 'Clínica Odontológica Smile',
      status: 'negociacao',
      date: '2024-01-10',
      value: 'R$ 5.000',
      notes: 'Agendou reunião para semana que vem',
    },
    {
      id: 3,
      company: 'Salão de Beleza Glamour',
      status: 'proposta_enviada',
      date: '2024-01-08',
      value: 'R$ 3.500',
      notes: 'Aguardando feedback da proposta',
    },
  ]);

  const statusOptions = {
    contato_inicial: { label: '📧 Contato Inicial', color: 'warning' },
    contato_enviado: { label: '✉️ Contato Enviado', color: 'warning' },
    resposta_positiva: { label: '👍 Resposta Positiva', color: 'primary' },
    negociacao: { label: '🤝 Negociação', color: 'primary' },
    proposta_enviada: { label: '📄 Proposta Enviada', color: 'primary' },
    contrato_assinado: { label: '✅ Contrato Assinado', color: 'success' },
    recusado: { label: '❌ Recusado', color: 'danger' },
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(leads.map(lead =>
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Rastreador de Leads</h1>
        <p className="text-slate-600 dark:text-slate-400">Acompanhe o funil de vendas em tempo real</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: leads.length },
          { label: 'Em Progresso', value: leads.filter(l => !['recusado', 'contrato_assinado'].includes(l.status)).length },
          { label: 'Fechados', value: leads.filter(l => l.status === 'contrato_assinado').length },
          { label: 'Valor Total', value: 'R$ 13.000' },
        ].map((stat, i) => (
          <Card key={i}>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Empresa</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Data</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Valor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Notas</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">Ação</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">{lead.company}</td>
                  <td className="py-4 px-4">
                    <Badge variant={statusOptions[lead.status].color}>
                      {statusOptions[lead.status].label}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(lead.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 font-semibold text-emerald-600">{lead.value}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{lead.notes}</td>
                  <td className="py-4 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {Object.entries(statusOptions).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function WebSalesAI() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4 animate-spin">
            <Zap className="text-white" size={28} />
          </div>
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main>
        {currentPage === 'dashboard' && <DashboardPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'finder' && <FinderPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'generator' && <GeneratorPage />}
        {currentPage === 'leads' && <LeadsPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>WebSales AI © 2024 - Venda sites com inteligência artificial 🚀</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP WRAPPER
// ═══════════════════════════════════════════════════════════════

export function App() {
  return (
    <AuthProvider>
      <WebSalesAI />
    </AuthProvider>
  );
}
