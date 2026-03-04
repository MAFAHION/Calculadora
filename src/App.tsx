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

const Logo = () => (
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
      <span className="text-[9px] tracking-[0.5em] text-electric font-bold uppercase">Freedom Engine</span>
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

export default function App() {
  const [view, setView] = useState<'form' | 'calculator'>('form');
  const [user, setUser] = useState<UserData | null>(null);
  
  // Freedom Goal
  const [targetGoal, setTargetGoal] = useState(20000);
  
  // Salon Service State
  const [serviceName, setServiceName] = useState('Tratamiento Premium');
  const [servicePrice, setServicePrice] = useState(250);
  const [serviceHours, setServiceHours] = useState(3);
  const [usedProducts, setUsedProducts] = useState<UsedProduct[]>([
    { id: '1', name: 'Producto Base', containerCost: 120, containerSize: 32, amountUsed: 2 }
  ]);
  
  // Retail Products State
  const [retailProducts, setRetailProducts] = useState<RetailProduct[]>([
    { id: 'r1', name: 'Kit Post-Tratamiento Premium', cost: 35, price: 95 },
    { id: 'r2', name: 'Serum Revitalizante', cost: 20, price: 55 }
  ]);
  const [selectedRetailIds, setSelectedRetailIds] = useState<string[]>(['r1']);

  // --- Logic ---
  const results = useMemo(() => {
    // Calculate Service Cost from used products
    const totalServiceCost = usedProducts.reduce((acc, p) => {
      const costPerUnit = p.containerSize > 0 ? p.containerCost / p.containerSize : 0;
      return acc + (costPerUnit * p.amountUsed);
    }, 0);

    // Y = Max Services Possible based on container capacity
    const maxServicesPossible = usedProducts.reduce((min, p) => {
      if (p.amountUsed > 0 && p.containerSize > 0) {
        const possible = Math.floor(p.containerSize / p.amountUsed);
        return possible < min ? possible : min;
      }
      return min;
    }, Infinity);

    const finalMaxServices = maxServicesPossible === Infinity ? 0 : maxServicesPossible;

    // X = Profit per service
    const profitPerService = servicePrice - totalServiceCost;
    
    // Retail Logic
    const selectedRetail = retailProducts.filter(p => selectedRetailIds.includes(p.id));
    const retailProfitPerClient = selectedRetail.reduce((acc, p) => acc + (p.price - p.cost), 0);
    const totalProfitPerClient = profitPerService + retailProfitPerClient;

    // Z = Max Profit Potential (Traditional vs Smart) for the same inventory capacity
    const maxProfitTraditional = finalMaxServices * profitPerService;
    const maxProfitSmart = finalMaxServices * totalProfitPerClient;
    const maxHoursTotal = finalMaxServices * serviceHours;

    // Goal Achievement Analysis (To reach targetGoal)
    const clientsNeededTraditional = profitPerService > 0 ? Math.ceil(targetGoal / profitPerService) : 0;
    const hoursNeededTraditional = clientsNeededTraditional * serviceHours;

    const clientsNeededSmart = totalProfitPerClient > 0 ? Math.ceil(targetGoal / totalProfitPerClient) : 0;
    const hoursNeededSmart = clientsNeededSmart * serviceHours;

    // Savings for the Goal
    const clientsSavedOnGoal = clientsNeededTraditional - clientsNeededSmart;
    const hoursSavedOnGoal = hoursNeededTraditional - hoursNeededSmart;
    const daysSavedOnGoal = (hoursSavedOnGoal / 8).toFixed(1);
    const efficiencyBoost = hoursNeededSmart > 0 ? ((hoursNeededTraditional / hoursNeededSmart - 1) * 100).toFixed(0) : '0';

    return {
      totalServiceCost,
      profitPerService,
      retailProfitPerClient,
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
      efficiencyBoost
    };
  }, [targetGoal, servicePrice, usedProducts, serviceHours, retailProducts, selectedRetailIds]);

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
      name: 'Nuevo Insumo',
      containerCost: 0,
      containerSize: 0,
      amountUsed: 0
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
      name: 'Nuevo Producto Retail',
      cost: 0,
      price: 0
    };
    setRetailProducts([...retailProducts, newProduct]);
  };

  const updateRetailProduct = (id: string, field: keyof RetailProduct, value: any) => {
    setRetailProducts(retailProducts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteRetailProduct = (id: string) => {
    setRetailProducts(retailProducts.filter(p => p.id !== id));
    setSelectedRetailIds(selectedRetailIds.filter(rid => rid !== id));
  };

  const toggleRetailSelection = (id: string) => {
    setSelectedRetailIds(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  if (view === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md premium-card p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric/5 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="mb-12 flex justify-center">
            <Logo />
          </div>
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif italic mb-3 tracking-tight">Diseña tu Libertad</h1>
            <p className="text-white/40 text-sm font-light leading-relaxed">
              Descubre cómo trabajar menos y ganar más mediante la ingeniería de rentabilidad.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="stat-label ml-1">Tu Identidad</label>
              <input name="name" placeholder="Nombre completo" required className="input-premium" />
            </div>
            <div className="space-y-1">
              <label className="stat-label ml-1">Contacto Directo</label>
              <input name="email" type="email" placeholder="Email profesional" required className="input-premium" />
            </div>
            <div className="space-y-1">
              <label className="stat-label ml-1">WhatsApp</label>
              <input name="phone" placeholder="+1 (000) 000-0000" required className="input-premium" />
            </div>
            
            <button type="submit" className="btn-freedom btn-freedom-primary w-full mt-6 flex items-center justify-center gap-3 group">
              Activar Motor de Libertad 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">
              Exclusivo para Dueños de Salón de Alto Rendimiento
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto bg-obsidian">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 animate-fade">
        <Logo />
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <Target size={12} className="text-electric" />
              <span className="stat-label mb-0">Meta de Libertad Mensual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/20 font-light text-xl">$</span>
              <input 
                type="number" 
                value={targetGoal} 
                onChange={(e) => setTargetGoal(Number(e.target.value))}
                className="bg-transparent text-4xl font-serif italic focus:outline-none w-40 border-b border-white/10 hover:border-electric/50 transition-colors"
              />
            </div>
          </div>
          <button 
            onClick={() => setView('form')} 
            className="p-4 rounded-2xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-5 space-y-10 animate-fade" style={{ animationDelay: '0.1s' }}>
          
          {/* Service Config */}
          <section className="premium-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Scissors size={60} />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center text-electric">
                <Scissors size={18} />
              </div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Servicio de Salón</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="stat-label">Nombre del Servicio</label>
                  <input 
                    value={serviceName} 
                    onChange={(e) => setServiceName(e.target.value)}
                    className="input-premium text-sm"
                    placeholder="Ej: Balayage Premium"
                  />
                </div>
                <div>
                  <label className="stat-label">Precio de Venta</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 font-light">$</span>
                    <input 
                      type="number" 
                      value={servicePrice} 
                      onChange={(e) => setServicePrice(Number(e.target.value))}
                      className="input-premium pl-12"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <label className="stat-label mb-0">Insumos Utilizados</label>
                    {results.finalMaxServices > 0 && (
                      <span className="text-[10px] text-electric font-bold animate-pulse">
                        Capacidad: {results.finalMaxServices} servicios / envase
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={addUsedProduct}
                    className="text-[10px] text-electric hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest font-bold"
                  >
                    <Plus size={12} /> Añadir Insumo
                  </button>
                </div>
                
                <div className="space-y-4">
                  {usedProducts.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center gap-3">
                        <input 
                          value={p.name}
                          onChange={(e) => updateUsedProduct(p.id, 'name', e.target.value)}
                          className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full font-medium"
                          placeholder="Nombre del producto"
                        />
                        <button onClick={() => deleteUsedProduct(p.id)} className="text-white/10 hover:text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase text-white/20">Costo Envase</span>
                          <input 
                            type="number" 
                            value={p.containerCost}
                            onChange={(e) => updateUsedProduct(p.id, 'containerCost', Number(e.target.value))}
                            className="bg-transparent border-b border-white/5 p-0 text-[10px] focus:ring-0"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase text-white/20">Tamaño (oz/ml)</span>
                          <input 
                            type="number" 
                            value={p.containerSize}
                            onChange={(e) => updateUsedProduct(p.id, 'containerSize', Number(e.target.value))}
                            className="bg-transparent border-b border-white/5 p-0 text-[10px] focus:ring-0"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase text-white/20">Uso (oz/ml)</span>
                          <input 
                            type="number" 
                            value={p.amountUsed}
                            onChange={(e) => updateUsedProduct(p.id, 'amountUsed', Number(e.target.value))}
                            className="bg-transparent border-b border-white/5 p-0 text-[10px] focus:ring-0 text-electric font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="stat-label">Horas de Ejecución</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="number" 
                    step="0.5"
                    value={serviceHours} 
                    onChange={(e) => setServiceHours(Number(e.target.value))}
                    className="input-premium pl-12"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Retail Boutique */}
          <section className="premium-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Package size={60} />
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  <Package size={18} />
                </div>
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Boutique Retail</h2>
              </div>
              <button 
                onClick={addRetailProduct}
                className="btn-freedom btn-freedom-outline py-2 px-4 text-[10px] flex items-center gap-2"
              >
                <Plus size={12} /> Nuevo Producto
              </button>
            </div>

            <div className="space-y-5">
              <AnimatePresence>
                {retailProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedRetailIds.includes(product.id)}
                          onChange={() => toggleRetailSelection(product.id)}
                          className="w-5 h-5 rounded-lg border-white/10 bg-transparent text-electric focus:ring-electric/50 cursor-pointer"
                        />
                      </div>
                      <input 
                        value={product.name}
                        onChange={(e) => updateRetailProduct(product.id, 'name', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full font-medium placeholder:text-white/10"
                        placeholder="Nombre del producto"
                      />
                      <button 
                        onClick={() => deleteRetailProduct(product.id)} 
                        className="text-white/5 hover:text-red-400/60 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-9">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase tracking-widest text-white/20">Costo</span>
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/10 text-[10px]">$</span>
                          <input 
                            type="number" 
                            value={product.cost}
                            onChange={(e) => updateRetailProduct(product.id, 'cost', Number(e.target.value))}
                            className="bg-transparent border-b border-white/5 p-0 pl-3 text-xs focus:ring-0 w-full focus:border-white/20 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase tracking-widest text-white/20">Venta</span>
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/10 text-[10px]">$</span>
                          <input 
                            type="number" 
                            value={product.price}
                            onChange={(e) => updateRetailProduct(product.id, 'price', Number(e.target.value))}
                            className="bg-transparent border-b border-white/5 p-0 pl-3 text-xs focus:ring-0 w-full focus:border-white/20 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right Column: Neuro-Sales Dashboard */}
        <div className="lg:col-span-7 space-y-10 animate-fade" style={{ animationDelay: '0.2s' }}>
          
          {/* Comparison Grid: Goal Achievement */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <Target size={18} className="text-electric" />
              <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-white/60">Camino a tu Meta (${targetGoal.toLocaleString()})</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Way */}
              <div className="premium-card p-10 border-red-500/5 bg-red-500/[0.01] relative group">
                <div className="flex items-center gap-3 mb-10 text-red-400/60">
                  <Zap size={14} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Sin Retail (Esclavo)</span>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <span className="stat-label">Clientas Necesarias</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-light tracking-tighter">{results.clientsNeededTraditional}</span>
                      <span className="text-white/20 text-xs uppercase tracking-widest">Mujeres</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div>
                      <span className="stat-label">Ganancia / Serv.</span>
                      <div className="stat-value text-white/60">${results.profitPerService.toFixed(0)}</div>
                    </div>
                    <div>
                      <span className="stat-label">Horas Totales</span>
                      <div className="stat-value text-red-400/40">{results.hoursNeededTraditional}h</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Freedom Way */}
              <div className="premium-card p-10 border-electric/20 bg-electric/[0.02] relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric/20 to-transparent" />
                <div className="flex items-center gap-3 mb-10 text-electric">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Con Retail (Libertad)</span>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <span className="stat-label">Clientas Necesarias</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-light tracking-tighter text-electric">{results.clientsNeededSmart}</span>
                      <span className="text-white/20 text-xs uppercase tracking-widest">Mujeres</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div>
                      <span className="stat-label">Ganancia / Clienta</span>
                      <div className="stat-value text-electric">${results.totalProfitPerClient.toFixed(0)}</div>
                    </div>
                    <div>
                      <span className="stat-label">Horas Totales</span>
                      <div className="stat-value text-electric">{results.hoursNeededSmart}h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Grid: Max Inventory Potential */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <Package size={18} className="text-gold" />
              <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-white/60">Potencial Máximo de tu Inventario ({results.finalMaxServices} Clientas)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Potential */}
              <div className="premium-card p-10 border-white/5 bg-white/[0.01] relative group">
                <div className="flex items-center gap-3 mb-10 text-white/40">
                  <Users size={14} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Potencial Sin Retail</span>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <span className="stat-label">Ganancia Máxima</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-light tracking-tighter text-white/80">${results.maxProfitTraditional.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest mt-2 block">Por {results.finalMaxServices} Aplicaciones</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div>
                      <span className="stat-label">Horas de Trabajo</span>
                      <div className="stat-value text-white/40">{results.maxHoursTotal}h</div>
                    </div>
                    <div>
                      <span className="stat-label">Eficiencia</span>
                      <div className="stat-value text-white/20">Básica</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Potential */}
              <div className="premium-card p-10 border-gold/20 bg-gold/[0.02] relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                <div className="flex items-center gap-3 mb-10 text-gold">
                  <Sparkles size={14} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Potencial Con Retail</span>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <span className="stat-label">Ganancia Máxima</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-light tracking-tighter text-gold">${results.maxProfitSmart.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-gold/40 uppercase tracking-widest mt-2 block">Mismas {results.finalMaxServices} Aplicaciones</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div>
                      <span className="stat-label">Mismas Horas</span>
                      <div className="stat-value text-gold/60">{results.maxHoursTotal}h</div>
                    </div>
                    <div>
                      <span className="stat-label">Incremento</span>
                      <div className="stat-value text-gold">+{((results.maxProfitSmart / results.maxProfitTraditional - 1) * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The "Wow" Impact Section */}
          <section className="premium-card p-12 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-electric/5 blur-[100px] rounded-full group-hover:bg-electric/10 transition-colors" />
            
            <div className="max-w-3xl relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles size={20} className="text-electric animate-pulse" />
                <h2 className="text-4xl font-serif italic tracking-tight">Tu Victoria sobre el Tiempo</h2>
              </div>
              
              <p className="text-white/50 font-light text-lg leading-relaxed mb-12">
                Al integrar retail estratégico en tu servicio <span className="text-white font-medium">"{serviceName}"</span>, no solo vendes productos; estás <span className="text-white font-medium">comprando tu propia vida</span>. 
                Estás eliminando el desgaste de atender a <span className="text-electric font-semibold">{results.clientsSavedOnGoal} clientas</span> al mes 
                manteniendo exactamente la misma ganancia de <span className="text-white font-medium">${targetGoal.toLocaleString()}</span>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-electric mb-3">
                    <Clock size={16} />
                    <span className="stat-label mb-0">Tiempo Recuperado</span>
                  </div>
                  <span className="text-4xl font-light tracking-tighter">{results.hoursSavedOnGoal}h</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest mt-2">Mensuales</span>
                </div>
                
                <div className="flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-gold mb-3">
                    <Heart size={16} />
                    <span className="stat-label mb-0">Días de Vida</span>
                  </div>
                  <span className="text-4xl font-light tracking-tighter">{results.daysSavedOnGoal}</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest mt-2">Días libres extra</span>
                </div>

                <div className="flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-white mb-3">
                    <TrendingUp size={16} />
                    <span className="stat-label mb-0">Eficiencia</span>
                  </div>
                  <span className="text-4xl font-light tracking-tighter">x{(results.hoursNeededTraditional / results.hoursNeededSmart).toFixed(1)}</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest mt-2">Más productiva</span>
                </div>
              </div>
            </div>
          </section>

          {/* Neuro-Sales Action Footer */}
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between p-10 premium-card border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-electric/10 flex items-center justify-center text-electric shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                <Zap size={32} />
              </div>
              <div className="max-w-xs">
                <p className="text-lg font-medium mb-1">¿Lista para el siguiente nivel?</p>
                <p className="text-xs text-white/30 leading-relaxed font-light">
                  Tu cerebro reptil ya sabe que este es el camino. Deja de vender tiempo y empieza a vender libertad.
                </p>
              </div>
            </div>
            <button className="btn-freedom btn-freedom-primary px-12 py-5 flex items-center gap-3 group">
              Agendar Consultoría Elite
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          
          <footer className="pt-10 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/10">
              MA FASHION LLC • Freedom Engine v2.0
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
