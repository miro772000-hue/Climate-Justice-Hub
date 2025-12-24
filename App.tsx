
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import SectionCard from './components/SectionCard';
import ChatBot from './components/ChatBot';
import { SECTIONS } from './constants';
import { SectionData } from './types';

export const SearchContext = React.createContext('');

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return SECTIONS;

    const contextMap: Record<string, string[]> = {
      'سياسة': ['political', 'حكم', 'دول', 'صندوق', 'دبلوماسية', 'نزاع', 'قانون'],
      'بيئة': ['environmental', 'طبيعة', 'مناخ', 'بحر', 'تصحر', 'تلوث', 'كربون', 'مياه', 'شح', 'نيل'],
      'اجتماع': ['social', 'ناس', 'بشر', 'حقوق', 'نساء', 'صحة', 'هجرة', 'فقر', 'مجتمع'],
      'اقتصاد': ['economic', 'مال', 'تمويل', 'دين', 'وظائف', 'سوق', 'استثمار', 'بنوك'],
      'تكنولوجيا': ['technological', 'تقنية', 'ذكاء', 'رقمي', 'ابتكار', 'نظام', 'تطبيق'],
      'مقدمة': ['intro', 'أساس', 'مفهوم', 'تعريف', 'مبادئ', 'تاريخ'],
    };

    return SECTIONS.filter(section => {
      const isContextMatch = Object.entries(contextMap).some(([key, keywords]) => 
        (query.includes(key) || keywords.some(k => query.includes(k))) && section.type.includes(keywords[0])
      );

      const inTitle = section.title.toLowerCase().includes(query);
      const inIntro = section.intro.toLowerCase().includes(query);
      const inPoints = section.points.some(p => 
        p.text.toLowerCase().includes(query) || 
        p.definition?.toLowerCase().includes(query) ||
        p.mapInfo?.regionName.toLowerCase().includes(query)
      );

      return isContextMatch || inTitle || inIntro || inPoints;
    });
  }, [searchQuery]);

  const handleWebSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery || 'العدالة المناخية')}`, '_blank');
  };

  return (
    <SearchContext.Provider value={searchQuery}>
      <div className="min-h-screen bg-background font-cairo text-accent overflow-x-hidden">
        <Navbar 
          onSearch={setSearchQuery}
          onWebSearch={handleWebSearch}
          onPrint={() => window.print()}
          onShare={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ الرابط!');
          }}
        />

        <header className="relative py-40 text-center bg-cover bg-center no-print overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background/20 backdrop-blur-[1px]"></div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary font-black text-xs uppercase tracking-widest mb-6">
              منصة تعليمية متخصصة
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] leading-tight">
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-emerald-300">العدالة المناخية</span>
              <span className="block mt-2">.. الضرورة الغائبة والهدف المشترك</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto font-bold">
              كُن صوت العدالة.. من أجل غد مستدام
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/40 hover:scale-105 hover:bg-secondary active:scale-95 transition-all flex items-center gap-3"
              >
                <i className="fa-solid fa-layer-group"></i> استكشف المحاور الشاملة للعدالة
              </button>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-black rounded-2xl shadow-xl hover:bg-white/20 transition-all flex items-center gap-3 group"
              >
                <i className="fa-solid fa-graduation-cap group-hover:rotate-12 transition-transform"></i> دليل الطالب للعدالة
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-20 min-h-[500px]">
          {searchQuery && (
            <div className="mb-12 p-8 bg-white rounded-[2.5rem] border border-primary/20 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-sm">نتائج البحث عن:</p>
                  <p className="text-3xl font-black text-accent">"{searchQuery}"</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block px-4 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase mb-1">ذكاء اصطناعي نشط</span>
                  <p className="text-xs font-bold text-gray-500">وجدنا {filteredSections.length} تطابق ذكي</p>
                </div>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-black hover:bg-red-100 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="space-y-24">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <SectionCard 
                  key={section.id} 
                  section={section} 
                  onShowSources={(sec) => setSelectedSection(sec)}
                />
              ))
            ) : (
              <div className="py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-100 shadow-inner">
                <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl">
                  <i className="fa-solid fa-cloud-moon"></i>
                </div>
                <h3 className="text-4xl font-black text-accent mb-6">لم نعثر على نتائج دقيقة</h3>
                <p className="text-gray-400 font-bold mb-12 max-w-md mx-auto text-lg leading-relaxed">
                  جرب البحث عن كلمات مختلفة مثل "تكنولوجيا"، "نيل"، أو "تغيير" لاستكشاف المحتوى.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-12 py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  الرجوع للمنهج الكامل
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="relative mt-20 pt-24 pb-12 overflow-hidden no-print">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-white to-white z-0"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            
            {/* Academic Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 transform hover:scale-110 transition-transform duration-500">
               <i className="fa-solid fa-pen-nib text-3xl text-primary"></i>
            </div>

            {/* Label */}
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">
              إعداد وتصميم المحتوى العلمي والمنصة الالكترونية
            </h3>

            {/* Dr Name */}
            <h1 className="text-4xl md:text-5xl font-black text-accent mb-6">
              دكتورة / مروى حسين إسماعيل
            </h1>

            {/* Academic Title Card */}
            <div className="inline-flex flex-col md:flex-row items-center gap-3 md:gap-6 bg-white px-8 py-4 rounded-full border border-gray-100 shadow-lg mb-12 hover:shadow-xl transition-shadow">
               <div className="flex items-center gap-2">
                 <i className="fa-solid fa-user-graduate text-gray-400"></i>
                 <span className="text-gray-600 font-bold text-sm">أستاذ المناهج وطرق التدريس</span>
               </div>
               <div className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
               <div className="flex items-center gap-2">
                 <i className="fa-solid fa-building-columns text-gray-400"></i>
                 <span className="text-gray-600 font-bold text-sm">كلية التربية - جامعة عين شمس</span>
               </div>
            </div>

            {/* Footer Bottom */}
            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-4 text-gray-400 text-xs font-bold">
               <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - منصة العدالة المناخية</p>
               <span className="hidden md:block text-gray-300">•</span>
               <p>منصة مخصصة لتعزيز المسئولية الاخلاقية والاتجاه نحو العمل المناخي لدى الطلاب المعلمين بكليات التربية</p>
            </div>

          </div>
        </footer>

        {selectedSection && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-accent/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-2 bg-primary"></div>
              <button 
                onClick={() => setSelectedSection(null)}
                className="absolute top-6 left-6 text-gray-300 hover:text-accent transition-colors"
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
              <h3 className="text-2xl font-black text-accent mb-6">المراجع والتقارير الدولية المعتمدة</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedSection.sources?.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-primary/10 hover:border-primary/20 border-2 border-transparent transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <i className="fa-solid fa-link"></i>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-black text-gray-700 block mb-0.5">{s.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-primary transition-colors">عرض التقرير الرسمي <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i></span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {isGuideOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-accent/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-10 relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-primary to-secondary"></div>
              
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="absolute top-8 left-8 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl border border-primary/20">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <h3 className="text-3xl font-black text-accent">دليل الطالب للعدالة المناخية</h3>
                </div>
                <p className="text-slate-500 font-bold text-lg leading-relaxed">
                  عزيزي الطالب، أنت لست مجرد متلقٍ للمعلومة؛ أنت "سفير المستقبل" وصانع الوعي في الأجيال القادمة.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-6">
                <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                  <h4 className="font-black text-primary mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-map-signs"></i> رحلة التعلم المستدام
                  </h4>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    ابدأ باستكشاف "الأبعاد البيئية" لتعرف حجم التحدي، ثم انتقل عبر المسارات "السياسية والاقتصادية" لتفهم آليات القرار، وصولاً إلى "البعد الاجتماعي" الذي يمثل جوهر كرامة الإنسان.
                  </p>
                </div>

                <div className="p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                  <h4 className="font-black text-blue-600 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-scale-balanced"></i> ميثاق الالتزام الأخلاقي
                  </h4>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    بصفتك معلماً مستقبلياً، يقع على عاتقك غرس قيم "الإنصاف" و"المسؤولية المشتركة". العدالة المناخية تبدأ من وعيك بحقوق الفئات الأكثر هشاشة، وتنتهي بعملك على نشر ثقافة الاستدامة.
                  </p>
                </div>

                <div className="p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100">
                  <h4 className="font-black text-amber-600 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-chalkboard-user"></i> الأثر التربوي الممتد
                  </h4>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    غايتك ليست مجرد التعلم الذاتي، بل امتلاك المهارة لتبسيط هذه المفاهيم المعقدة ونقلها لتلاميذك. حول المعرفة إلى أدوات تربوية تصنع منهم جيلاً قادراً على الابتكار وحماية كوكبه.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center shrink-0">
                <button 
                  onClick={() => {
                    setIsGuideOpen(false);
                    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-12 py-4 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  أنا مستعد للبدء الآن <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        <ChatBot />
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        `}</style>
      </div>
    </SearchContext.Provider>
  );
};

export default App;
