'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  HelpCircle,
  Heart,
  Share2,
  Zap,
  Award,
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Görseller veritabanından dinamik olarak çekiliyor
export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [dbVariants, setDbVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  const { addItem } = useCartStore();

  const features = [
    { icon: Truck, title: "Ücretsiz Kargo", desc: "Tüm siparişlerde" },
    { icon: RotateCcw, title: "Kolay İade", desc: "14 gün içinde" },
    { icon: Zap, title: "Anında Destek", desc: "WhatsApp hattı" },
  ];

  // CRO State
  const [timeLeft, setTimeLeft] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({ name: '', city: '', time: '' });
  const [showStickyCart, setShowStickyCart] = useState(false);

  // Dynamic content state
  const [productId, setProductId] = useState<string>('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productComparePrice, setProductComparePrice] = useState<number>(0);
  const [sixReasons, setSixReasons] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [productDescription, setProductDescription] = useState<any>(null);
  const [productSpecs, setProductSpecs] = useState<any[]>([]);
  const [testimonialStats, setTestimonialStats] = useState<any>(null);

  // Fetch dynamic content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
        const API_URL = `${API_BASE}/api/v1/site-content`;
        
        // Fetch product data for images and variants
        const productRes = await fetch(`${API_BASE}/api/v1/products/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli`);
        if (productRes.ok) {
          const productData = await productRes.json();
          if (productData.id) {
            setProductId(productData.id);
          }
          if (productData.comparePrice) {
            setProductComparePrice(Number(productData.comparePrice));
          }
          
          // Varyantları işle
          if (productData.variants && productData.variants.length > 0) {
            setDbVariants(productData.variants);
            setSelectedVariant(productData.variants[0]);
          } else {
            // Varyant yoksa dummy bir yapı oluştur (hata almamak için)
            const defaultVariant = { id: '', name: 'Standart', price: productData.price || 0 };
            setDbVariants([defaultVariant]);
            setSelectedVariant(defaultVariant);
          }

          if (productData.images && productData.images.length > 0) {
            const urls = productData.images.map((img: any) => {
              // API'den gelen image verisi string veya { url: string } formatında olabilir
              let url = '';
              if (typeof img === 'string') {
                url = img;
              } else if (img && typeof img === 'object') {
                // img object ise, url veya path property'sini kontrol et
                url = img.url || img.path || img.src || '';
              }
              
              // Boş URL kontrolü
              if (!url) return '';
              
              // Tam URL mi yoksa relative path mi kontrol et
              if (url.startsWith('http')) return url;
              if (url.startsWith('//')) return `https:${url}`;
              
              // Relative path ise API_BASE ekle
              return `${API_BASE}${url.startsWith('/') ? url : `/${url}`}`;
            }).filter(Boolean); // Boş string'leri filtrele
            
            setProductImages(urls);
          }
        }

        // Fetch reasons
        const reasonsRes = await fetch(`${API_URL}/product_360sehpa_reasons`);
        if (reasonsRes.ok) {
          const reasonsData = await reasonsRes.json();
          if (reasonsData?.data?.items) setSixReasons(reasonsData.data.items);
        }

        // Fetch comparison
        const comparisonRes = await fetch(`${API_URL}/product_360sehpa_comparison`);
        if (comparisonRes.ok) {
          const compData = await comparisonRes.json();
          if (compData?.data?.rows) setComparisonData(compData.data.rows);
        }

        // Fetch testimonials
        const testimonialsRes = await fetch(`${API_URL}/product_360sehpa_testimonials`);
        if (testimonialsRes.ok) {
          const testData = await testimonialsRes.json();
          if (testData?.data?.reviews) setTestimonials(testData.data.reviews);
          if (testData?.data?.stats) setTestimonialStats(testData.data.stats);
        }

        // Fetch FAQs
        const faqsRes = await fetch(`${API_URL}/product_360sehpa_faqs`);
        if (faqsRes.ok) {
          const faqsData = await faqsRes.json();
          if (faqsData?.data?.faqs) setFaqs(faqsData.data.faqs);
        }

        // Fetch description
        const descRes = await fetch(`${API_URL}/product_360sehpa_description`);
        if (descRes.ok) {
          const descData = await descRes.json();
          setProductDescription(descData);
        }

        // Fetch specs
        const specsRes = await fetch(`${API_URL}/product_360sehpa_specs`);
        if (specsRes.ok) {
          const specsData = await specsRes.json();
          if (specsData?.data?.specs) setProductSpecs(specsData.data.specs);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  // CRO Effects
  useEffect(() => {
    // Scroll listener for Sticky Cart
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyCart(true);
      } else {
        setShowStickyCart(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // Countdown logic
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(15, 0, 0, 0);

      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diff = targetTime.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    // Live Notification Logic
    const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana"];
    const names = ["Ahmet B.", "Mehmet K.", "Can D.", "Burak Y.", "Ali C.", "Mert A.", "Emre T.", "Kemal S."];
    
    const triggerNotification = () => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomTime = Math.floor(Math.random() * 15) + 1;

      setNotificationData({ name: randomName, city: randomCity, time: `${randomTime} dk` });
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 5000);
    };

    const firstTimeout = setTimeout(() => {
      triggerNotification();
      setInterval(triggerNotification, 40000);
    }, 10000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, []);

  const handleAddToCart = async () => {
    try {
      if (!productId) {
        toast.error('Ürün bilgisi yüklenemedi, lütfen sayfayı yenileyin');
        return;
      }
      if (!selectedVariant) {
        toast.error('Lütfen bir seçenek belirleyin');
        return;
      }
      await addItem(productId, quantity, selectedVariant.id);
      toast.success('Ürün sepete eklendi!');
    } catch (error: any) {
      console.error('Sepete ekleme hatası:', error);
      toast.error(error.message || 'Ürün eklenirken bir hata oluştu');
    }
  };

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">360 Sehpa / Padog</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Product Main */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-lg">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full h-full">
                    {productImages.length > 0 ? (
                      <img
                        src={productImages[selectedImage]}
                        alt={`Universal Motosiklet Kaldırma Sehpası 360 Derece Kilitli Paddock Görsel ${selectedImage + 1}`}
                        className="w-full h-full object-cover"
                        fetchPriority={selectedImage === 0 ? "high" : "auto"}
                        loading={selectedImage === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <Package className="w-32 h-32 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Ürün Görseli {selectedImage + 1}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {selectedVariant?.comparePrice && Number(selectedVariant.comparePrice) > currentPrice && (
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      %{Math.round(((Number(selectedVariant.comparePrice) - currentPrice) / Number(selectedVariant.comparePrice)) * 100)} İNDİRİM
                    </span>
                  )}
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Stokta
                  </span>
                </div>

                {/* Navigation */}
                <button onClick={() => setSelectedImage(prev => prev === 0 ? productImages.length - 1 : prev - 1)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedImage(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all overflow-hidden ${
                      selectedImage === index ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center border-gray-200">
                      {productImages.length > index ? (
                        <img 
                          src={productImages[index]} 
                          alt={`Universal Motosiklet Kaldırma Sehpası Küçük Görsel ${index + 1}`} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Universal Motosiklet Kaldırma Sehpası
                  <span className="block text-primary-600">360° Döner - Kilitli</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-500">127 Değerlendirme</span>
                  <span className="text-green-600 text-sm font-medium">● Stokta Var</span>
                </div>
              </div>

              {/* Info Bars */}
              <div className="space-y-2">
                {/* Bar 1 - Kargo (2 columns) */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <div className="p-3 flex items-center justify-center gap-2 bg-red-50">
                      <div className="bg-red-100 p-1.5 rounded-lg text-red-600 animate-pulse flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-red-800 whitespace-nowrap">BUGÜN KARGOYA VERİLMESİ İÇİN KALAN SÜRE</p>
                        <p className="text-xs text-red-600 font-bold">{timeLeft}</p>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-center gap-2 bg-green-50">
                      <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-green-800 whitespace-nowrap">AYNI GÜN KARGO</p>
                        <p className="text-xs text-green-600">15:00 öncesi</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bar 2 - Avantajlar (3 columns) */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 divide-x divide-gray-200">
                    <div className="p-2.5 flex items-center justify-center gap-1.5 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => setQuantity(2)}>
                      <span className="text-base">🔥</span>
                      <span className="text-[11px] font-bold text-orange-800 whitespace-nowrap">2 Al %10 İndirim</span>
                    </div>
                    <div className="p-2.5 flex items-center justify-center gap-1.5 bg-emerald-50">
                      <span className="text-base">🎁</span>
                      <span className="text-[11px] font-bold text-emerald-800 whitespace-nowrap">Takoz Hediye</span>
                    </div>
                    <div className="p-2.5 flex items-center justify-center gap-1.5 bg-blue-50">
                      <span className="text-base">🚚</span>
                      <span className="text-[11px] font-bold text-blue-800 whitespace-nowrap">Ücretsiz Kargo</span>
                    </div>
                  </div>
                </div>
              </div>

{/* Price Card */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-100 rounded-2xl p-6">
                {/* Ana fiyat - comparePrice varsa indirimli göster */}
                {productComparePrice > currentPrice ? (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg text-gray-400 line-through">{productComparePrice.toLocaleString('tr-TR')} TL</span>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        %{Math.round(((productComparePrice - currentPrice) / productComparePrice) * 100)} indirim
                      </span>
                    </div>
                    <span className="text-4xl font-bold text-primary-600">{currentPrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                ) : (
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">{currentPrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}
                <p className="text-gray-600 text-sm mb-4">KDV Dahil - Ücretsiz Kargo</p>
                
                {/* Çoklu Adet Fiyat Tablosu */}
                <div className="bg-white rounded-xl overflow-hidden border border-primary-100">
                  <div className="grid grid-cols-3 text-center text-xs font-semibold">
                    <div className="py-2.5 bg-gray-50 text-gray-600">Adet</div>
                    <div className="py-2.5 bg-gray-50 text-gray-600">Birim Fiyat</div>
                    <div className="py-2.5 bg-gray-50 text-gray-600">İndirim</div>
                  </div>
                  <div className={`grid grid-cols-3 text-center py-3 border-t border-primary-50 ${quantity === 1 ? 'bg-primary-50' : ''}`}>
                    <div className="text-sm font-medium text-gray-700">1 Adet</div>
                    <div className="text-sm font-bold text-gray-900">{currentPrice.toLocaleString('tr-TR')} TL</div>
                    {productComparePrice > currentPrice ? (
                      <div className="text-xs font-bold text-red-600 bg-red-100 rounded-full px-2 py-0.5 mx-auto w-fit">
                        %{Math.round(((productComparePrice - currentPrice) / productComparePrice) * 100)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </div>
                  <div 
                    className={`grid grid-cols-3 text-center py-3 border-t cursor-pointer transition-all ${quantity >= 2 ? 'bg-green-50 border-green-200' : 'hover:bg-green-50/50'}`}
                    onClick={() => setQuantity(2)}
                  >
                    <div className="text-sm font-medium text-green-700">2+ Adet</div>
                    <div className="text-sm font-bold text-green-700">{Math.round(currentPrice * 0.9).toLocaleString('tr-TR')} TL</div>
                    {productComparePrice > currentPrice ? (
                      <div className="text-xs font-bold text-green-600 bg-green-100 rounded-full px-2 py-0.5 mx-auto w-fit">
                        %{Math.round(((productComparePrice - Math.round(currentPrice * 0.9)) / productComparePrice) * 100)}
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-green-600 bg-green-100 rounded-full px-2 py-0.5 mx-auto w-fit">%10</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Variant Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Kaldırma Takoz Ebatı</label>
                <div className="flex gap-3">
                  {dbVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-xl font-semibold">-</button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-xl font-semibold">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-primary-600/30"
                >
                  <ShoppingCart className="w-6 h-6" />
                  SEPETE EKLE
                </button>
                <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-primary-600 hover:text-primary-600 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium">256-bit SSL</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium">PayTR Altyapısı</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium">Güvenli Ödeme</span>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-4 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
                    <feature.icon className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                    <p className="text-xs font-semibold text-gray-900">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6 Reasons Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">Avantajlar</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Almanız İçin 6 Neden</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sixReasons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/10"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Karşılaştırma</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Neden 360° Döner Sehpa?</h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="py-4 px-6 text-left">Özellik</th>
                  <th className="py-4 px-6 text-center bg-primary-600">✅ 360° Sehpa</th>
                  <th className="py-4 px-6 text-center text-gray-400">⚪ Standart</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full text-sm">
                        <Check className="w-4 h-4" /> {row.ours}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <X className="w-4 h-4" /> {row.theirs}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{row.feature}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                      <Check className="w-4 h-4" /> 360° Sehpa
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{row.ours}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <X className="w-4 h-4" /> Standart
                    </span>
                    <span className="text-sm text-gray-500">{row.theirs}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Yorumlar</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Kullanıcılar Ne Diyor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">"{review.title}"</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{review.content}</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">{review.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {testimonialStats && (
            <div className="mt-10 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">{testimonialStats.totalReviews}+ Olumlu Değerlendirme</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">%{testimonialStats.satisfaction} Memnuniyet</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-8">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-4 px-4 font-semibold transition-colors relative ${
                  activeTab === 'desc' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ürün Açıklaması
                {activeTab === 'desc' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 px-4 font-semibold transition-colors relative ${
                  activeTab === 'specs' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Teknik Özellikler
                {activeTab === 'specs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
              </button>
            </div>

            {/* Tab Content */}
            <div className="prose prose-lg max-w-none text-gray-600">
              {activeTab === 'desc' ? (
                <div className="space-y-4">
                  {productDescription ? (
                    <>
                      {productDescription.description && (
                        <p dangerouslySetInnerHTML={{ __html: productDescription.description }} />
                      )}
                      {productDescription.data?.features && productDescription.data.features.length > 0 && (
                        <ul className="space-y-2 mt-6">
                          {productDescription.data.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-500" /> {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400">İçerik yükleniyor...</p>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <tbody className="divide-y">
                    {productSpecs.length > 0 ? productSpecs.map((spec, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-medium text-gray-900 w-1/3">{spec.label}</td>
                        <td className="py-3">{spec.value}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={2} className="py-3 text-center text-gray-400">İçerik yükleniyor...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">SSS</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Sık Sorulan Sorular</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hemen Sipariş Verin</h2>
          <p className="text-primary-100 mb-8">Profesyonel garaj konforu artık her sürücünün ulaşabileceği kadar yakın!</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-primary-600 font-bold text-lg px-12 py-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            Şimdi Satın Al
          </button>
        </div>
      </section>

      {/* Floating Elements */}
      <AnimatePresence>
        {/* Purchase Notification */}
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50 bg-white shadow-2xl rounded-xl border border-gray-100 p-3 flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-bold">{notificationData.name}</span> - {notificationData.city}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {notificationData.time} önce satın aldı.
              </p>
            </div>
          </motion.div>
        )}

        {/* Sticky CTA */}
        {showStickyCart && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-2 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] pb-safe"
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between gap-4">
                {/* Sol: Ürün Adı */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">Universal Motosiklet Kaldırma Sehpası 360° Döner - Kilitli</p>
                </div>

                {/* Orta: Fiyat */}
                <p className="text-lg font-bold text-gray-900 whitespace-nowrap">{currentPrice.toLocaleString('tr-TR')} TL</p>

                {/* Sağ: Sepete Ekle Butonu */}
                <button
                  onClick={handleAddToCart}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2 rounded flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Sepete Ekle</span>
                  <span className="sm:hidden">Ekle</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/905551234567?text=Merhaba,%20Universal%20360°%20Döner%20Motosiklet%20Sehpası%20hakkında%20bilgi%20almak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all"
        aria-label="WhatsApp Destek"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
        </span>
      </a>
    </div>
  );
}