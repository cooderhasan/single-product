'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Banknote, 
  Copy, 
  CheckCircle, 
  Clock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Building2,
  Info,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { siteContentApi } from '@/lib/api';

export default function BankTransferContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIban, setCopiedIban] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 saat

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data } = await siteContentApi.getByKey('bank_accounts');
        if (data && data.data && data.data.bankAccounts) {
          setBankAccounts(data.data.bankAccounts);
        }
      } catch (error) {
        console.error('Banka hesapları yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(text);
    toast.success('IBAN kopyalandı');
    setTimeout(() => setCopiedIban(''), 2000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} saat ${minutes} dakika`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-b-2 border-primary-600 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-500 font-medium">Banka bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full bg-white p-10 rounded-[32px] shadow-sm border border-slate-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Sipariş Bulunamadı</h1>
          <p className="text-slate-500 mb-8 font-medium">Bu işlem için geçerli bir sipariş numarası gereklidir.</p>
          <Link
            href="/sepet"
            className="inline-flex items-center justify-center w-full bg-slate-900 text-white font-black py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
          >
            Alışverişe Dön
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Siparişiniz Oluşturuldu!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium"
          >
            Sipariş Numaranız: <span className="text-primary-600 font-black decoration-primary-600/30 underline underline-offset-4">{orderNumber}</span>
          </motion.p>
        </div>

        {/* Status / Timer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 text-white rounded-[32px] p-8 mb-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 opacity-20 blur-3xl -mr-10 -mt-10" />
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md">
              <Clock className="w-7 h-7 text-primary-400" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-1">Kalan Ödeme Süreniz</p>
              <p className="text-3xl font-black tracking-tight">{formatTime(timeLeft)}</p>
            </div>
            <div className="sm:ml-auto bg-primary-600/20 px-4 py-2 rounded-xl border border-primary-600/30">
              <span className="text-sm font-black text-primary-400">Beklemede</span>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 mb-8"
        >
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-primary-600" />
             </div>
             Havale / EFT Talimatları
          </h2>
          <div className="grid gap-4">
             {[
               { id: 1, text: "Aşağıdaki banka hesaplarından birini seçin." },
               { id: 2, text: "Sipariş tutarını banka hesabımıza transfer edin." },
               { id: 3, text: `Açıklama alanına sadece ${orderNumber} yazın.`, highlight: true },
               { id: 4, text: "Ödemeniz onaylandığında siparişiniz kargolanacaktır." }
             ].map((step) => (
               <div key={step.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-black text-slate-400 shadow-sm">
                    {step.id}
                  </span>
                  <p className={`text-slate-600 font-medium ${step.highlight ? 'text-primary-600 font-bold' : ''}`}>
                    {step.text}
                  </p>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Bank Accounts */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="popLayout">
            {bankAccounts.length > 0 ? bankAccounts.map((account, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 group hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">BANKA</p>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{account.bank}</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">IBAN ADRESİ</p>
                    <div className="relative group/iban">
                      <code className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-mono text-sm sm:text-lg text-slate-800 tracking-wide font-black">
                        {account.iban}
                      </code>
                      <button
                        onClick={() => copyToClipboard(account.iban)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        {copiedIban === account.iban ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">HESAP SAHİBİ</p>
                      <p className="text-sm font-bold text-slate-900">{account.accountName}</p>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ŞUBE / HESAP</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{account.branch || 'Merkez'} / {account.accountNo || '-'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div className="text-center p-12 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Banka hesabı tanımlanmamış. Lütfen destek isteyin.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Box */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-primary-600 rounded-[32px] p-8 text-white shadow-xl shadow-primary-600/20 mb-8"
        >
          <div className="flex gap-4">
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-black text-lg mb-2 tracking-tight">Önemli Not</h4>
                <p className="text-primary-100 text-sm font-medium leading-relaxed">
                  Havale/EFT işlemlerinde açıklama kısmına <strong>sadece sipariş numaranızı</strong> yazmanız yeterlidir. 
                  İşleminiz genellikle aynı iş günü içerisinde onaylanmaktadır.
                </p>
             </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 px-4">
          <Link
            href="/"
            className="w-full sm:flex-1 bg-slate-900 text-white font-black py-5 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            Alışverişe Devam Et
            <ArrowRight className="w-5 h-5 text-primary-400" />
          </Link>
          <Link
            href="/hesabim/siparisler"
            className="w-full sm:flex-1 bg-white border-2 border-slate-100 text-slate-600 font-bold py-5 px-8 rounded-2xl transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            Siparişlerim
          </Link>
        </div>
        
        <div className="mt-12 text-center opacity-30 flex items-center justify-center gap-6 saturate-0 grayscale">
            <ShieldCheck className="w-12 h-12" />
            <div className="w-px h-8 bg-slate-400" />
            <span className="text-xs font-black tracking-widest">360 SEHPA TRUST SECURITY</span>
        </div>
      </div>
    </div>
  );
}
