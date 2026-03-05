import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Heart,
  Package,
  Scissors,
  LogOut,
  Target,
  Sparkles,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface UsedProduct {
  id: string;
  name: string;
  containerCost: number;
  containerSize: number;
  amountUsed: number;
}

interface RetailProduct {
  id: string;
  name: string;
  cost: number;
  price: number;
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  businessType?: string;
}

// --- Components ---

const Logo = ({ t }: { t: any }) => (
  <div className="flex items-center gap-3">
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M25 75 L50 25 L75 75" 
          fill="none" 
          stroke="url(#logoGrad)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        <path 
          d="M40 55 L60 55" 
          fill="none" 
          stroke="url(#logoGrad)" 
          strokeWidth="8" 
          strokeLinecap="round"
          filter="url(#glow)"
        />
      </svg>
      <div className="absolute inset-0 bg-electric/10 blur-2xl rounded-full -z-10" />
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-xl font-bold tracking-tighter text-white">MA FASHION</span>
      <span className="text-[9px] tracking-[0.5em] text-electric font-bold uppercase">{t.title}</span>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color = "white", subValue }: any) => (
  <div className="premium-card p-6 flex flex-col gap-1 relative overflow-hidden group">
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      <Icon size={80} />
    </div>
    <div className="flex justify-between items-start mb-2">
      <span className="stat-label">{label}</span>
      <Icon size={14} className="text-white/20" />
    </div>
    <div className="flex flex-col">
      <span className={`stat-value text-${color}`}>{value}</span>
      {subValue && <span className="text-[10px] text-white/30 mt-1">{subValue}</span>}
    </div>
  </div>
);

type Language = 'es' | 'en' | 'pt' | 'zh' | 'fr';

const translations = {
  es: {
    title: "Calcula tu Libertad",
    subtitle: "Ingeniería de rentabilidad para dueños de salón.",
    start: "Activar Libertad",
    identity: "Nombre Completo",
    contact: "Correo Electrónico",
    whatsapp: "Número Telefónico",
    service: "Servicio",
    retail: "Retail",
    impact: "Impacto",
    configService: "Configuración del Servicio",
    name: "Nombre del Servicio",
    price: "Precio Venta ($)",
    time: "Tiempo de Ejecución (Minutos)",
    supplies: "Insumos",
    add: "AÑADIR",
    newSupply: "Nuevo Insumo",
    concept: "Concepto / Nombre",
    containerCost: "Costo del Producto ($)",
    totalSize: "Tamaño Total (oz/ml)",
    usage: "Uso por Servicio (oz/ml)",
    realCost: "Costo Real",
    netProfit: "Ganancia Neta",
    capacity: "Aplicaciones Máximas",
    margin: "Margen",
    nextRetail: "Siguiente: Retail",
    boutique: "Boutique de Reventa",
    new: "NUEVO",
    newProduct: "Nuevo Producto",
    cost: "Costo del Producto",
    sale: "Venta",
    extraProfit: "Ganancia Extra / Clienta",
    retailRoi: "ROI Retail",
    back: "Atrás",
    seeImpact: "Ver Impacto Final",
    freedomGoal: "Tu Meta de Libertad",
    modifyGoal: "Modifica el monto para ver el cambio en tu vida.",
    traditionalModel: "Modelo Tradicional",
    freedomModel: "Modelo Freedom",
    clientsNeeded: "Clientas Necesarias",
    totalEffort: "Esfuerzo Total",
    personalVictory: "Tu Victoria Personal",
    recuperas: "Esto es lo que recuperas al mes",
    freeHours: "Horas Libres",
    lifeDays: "Días de Vida",
    moreProfitable: "Más Rentable",
    consultancy: "Agendar Consultoría Elite",
    totalInventoryProfit: "Ganancia total por las {0} aplicaciones máximas",
    recommended: "Recomendado",
    apps: "servicios / envase",
    inventoryTreasure: "Ganancia total por las {0} aplicaciones máximas",
    clientsSaved: "{0} Clientas que NO necesitas buscar para alcanzar {1}$ de tu meta de libertad",
    inventoryProfitability: "Rentabilidad Total del Inventario",
    reptilian: "Cerebro Reptiliano (Supervivencia)",
    limbic: "Cerebro Límbico (Emoción)",
    neocortex: "Neocórtex (Lógica)"
  },
  en: {
    title: "Calculate your Freedom",
    subtitle: "Profitability engineering for salon owners.",
    start: "Activate Freedom",
    identity: "Full Name",
    contact: "Email Address",
    whatsapp: "Phone Number",
    service: "Service",
    retail: "Retail",
    impact: "Impact",
    configService: "Service Configuration",
    name: "Service Name",
    price: "Sale Price ($)",
    time: "Execution Time (Minutes)",
    supplies: "Supplies",
    add: "ADD",
    newSupply: "New Supply",
    concept: "Concept / Name",
    containerCost: "Product Cost ($)",
    totalSize: "Total Size (oz/ml)",
    usage: "Usage per Service (oz/ml)",
    realCost: "Real Cost",
    netProfit: "Net Profit",
    capacity: "Maximum Applications",
    margin: "Margin",
    nextRetail: "Next: Retail",
    boutique: "Retail Boutique",
    new: "NEW",
    newProduct: "New Product",
    cost: "Product Cost",
    sale: "Sale",
    extraProfit: "Extra Profit / Client",
    retailRoi: "Retail ROI",
    back: "Back",
    seeImpact: "See Final Impact",
    freedomGoal: "Your Freedom Goal",
    modifyGoal: "Modify the amount to see the change in your life.",
    traditionalModel: "Traditional Model",
    freedomModel: "Freedom Model",
    clientsNeeded: "Necessary Clients",
    totalEffort: "Total Effort",
    personalVictory: "Your Personal Victory",
    recuperas: "This is what you recover per month",
    freeHours: "Free Hours",
    lifeDays: "Life Days",
    moreProfitable: "More Profitable",
    consultancy: "Schedule Elite Consultancy",
    totalInventoryProfit: "Total profit for the {0} maximum applications",
    recommended: "Recommended",
    apps: "services / container",
    inventoryTreasure: "Total profit for the {0} maximum applications",
    clientsSaved: "{0} Clients you DON'T need to find to reach your {1}$ freedom goal",
    inventoryProfitability: "Total Inventory Profitability",
    reptilian: "Reptilian Brain (Survival)",
    limbic: "Limbic Brain (Emotion)",
    neocortex: "Neocortex (Logic)"
  },
  pt: {
    title: "Calcula tua Liberdade",
    subtitle: "Engenharia de lucratividade para donos de salão.",
    start: "Ativar Liberdade",
    identity: "Nome Completo",
    contact: "E-mail",
    whatsapp: "Número de Telefone",
    service: "Serviço",
    retail: "Varejo",
    impact: "Impacto",
    configService: "Configuração do Serviço",
    name: "Nome do Serviço",
    price: "Preço de Venda ($)",
    time: "Tempo de Execução (Minutos)",
    supplies: "Insumos",
    add: "ADICIONAR",
    newSupply: "Novo Insumo",
    concept: "Conceito / Nome",
    containerCost: "Custo do Produto ($)",
    totalSize: "Tamanho Total (oz/ml)",
    usage: "Uso por Serviço (oz/ml)",
    realCost: "Custo Real",
    netProfit: "Lucro Líquido",
    capacity: "Aplicações Máximas",
    margin: "Margem",
    nextRetail: "Próximo: Varejo",
    boutique: "Boutique de Varejo",
    new: "NOVO",
    newProduct: "Novo Produto",
    cost: "Costo del Producto",
    sale: "Venda",
    extraProfit: "Lucro Extra / Cliente",
    retailRoi: "ROI de Varejo",
    back: "Voltar",
    seeImpact: "Ver Impacto Final",
    freedomGoal: "Sua Meta de Liberdade",
    modifyGoal: "Modifique o valor para ver a mudança em sua vida.",
    traditionalModel: "Modelo Tradicional",
    freedomModel: "Modelo Freedom",
    clientsNeeded: "Clientes Necessários",
    totalEffort: "Esforço Total",
    personalVictory: "Sua Vitória Pessoal",
    recuperas: "Isso é o que você recupera por mês",
    freeHours: "Horas Libres",
    lifeDays: "Dias de Vida",
    moreProfitable: "Mais Rentável",
    consultancy: "Agendar Consultoria Elite",
    totalInventoryProfit: "Lucro total pelas {0} aplicações máximas",
    recommended: "Recommandé",
    apps: "serviços / embalagem",
    inventoryTreasure: "Lucro total pelas {0} aplicações máximas",
    clientsSaved: "{0} Clientes que você NÃO precisa buscar para atingir sua meta de liberdade de {1}$",
    inventoryProfitability: "Lucratividade Total do Inventário",
    reptilian: "Cérebro Reptiliano (Sobrevivência)",
    limbic: "Cérebro Límbico (Emoção)",
    neocortex: "Neocórtex (Lógica)"
  },
  fr: {
    title: "Calculez votre Liberté",
    subtitle: "Ingénierie de rentabilité pour les propriétaires de salons.",
    start: "Activer la Liberté",
    identity: "Nom Complet",
    contact: "Adresse E-mail",
    whatsapp: "Numéro de Téléphone",
    service: "Service",
    retail: "Vente",
    impact: "Impact",
    configService: "Configuration du Service",
    name: "Nom du Service",
    price: "Prix de Vente ($)",
    time: "Temps d'Exécution (Minutes)",
    supplies: "Fournitures",
    add: "AJOUTER",
    newSupply: "Nouvelle Fourniture",
    concept: "Concept / Nom",
    containerCost: "Coût du Produit ($)",
    totalSize: "Taille Totale (oz/ml)",
    usage: "Utilisation par Service (oz/ml)",
    realCost: "Coût Réel",
    netProfit: "Bénéfice Net",
    capacity: "Applications Maximales",
    margin: "Marge",
    nextRetail: "Suivant : Vente",
    boutique: "Boutique de Vente",
    new: "NOUVEAU",
    newProduct: "Nouveau Produit",
    cost: "Coût du Produit",
    sale: "Vente",
    extraProfit: "Bénéfice Extra / Client",
    retailRoi: "ROI Vente",
    back: "Retour",
    seeImpact: "Voir l'Impact Final",
    freedomGoal: "Votre Objectif de Liberté",
    modifyGoal: "Modifiez le montant pour voir le changement dans votre vie.",
    traditionalModel: "Modèle Traditionnel",
    freedomModel: "Modèle Freedom",
    clientsNeeded: "Clients Nécessaires",
    totalEffort: "Effort Total",
    personalVictory: "Votre Victoire Personnelle",
    recuperas: "C'est ce que vous récupérez par mois",
    freeHours: "Heures Libres",
    lifeDays: "Jours de Vie",
    moreProfitable: "Plus Rentable",
    consultancy: "Prendre RDV Conseil Elite",
    totalInventoryProfit: "Bénéfice total pour les {0} applications maximales",
    recommended: "Recommandé",
    apps: "services / contenant",
    inventoryTreasure: "Bénéfice total pour les {0} applications maximales",
    clientsSaved: "{0} Clients que vous n'avez PAS besoin de chercher pour atteindre votre objectif de liberté de {1}$",
    inventoryProfitability: "Rentabilité Totale de l'Inventaire",
    reptilian: "Cerveau Reptilien (Survie)",
    limbic: "Cerveau Limbique (Émotion)",
    neocortex: "Néocortex (Logique)"
  },
  zh: {
    title: "计算你的自由",
    subtitle: "沙龙业主的盈利工程。",
    start: "启动自由",
    identity: "全名",
    contact: "电子邮件地址",
    whatsapp: "电话号码",
    service: "服务",
    retail: "零售",
    impact: "影响",
    configService: "服务配置",
    name: "服务名称",
    price: "销售价格 ($)",
    time: "执行时间 (分钟)",
    supplies: "耗材",
    add: "添加",
    newSupply: "新耗材",
    concept: "概念 / 名称",
    containerCost: "产品成本 ($)",
    totalSize: "总容量 (oz/ml)",
    usage: "单次服务用量 (oz/ml)",
    realCost: "实际成本",
    netProfit: "净利润",
    capacity: "最大应用次数",
    margin: "利润率",
    nextRetail: "下一步：零售",
    boutique: "零售精品店",
    new: "新增",
    newProduct: "新产品",
    cost: "产品成本",
    sale: "销售",
    extraProfit: "每位客户额外利润",
    retailRoi: "零售投资回报率",
    back: "返回",
    seeImpact: "查看最终影响",
    freedomGoal: "您的自由目标",
    modifyGoal: "修改金额以查看您生活的变化。",
    traditionalModel: "传统模式",
    freedomModel: "自由模式",
    clientsNeeded: "所需客户数",
    totalEffort: "总投入",
    personalVictory: "您的个人胜利",
    recuperas: "这是您每月恢复的时间",
    freeHours: "空闲时间",
    lifeDays: "生活天数",
    moreProfitable: "更高利润",
    consultancy: "预约精英咨询",
    totalInventoryProfit: "{0}次最大应用的利润总额",
    recommended: "推荐",
    apps: "次服务 / 容器",
    inventoryTreasure: "{0}次最大应用的利润总额",
    clientsSaved: "您不需要寻找{0}位客户即可达到{1}$的自由目标",
    inventoryProfitability: "库存总盈利能力",
    reptilian: "爬行脑（生存）",
    limbic: "边缘脑（情感）",
    neocortex: "新皮层（逻辑）"
  }
};

export default function App() {
  const [view, setView] = useState<'form' | 'calculator'>('form');
  const [activeTab, setActiveTab] = useState<'service' | 'retail' | 'impact'>('service');
  const [language, setLanguage] = useState<Language>('es');
  const [user, setUser] = useState<UserData | null>(null);
  
  const t = translations[language];
  
  // Freedom Goal
  const [targetGoal, setTargetGoal] = useState<number | string>('');
  
  // Salon Service State
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState<number | string>('');
  const [serviceMinutes, setServiceMinutes] = useState<number | string>(60);
  const [usedProducts, setUsedProducts] = useState<UsedProduct[]>([]);
  
  // Retail Products State
  const [retailProducts, setRetailProducts] = useState<RetailProduct[]>([]);

  // --- Logic ---
  const results = useMemo(() => {
    const sPrice = Number(servicePrice) || 0;
    const sMinutes = Number(serviceMinutes) || 0;
    const tGoal = Number(targetGoal) || 0;

    // Service Calculations
    const totalServiceCost = usedProducts.reduce((acc, p) => {
      const costPerUnit = p.containerSize > 0 ? p.containerCost / p.containerSize : 0;
      return acc + (costPerUnit * p.amountUsed);
    }, 0);

    const maxServicesPossible = usedProducts.reduce((min, p) => {
      if (p.amountUsed > 0 && p.containerSize > 0) {
        const possible = Math.floor(p.containerSize / p.amountUsed);
        return possible < min ? possible : min;
      }
      return min;
    }, Infinity);

    const finalMaxServices = maxServicesPossible === Infinity ? 0 : maxServicesPossible;
    const profitPerService = sPrice - totalServiceCost;
    const serviceHours = sMinutes / 60;
    const costPercentage = sPrice > 0 ? (totalServiceCost / sPrice) * 100 : 0;

    // Retail Calculations
    const retailProfitPerClient = retailProducts.reduce((acc, p) => acc + (p.price - p.cost), 0);
    const retailInvestmentPerClient = retailProducts.reduce((acc, p) => acc + p.cost, 0);
    const totalProfitPerClient = profitPerService + retailProfitPerClient;

    // Projections (Z)
    const maxProfitTraditional = finalMaxServices * profitPerService;
    const maxProfitSmart = finalMaxServices * totalProfitPerClient;
    const maxHoursTotal = finalMaxServices * serviceHours;

    // Goal Analysis
    const clientsNeededTraditional = profitPerService > 0 ? Math.ceil(tGoal / profitPerService) : 0;
    const hoursNeededTraditional = clientsNeededTraditional * serviceHours;

    const clientsNeededSmart = totalProfitPerClient > 0 ? Math.ceil(tGoal / totalProfitPerClient) : 0;
    const hoursNeededSmart = clientsNeededSmart * serviceHours;

    const clientsSavedOnGoal = clientsNeededTraditional - clientsNeededSmart;
    const hoursSavedOnGoal = hoursNeededTraditional - hoursNeededSmart;
    const daysSavedOnGoal = (hoursSavedOnGoal / 8).toFixed(1);
    const efficiencyBoost = hoursNeededSmart > 0 ? ((hoursNeededTraditional / hoursNeededSmart - 1) * 100).toFixed(0) : '0';

    return {
      totalServiceCost,
      profitPerService,
      serviceHours,
      costPercentage,
      retailProfitPerClient,
      retailInvestmentPerClient,
      totalProfitPerClient,
      finalMaxServices,
      maxProfitTraditional,
      maxProfitSmart,
      maxHoursTotal,
      clientsNeededTraditional,
      hoursNeededTraditional,
      clientsNeededSmart,
      hoursNeededSmart,
      clientsSavedOnGoal,
      hoursSavedOnGoal,
      daysSavedOnGoal,
      efficiencyBoost,
      tGoal
    };
  }, [targetGoal, servicePrice, usedProducts, serviceMinutes, retailProducts]);

  // --- Handlers ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    setUser(data);
    setView('calculator');

    fetch("https://n8n.mafashionllc.com/webhook/595df768-d246-4dc4-b481-9e80e6154d7d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...data, 
        timestamp: new Date().toISOString(),
        source: 'MA Freedom Engine' 
      }),
    }).catch(() => {});
  };

  // Service Products CRUD
  const addUsedProduct = () => {
    const newProduct: UsedProduct = {
      id: Math.random().toString(36).substr(2, 9),
      name: t.newSupply,
      containerCost: '' as any,
      containerSize: '' as any,
      amountUsed: '' as any
    };
    setUsedProducts([...usedProducts, newProduct]);
  };

  const updateUsedProduct = (id: string, field: keyof UsedProduct, value: any) => {
    setUsedProducts(usedProducts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteUsedProduct = (id: string) => {
    setUsedProducts(usedProducts.filter(p => p.id !== id));
  };

  // Retail Products CRUD
  const addRetailProduct = () => {
    const newProduct: RetailProduct = {
      id: Math.random().toString(36).substr(2, 9),
      name: t.newProduct,
      cost: '' as any,
      price: '' as any
    };
    setRetailProducts([...retailProducts, newProduct]);
  };

  const updateRetailProduct = (id: string, field: keyof RetailProduct, value: any) => {
    setRetailProducts(retailProducts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteRetailProduct = (id: string) => {
    setRetailProducts(retailProducts.filter(p => p.id !== id));
  };

  if (view === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md premium-card p-10 text-center">
          <div className="flex justify-center mb-4 gap-2">
            {(['es', 'en', 'pt', 'fr', 'zh'] as Language[]).map(lang => (
              <button 
                key={lang} 
                onClick={() => setLanguage(lang)}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${language === lang ? 'bg-electric text-obsidian border-electric' : 'border-white/10 text-white/40'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <Logo t={t} />
          <h1 className="text-3xl font-serif italic mt-8 mb-2">{t.title}</h1>
          <p className="text-white/40 text-sm mb-8">{t.subtitle}</p>
          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input name="name" placeholder={t.identity} required className="input-premium pl-12" />
            </div>
            <div className="relative">
              <LogOut className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 rotate-180" size={18} />
              <input name="email" type="email" placeholder={t.contact} required className="input-premium pl-12" />
            </div>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input name="phone" type="tel" placeholder={t.whatsapp} required className="input-premium pl-12" />
            </div>
            <button type="submit" className="btn-freedom btn-freedom-primary w-full py-4 flex items-center justify-center gap-2">
              {t.start} <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-white pb-24">
      {/* Mobile-Friendly Header */}
      <header className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-obsidian/80 backdrop-blur-xl z-50">
        <Logo t={t} />
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-[10px] font-bold border border-white/10 rounded px-2 py-1 outline-none"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="pt">PT</option>
            <option value="fr">FR</option>
            <option value="zh">ZH</option>
          </select>
          <button onClick={() => setView('form')} className="text-white/20 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="flex p-2 gap-2 bg-white/5 mx-6 mt-6 rounded-2xl">
        {[
          { id: 'service', icon: Scissors, label: t.service },
          { id: 'retail', icon: Package, label: t.retail },
          { id: 'impact', icon: Zap, label: t.impact },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-electric text-obsidian font-bold shadow-lg shadow-electric/20' : 'text-white/40 hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-xs uppercase tracking-widest hidden md:block">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'service' && (
            <motion.div key="service" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <section className="premium-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Scissors className="text-electric" size={20} />
                  <h2 className="text-sm uppercase tracking-[0.2em] font-bold">{t.configService}</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">{t.name}</label>
                      <input value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="input-premium" placeholder={t.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">{t.price}</label>
                      <input type="number" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} className="input-premium" placeholder="0" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">{t.time}</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="15" max="480" step="15" value={serviceMinutes} onChange={(e) => setServiceMinutes(Number(e.target.value))} className="flex-1 accent-electric" />
                      <span className="text-xl font-serif italic w-20 text-right">{serviceMinutes}m</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">{t.supplies}</h3>
                    </div>
                    <div className="space-y-3">
                      {usedProducts.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="text-[8px] uppercase text-white/20 block mb-1">{t.concept}</label>
                              <input value={p.name} onChange={(e) => updateUsedProduct(p.id, 'name', e.target.value)} className="bg-transparent border-none p-0 text-xs w-full font-bold" />
                            </div>
                            <button onClick={() => deleteUsedProduct(p.id)} className="text-white hover:text-red-400"><Trash2 size={12} /></button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[8px] uppercase text-white/20 block mb-1">{t.containerCost}</label>
                              <input type="number" value={p.containerCost} onChange={(e) => updateUsedProduct(p.id, 'containerCost', e.target.value)} className="bg-white/5 rounded-lg p-2 text-[10px] focus:ring-1 focus:ring-electric outline-none w-full" placeholder="0" />
                            </div>
                            <div>
                              <label className="text-[8px] uppercase text-white/20 block mb-1">{t.totalSize}</label>
                              <input type="number" value={p.containerSize} onChange={(e) => updateUsedProduct(p.id, 'containerSize', e.target.value)} className="bg-white/5 rounded-lg p-2 text-[10px] focus:ring-1 focus:ring-electric outline-none w-full" placeholder="0" />
                            </div>
                            <div>
                              <label className="text-[8px] uppercase text-white/20 block mb-1">{t.usage}</label>
                              <input type="number" value={p.amountUsed} onChange={(e) => updateUsedProduct(p.id, 'amountUsed', e.target.value)} className="bg-white/5 rounded-lg p-2 text-[10px] focus:ring-1 focus:ring-electric outline-none border border-electric/20 w-full" placeholder="0" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={addUsedProduct} className="mt-4 w-full py-3 rounded-xl border border-dashed border-white/10 text-[10px] text-electric font-bold flex items-center justify-center gap-1 hover:bg-white/5 transition-all">
                      <Plus size={12} /> {t.add}
                    </button>
                  </div>
                </div>
              </section>

              {/* Mini Report: Service */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="premium-card p-4 text-center">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">{t.realCost}</span>
                  <span className="text-xl font-serif italic text-red-400">${results.totalServiceCost.toFixed(2)}</span>
                </div>
                <div className="premium-card p-4 text-center">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">{t.netProfit}</span>
                  <span className="text-xl font-serif italic text-electric">${results.profitPerService.toFixed(0)}</span>
                </div>
                <div className="premium-card p-4 text-center">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">{t.capacity}</span>
                  <span className="text-xl font-serif italic text-gold">{results.finalMaxServices}</span>
                </div>
                <div className="premium-card p-4 text-center col-span-2 md:col-span-1">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">{t.margin}</span>
                  <span className="text-xl font-serif italic text-white">{(100 - results.costPercentage).toFixed(0)}%</span>
                </div>
                <div className="premium-card p-4 text-center col-span-2 md:col-span-2 border-gold/20 bg-gold/[0.02]">
                  <span className="text-[8px] uppercase tracking-widest text-gold/60 block mb-1">{t.inventoryTreasure}</span>
                  <span className="text-xl font-serif italic text-gold">${results.maxProfitTraditional.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => setActiveTab('retail')} className="btn-freedom btn-freedom-primary w-full py-4 flex items-center justify-center gap-2">
                {t.nextRetail} <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {activeTab === 'retail' && (
            <motion.div key="retail" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <section className="premium-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Package className="text-gold" size={20} />
                    <h2 className="text-sm uppercase tracking-[0.2em] font-bold">{t.boutique}</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {retailProducts.map((product) => (
                    <div key={product.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <input value={product.name} onChange={(e) => updateRetailProduct(product.id, 'name', e.target.value)} className="bg-transparent border-none p-0 text-sm w-full font-medium" />
                        <button onClick={() => deleteRetailProduct(product.id)} className="text-white hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[8px] uppercase text-white/20">{t.cost}</span>
                          <input type="number" value={product.cost} onChange={(e) => updateRetailProduct(product.id, 'cost', e.target.value)} className="bg-white/5 rounded-lg p-2 text-xs w-full outline-none" placeholder="0" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] uppercase text-white/20">{t.sale}</span>
                          <input type="number" value={product.price} onChange={(e) => updateRetailProduct(product.id, 'price', e.target.value)} className="bg-white/5 rounded-lg p-2 text-xs w-full outline-none border border-gold/20" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addRetailProduct} className="mt-4 w-full py-3 rounded-xl border border-dashed border-gold/20 text-[10px] text-gold font-bold flex items-center justify-center gap-1 hover:bg-gold/5 transition-all">
                  <Plus size={12} /> {t.new}
                </button>
              </section>

              {/* Mini Report: Retail */}
              <div className="grid grid-cols-2 gap-4">
                <div className="premium-card p-6 border-gold/20 bg-gold/[0.02]">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block mb-2">{t.extraProfit}</span>
                  <span className="text-3xl font-serif italic text-gold">${results.retailProfitPerClient.toFixed(0)}</span>
                </div>
                <div className="premium-card p-6">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">{t.retailRoi}</span>
                  <span className="text-3xl font-serif italic text-white">
                    {results.retailInvestmentPerClient > 0 ? ((results.retailProfitPerClient / results.retailInvestmentPerClient) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setActiveTab('service')} className="flex-1 py-4 rounded-2xl bg-white/5 text-white/40 font-bold text-xs uppercase tracking-widest">{t.back}</button>
                <button onClick={() => setActiveTab('impact')} className="flex-[2] btn-freedom btn-freedom-primary py-4 flex items-center justify-center gap-2">
                  {t.seeImpact} <Zap size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div key="impact" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10">
              <section className="premium-card p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4 block">{t.freedomGoal}</span>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-4xl font-light text-white/20">$</span>
                  <input type="number" value={targetGoal} onChange={(e) => setTargetGoal(Number(e.target.value))} className="bg-transparent text-6xl font-serif italic text-center w-48 focus:outline-none border-b border-white/10" />
                </div>
                <p className="text-xs text-white/30 italic">{t.modifyGoal}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional */}
                <div className="premium-card p-8 border-red-500/10 bg-red-500/[0.01]">
                  <h3 className="text-[10px] uppercase tracking-widest text-red-400/60 mb-8 font-bold">{t.traditionalModel}</h3>
                  <div className="space-y-6">
                    <div>
                      <span className="text-4xl font-light block">{results.clientsNeededTraditional}</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/20">{t.clientsNeeded}</span>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <span className="text-2xl font-light block text-white/60">{results.hoursNeededTraditional.toFixed(0)}h</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/20">{t.totalEffort}</span>
                    </div>
                  </div>
                </div>

                {/* Smart */}
                <div className="premium-card p-8 border-electric/30 bg-electric/[0.03] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric text-obsidian text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{t.recommended}</div>
                  <h3 className="text-[10px] uppercase tracking-widest text-electric mb-8 font-bold">{t.freedomModel}</h3>
                  <div className="space-y-6">
                    <div>
                      <span className="text-4xl font-light block text-electric">{results.clientsNeededSmart}</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/20">{t.clientsNeeded}</span>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <span className="text-2xl font-light block text-electric">{results.hoursNeededSmart.toFixed(0)}h</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/20">{t.totalEffort}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Inventory Profitability (Z) */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="premium-card p-8 bg-gradient-to-b from-white/[0.04] to-transparent border-gold/30 relative overflow-hidden group"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 blur-[100px] rounded-full group-hover:bg-gold/10 transition-colors duration-700" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-2 rounded-lg bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <h3 className="text-sm uppercase tracking-[0.25em] font-bold text-white/80">
                    {t.inventoryTreasure.replace('{0}', results.finalMaxServices.toString())}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04]">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 block mb-3">{t.traditionalModel}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-light tracking-tighter text-white/40">${results.maxProfitTraditional.toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-gold/[0.05] border border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-50" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 block mb-3 relative z-10">{t.freedomModel}</span>
                    <div className="flex items-baseline gap-2 relative z-10">
                      <span className="text-6xl font-serif italic tracking-tighter text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">${results.maxProfitSmart.toLocaleString()}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.section>

              {/* The "Wow" Impact */}
              <section className="premium-card p-10 bg-gradient-to-br from-electric/10 to-transparent border-electric/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-electric/20 flex items-center justify-center text-electric">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif italic">{t.personalVictory}</h2>
                    <p className="text-xs text-white/40">{t.recuperas}</p>
                    <span className="text-[8px] uppercase tracking-widest text-electric/60 font-bold">{t.limbic}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-3xl font-light block text-electric">{results.hoursSavedOnGoal}h</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/40">{t.freeHours}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-light block text-gold">{results.daysSavedOnGoal}</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/40">{t.lifeDays}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-light block text-white">x{results.efficiencyBoost}%</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/40">{t.moreProfitable}</span>
                    <span className="text-[7px] uppercase tracking-widest text-white/20 block mt-1">{t.neocortex}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-3">
                    <Users size={20} />
                  </div>
                  <span className="text-2xl font-light block text-white">{results.clientsSavedOnGoal}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 text-center px-6">
                    {t.clientsSaved.replace('{0}', results.clientsSavedOnGoal.toString()).replace('{1}', results.tGoal.toString())}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-white/20 mt-2">{t.reptilian}</span>
                </div>
              </section>

              <button 
                onClick={() => {
                  // Send results to webhook as well
                  fetch("https://n8n.mafashionllc.com/webhook/595df768-d246-4dc4-b481-9e80e6154d7d", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                      user,
                      results,
                      timestamp: new Date().toISOString(),
                      action: 'consultancy_click',
                      source: 'MA Freedom Engine' 
                    }),
                  }).catch(() => {});

                  const message = encodeURIComponent(`¡Hola! 👋 Acabo de usar el Freedom Engine y me ha volado la cabeza 🤯. Me encantaría agendar mi Consultoría Elite para llevar mi negocio al siguiente nivel de libertad. 

Mis datos:
👤 Nombre: ${user?.name || ''}
📧 Email: ${user?.email || ''}
📱 WhatsApp: ${user?.phone || ''}

¡Espero tu mensaje! ✨`);
                  window.open(`https://wa.me/14072181294?text=${message}`, '_blank');
                }}
                className="btn-freedom btn-freedom-primary w-full py-5 flex items-center justify-center gap-3 group"
              >
                {t.consultancy}
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-electric shadow-[0_0_10px_rgba(0,229,255,0.5)]"
          initial={{ width: '33%' }}
          animate={{ width: activeTab === 'service' ? '33%' : activeTab === 'retail' ? '66%' : '100%' }}
        />
      </div>
    </div>
  );
}
