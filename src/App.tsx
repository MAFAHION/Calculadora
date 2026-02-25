import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Logo, Card, Input, Button, cn
} from './components/UI';
import { 
  translations, type Language 
} from './translations';
import { 
  ArrowLeft, Plus, Trash2, LogOut, MessageCircle, Globe, Download, User as UserIcon, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

type View = 'login' | 'register-1' | 'register-2' | 'calculator' | 'admin';

interface Product {
  name: string;
  cost: number;
  quantity: number;
  usage: number;
}

interface ResaleProduct {
  name: string;
  cost: number;
  salePrice: number;
}

interface CalculatorForm {
  salePrice: number;
  products: Product[];
  resaleProducts: ResaleProduct[];
}

export default function App() {
  const [view, setView] = useState<View>('login');
  const [lang, setLang] = useState<Language>('es');
  const [user, setUser] = useState<any>(null);
  const [regData, setRegData] = useState<any>({});
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminPass, setAdminPass] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const t = translations[lang];

  // WhatsApp Link
  const whatsappMessage = encodeURIComponent("¡Hola! 👋 Vengo de la Calculadora MA Fashion LLC y me gustaría realizar una consulta. 🚀✨");
  const whatsappLink = `https://wa.me/14072181294?text=${whatsappMessage}`;

  // Calculator Form
  const { register, control, watch } = useForm<CalculatorForm>({
    defaultValues: {
      salePrice: 0,
      products: [{ name: '', cost: 0, quantity: 0, usage: 0 }],
      resaleProducts: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  const { fields: resaleFields, append: appendResale, remove: removeResale } = useFieldArray({
    control,
    name: "resaleProducts"
  });

  const watchedValues = watch();

  const results = useMemo(() => {
    let totalCostPerTreatment = 0;
    let minTreatments = Infinity;

    watchedValues.products.forEach(p => {
      if (p.cost && p.quantity && p.usage) {
        const costPerUnit = p.cost / p.quantity;
        totalCostPerTreatment += costPerUnit * p.usage;
        
        const possibleWithThis = p.quantity / p.usage;
        if (possibleWithThis < minTreatments) minTreatments = possibleWithThis;
      }
    });

    if (minTreatments === Infinity) minTreatments = 0;
    const finalMinTreatments = Math.floor(minTreatments);

    const netProfitPerTreatment = watchedValues.salePrice - totalCostPerTreatment;
    
    // Resale Logic
    let resaleProfitPerUnit = 0;
    let resaleCostPerUnit = 0;
    watchedValues.resaleProducts?.forEach(rp => {
      if (rp.cost && rp.salePrice) {
        resaleProfitPerUnit += (rp.salePrice - rp.cost);
        resaleCostPerUnit += rp.cost;
      }
    });

    const treatmentProfitTotal = netProfitPerTreatment * finalMinTreatments;
    const resaleProfitTotal = resaleProfitPerUnit * finalMinTreatments;
    const treatmentCostTotal = totalCostPerTreatment * finalMinTreatments;
    const resaleCostTotal = resaleCostPerUnit * finalMinTreatments;

    const grandTotalProfit = treatmentProfitTotal + resaleProfitTotal;
    const grandTotalCost = treatmentCostTotal + resaleCostTotal;
    const grandTotalRevenue = grandTotalProfit + grandTotalCost;
    
    const resaleBoostPercentage = treatmentProfitTotal > 0 ? (resaleProfitTotal / treatmentProfitTotal) * 100 : 0;
    const profitMargin = watchedValues.salePrice > 0 ? (netProfitPerTreatment / watchedValues.salePrice) * 100 : 0;

    return {
      totalCostPerTreatment,
      netProfit: netProfitPerTreatment,
      profitMargin,
      minTreatments: finalMinTreatments,
      projectedProfit: treatmentProfitTotal,
      projectedProfitWithResale: grandTotalProfit,
      projectedResaleProfit: resaleProfitTotal,
      resaleBoostPercentage,
      totalRevenue: grandTotalRevenue,
      totalCost: grandTotalCost,
      treatmentCostTotal,
      resaleCostTotal,
      treatmentProfitTotal,
      resaleProfitTotal,
      treatmentCostPct: grandTotalRevenue > 0 ? (treatmentCostTotal / grandTotalRevenue) * 100 : 0,
      resaleCostPct: grandTotalRevenue > 0 ? (resaleCostTotal / grandTotalRevenue) * 100 : 0,
      treatmentProfitPct: grandTotalRevenue > 0 ? (treatmentProfitTotal / grandTotalRevenue) * 100 : 0,
      resaleProfitPct: grandTotalRevenue > 0 ? (resaleProfitTotal / grandTotalRevenue) * 100 : 0,
      costPercentage: grandTotalRevenue > 0 ? (grandTotalCost / grandTotalRevenue) * 100 : 0,
      profitPercentage: grandTotalRevenue > 0 ? (grandTotalProfit / grandTotalRevenue) * 100 : 0
    };
  }, [watchedValues]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const phone = formData.get('phone');
    const password = formData.get('password');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setView('calculator');
    } else {
      alert(t.invalidCredentials);
    }
  };

  const handleRegister1 = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    setRegData(data);
    setView('register-2');
  };

  const handleRegister2 = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (password !== confirm) return alert(t.passwordsDontMatch);
    if (password.length < 6) return alert(t.minPassword);

    const fullData = { ...regData, password };
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData)
    });

    if (res.ok) {
      alert(t.registrationSuccess);
      setView('login');
    } else {
      const err = await res.json();
      alert(err.error || 'Error');
    }
  };

  // Admin Handlers
  const fetchAdminUsers = async () => {
    const res = await fetch(`/api/admin/users?password=${adminPass.trim()}`);
    if (res.ok) {
      const data = await res.json();
      setAdminUsers(data);
      setSelectedUsers([]);
      setIsAdminAuthenticated(true);
    } else {
      alert(t.adminIncorrectPass);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm(t.deleteUserConfirm)) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPass })
    });
    if (res.ok) fetchAdminUsers();
  };

  const deleteSelectedUsers = async () => {
    if (!selectedUsers.length) return;
    if (!confirm(t.deleteSelectedConfirm)) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPass, ids: selectedUsers })
    });
    if (res.ok) fetchAdminUsers();
  };

  const toggleUserSelection = (id: number) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === adminUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(adminUsers.map(u => u.id));
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(adminUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "S_PROFESSIONAL_Users.xlsx");
  };

  // Phone filter
  const onPhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/\D/g, '');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-24">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex gap-2 bg-white/5 backdrop-blur-xl p-1 rounded-full border border-white/10">
          {(['es', 'en', 'pt'] as Language[]).map(l => (
            <button 
              key={l} 
              onClick={() => setLang(l)}
              className={cn(
                "w-8 h-8 rounded-full text-[10px] font-bold transition-all",
                lang === l ? "bg-cyber-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "text-white/50 hover:bg-white/10"
              )}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <main className="p-6 pt-12 relative">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <Logo className="justify-center" />
                <p className="text-brand-muted text-sm uppercase tracking-[0.3em] font-light">{t.login}</p>
              </div>
              <Card className="futuristic-glow">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-cyber-cyan uppercase tracking-widest">{t.phone}</label>
                    <Input name="phone" type="tel" onInput={onPhoneInput} required placeholder="1234567890" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-cyber-cyan uppercase tracking-widest">{t.password}</label>
                    <Input name="password" type="password" required placeholder="••••••" />
                  </div>
                  <Button type="submit">{t.login}</Button>
                </form>
              </Card>
              <div className="text-center">
                <button onClick={() => setView('register-1')} className="text-xs font-bold text-white/30 hover:text-cyber-cyan transition-colors uppercase tracking-widest">
                  {t.register}
                </button>
              </div>
            </motion.div>
          )}

          {view === 'register-1' && (
            <motion.div 
              key="reg1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('login')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-cyber-cyan" />
                </button>
                <h2 className="text-xl font-bold uppercase tracking-widest">{t.register}</h2>
              </div>
              <Card className="futuristic-glow">
                <form onSubmit={handleRegister1} className="space-y-4">
                  <Input name="name" placeholder={t.name} required />
                  <Input name="email" type="email" placeholder={t.email} required />
                  <Input name="phone" type="tel" onInput={onPhoneInput} placeholder={t.phone} required minLength={10} />
                  <Input name="businessType" placeholder={t.businessType} />
                  <Input name="city" placeholder={t.city} />
                  <Input name="instagram" placeholder={t.instagram} />
                  <Input name="facebook" placeholder={t.facebook} />
                  <Input name="website" placeholder={t.website} />
                  <Button type="submit">{t.next}</Button>
                </form>
              </Card>
            </motion.div>
          )}

          {view === 'register-2' && (
            <motion.div 
              key="reg2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('register-1')} className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyber-cyan">
                  <ArrowLeft size={16} /> {t.back}
                </button>
              </div>
              <Card className="space-y-6 futuristic-glow">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-cyber-cyan uppercase tracking-widest">{t.user}</label>
                  <div className="p-4 bg-white/5 rounded-xl font-mono text-cyber-cyan border border-white/10 text-center text-lg tracking-widest">
                    {regData.phone}
                  </div>
                </div>
                <form onSubmit={handleRegister2} className="space-y-4">
                  <Input name="password" type="password" placeholder={t.password} required minLength={6} />
                  <Input name="confirmPassword" type="password" placeholder={t.confirmPassword} required minLength={6} />
                  <Button type="submit">{t.createAccount}</Button>
                </form>
              </Card>
            </motion.div>
          )}

          {view === 'calculator' && (
            <motion.div 
              key="calc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <Logo />
                <button onClick={() => { setUser(null); setView('login'); }} className="p-2 text-white/30 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <Card className="space-y-4 border-cyber-cyan/30 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyber-cyan">{t.salePrice}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-cyber-cyan">$</span>
                      <Input 
                        type="number" 
                        {...register('salePrice', { valueAsNumber: true })} 
                        className="pl-8 font-mono text-2xl font-bold text-white bg-transparent border-none focus:ring-0"
                      />
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="relative pt-10 border-white/5">
                      <button 
                        onClick={() => remove(index)}
                        className="absolute top-4 right-4 p-1 text-white/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 gap-3">
                        <Input placeholder={t.productName} {...register(`products.${index}.name` as const)} className="bg-white/5 border-white/10" />
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">{t.totalCost}</label>
                            <Input type="number" step="0.01" {...register(`products.${index}.cost` as const, { valueAsNumber: true })} className="text-xs px-2" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">{t.totalQuantity}</label>
                            <Input type="number" step="0.01" {...register(`products.${index}.quantity` as const, { valueAsNumber: true })} className="text-xs px-2" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">{t.usagePerTreatment}</label>
                            <Input type="number" step="0.01" {...register(`products.${index}.usage` as const, { valueAsNumber: true })} className="text-xs px-2" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="secondary" onClick={() => append({ name: '', cost: 0, quantity: 0, usage: 0 })} className="flex items-center justify-center gap-2 border-dashed border-white/20 text-white/50 hover:text-white futuristic-glow">
                    <Plus size={18} /> {t.addProduct}
                  </Button>
                </div>

                {/* Resale Products Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-cyber-cyan" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyber-cyan">{t.resaleProducts}</h3>
                  </div>
                  
                  {resaleFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="relative pt-10 border-white/5 bg-cyber-cyan/5">
                        <button 
                          onClick={() => removeResale(index)}
                          className="absolute top-4 right-4 p-1 text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 gap-3">
                          <Input placeholder={t.productName} {...register(`resaleProducts.${index}.name` as const)} className="bg-white/5 border-white/10" />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">{t.resaleCost}</label>
                              <Input type="number" step="0.01" {...register(`resaleProducts.${index}.cost` as const, { valueAsNumber: true })} className="text-xs px-2" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">{t.resaleSale}</label>
                              <Input type="number" step="0.01" {...register(`resaleProducts.${index}.salePrice` as const, { valueAsNumber: true })} className="text-xs px-2" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  <Button variant="secondary" onClick={() => appendResale({ name: '', cost: 0, salePrice: 0 })} className="flex items-center justify-center gap-2 border-dashed border-cyber-cyan/20 text-cyber-cyan/50 hover:text-cyber-cyan futuristic-glow">
                    <Plus size={18} /> {t.addResale}
                  </Button>
                </div>

                <Card className="bg-white/5 border-cyber-cyan/20 space-y-6 relative overflow-hidden">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 blur-[60px] -mr-16 -mt-16"
                  ></motion.div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyber-cyan/50">{t.results}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs uppercase tracking-widest text-white/50">{t.costPerTreatment}</span>
                      <span className="font-mono font-bold text-white">${results.totalCostPerTreatment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs uppercase tracking-widest text-white/50">{t.netProfit}</span>
                      <span className="result-value">${results.netProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs uppercase tracking-widest text-white/50">{t.profitMargin}</span>
                      <span className="font-mono font-bold text-cyber-pink drop-shadow-[0_0_8px_rgba(255,0,229,0.5)]">{results.profitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs uppercase tracking-widest text-white/50">{t.possibleTreatments}</span>
                      <span className="font-mono font-bold text-white text-xl">{results.minTreatments}</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{t.projectedProfit}</span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-mono font-bold text-cyber-cyan drop-shadow-[0_0_15px_rgba(0,242,255,0.6)]">${results.projectedProfit.toFixed(2)}</span>
                        {results.projectedResaleProfit > 0 && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs font-bold text-cyber-pink uppercase tracking-widest"
                          >
                            + ${results.projectedResaleProfit.toFixed(2)} {t.resaleBoost}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {results.minTreatments > 0 && (
                  <Card className="bg-white/5 border-white/5 space-y-4 futuristic-glow overflow-hidden relative">
                    {results.resaleBoostPercentage > 0 && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        className="absolute left-0 top-0 w-1 bg-gradient-to-b from-cyber-cyan to-cyber-pink"
                      />
                    )}
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{t.report}</h3>
                    
                    <div className="space-y-6">
                      {/* Visual Bar Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                          <span className="text-cyber-pink">{t.totalCosts}</span>
                          <span className="text-cyber-cyan">{t.totalProfit}</span>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/10 shadow-inner">
                          {/* Treatment Cost */}
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${results.treatmentCostPct}%` }}
                            className="h-full bg-cyber-pink/80 border-r border-white/10"
                            title={t.treatmentCostLabel}
                          />
                          {/* Resale Cost */}
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${results.resaleCostPct}%` }}
                            className="h-full bg-cyber-pink/40 border-r border-white/10"
                            title={t.resaleCostLabel}
                          />
                          {/* Treatment Profit */}
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${results.treatmentProfitPct}%` }}
                            className="h-full bg-cyber-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)] border-r border-white/10"
                            title={t.treatmentProfitLabel}
                          />
                          {/* Resale Profit */}
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${results.resaleProfitPct}%` }}
                            className="h-full bg-cyber-cyan/40"
                            title={t.resaleProfitLabel}
                          />
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-y-2 pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-pink/80"></div>
                            <span className="text-[8px] uppercase tracking-tighter text-white/40">{t.treatmentCostLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-pink/40"></div>
                            <span className="text-[8px] uppercase tracking-tighter text-white/40">{t.resaleCostLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan"></div>
                            <span className="text-[8px] uppercase tracking-tighter text-white/40">{t.treatmentProfitLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan/40"></div>
                            <span className="text-[8px] uppercase tracking-tighter text-white/40">{t.resaleProfitLabel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-widest text-white/30">{t.withoutResale}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-mono font-bold text-white">${results.projectedProfit.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-widest text-cyber-cyan font-bold">{t.withResale}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-mono font-bold text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,242,255,0.3)]">${results.projectedProfitWithResale.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {results.resaleBoostPercentage > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/20 rounded-xl text-center"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyber-cyan">
                            🚀 {t.resaleBoost}: +{results.resaleBoostPercentage.toFixed(1)}%
                          </p>
                          <p className="text-[8px] text-white/40 mt-1 uppercase tracking-widest">
                            {t.resaleMessage}
                          </p>
                        </motion.div>
                      )}

                      <div className="pt-2 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-widest text-white/50">{t.totalRevenue}</span>
                          <span className="text-lg font-mono font-bold text-white">${results.totalRevenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('login')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-cyber-cyan" />
                </button>
                <h2 className="text-xl font-bold uppercase tracking-widest">{t.admin}</h2>
              </div>

              {!isAdminAuthenticated ? (
                <Card className="space-y-4 futuristic-glow">
                  <Input 
                    type="password" 
                    placeholder={t.adminPassword} 
                    value={adminPass} 
                    onChange={e => setAdminPass(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && fetchAdminUsers()}
                  />
                  <Button onClick={fetchAdminUsers}>{t.login}</Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={downloadExcel} variant="secondary" className="flex-1 flex items-center justify-center gap-2 text-xs py-3">
                      <Download size={16} /> {t.downloadExcel}
                    </Button>
                    {selectedUsers.length > 0 && (
                      <Button 
                        onClick={deleteSelectedUsers} 
                        className="flex-1 bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2 text-xs py-3 relative z-30"
                      >
                        <Trash2 size={16} /> {t.delete} ({selectedUsers.length})
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 px-2">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.length === adminUsers.length && adminUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyber-cyan focus:ring-cyber-cyan cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t.selectAll}</span>
                  </div>

                  <div className="overflow-x-auto -mx-6 px-6">
                    <div className="min-w-[800px] space-y-2">
                      {/* Header Row */}
                      <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_60px] gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
                        <div></div>
                        <div>{t.name} / {t.email}</div>
                        <div>{t.phone} / {t.password}</div>
                        <div>{t.city} / {t.businessType}</div>
                        <div>{t.socialMedia}</div>
                        <div>{t.registrationDate}</div>
                        <div></div>
                      </div>

                      {adminUsers.map(u => (
                        <div 
                          key={u.id} 
                          className={cn(
                            "grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_60px] gap-4 px-4 py-3 items-center transition-all border border-white/5 rounded-lg text-[11px]",
                            selectedUsers.includes(u.id) ? "border-cyber-cyan/50 bg-cyber-cyan/5" : "bg-white/5 hover:bg-white/10"
                          )}
                        >
                          <div className="flex justify-center">
                            <input 
                              type="checkbox" 
                              checked={selectedUsers.includes(u.id)}
                              onChange={() => toggleUserSelection(u.id)}
                              className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyber-cyan focus:ring-cyber-cyan cursor-pointer"
                            />
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{u.name}</p>
                            <p className="text-white/40 truncate">{u.email}</p>
                          </div>
                          <div>
                            <p className="text-cyber-cyan font-mono">{u.phone}</p>
                            <p className="text-cyber-pink font-mono">🔑 {u.password}</p>
                          </div>
                          <div className="truncate">
                            <p className="text-white truncate">📍 {u.city || '-'}</p>
                            <p className="text-white/60 truncate">💼 {u.business_type || '-'}</p>
                          </div>
                          <div className="space-y-0.5">
                            {u.instagram && <p className="text-cyber-cyan truncate">IG: {u.instagram}</p>}
                            {u.facebook && <p className="text-cyber-cyan truncate">FB: {u.facebook}</p>}
                            {u.website && <p className="text-cyber-cyan truncate">🌐 {u.website}</p>}
                          </div>
                          <div className="text-white/30 text-[9px]">
                            {new Date(u.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex justify-end">
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteUser(u.id); }} 
                              className="text-white/20 hover:text-red-500 p-2 transition-colors relative z-30 cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
            Creado por <span className="text-cyber-cyan/40">Aramburu Ernesto</span>
          </p>
        </footer>
      </main>

      {/* WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={28} fill="currentColor" />
      </a>

      {/* Hidden Admin Trigger */}
      <button 
        onClick={() => setView('admin')}
        title="Administración"
        className="fixed bottom-6 left-6 w-10 h-10 text-white/20 hover:text-cyber-cyan transition-all flex items-center justify-center z-50 cursor-pointer hover:scale-110 active:scale-95"
      >
        <Shield size={22} />
      </button>
    </div>
  );
}
