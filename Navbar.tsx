
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onWebSearch: () => void;
  onPrint: () => void;
  onShare: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onWebSearch, onPrint, onShare }) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { id: 'intro', label: 'المقدمة', icon: 'fa-book-open' },
    { id: 'environmental', label: 'البيئي', icon: 'fa-leaf' },
    { id: 'political', label: 'السياسي', icon: 'fa-gavel' },
    { id: 'economic', label: 'الاقتصادي', icon: 'fa-chart-line' },
    { id: 'social', label: 'الاجتماعي', icon: 'fa-people-group' },
    { id: 'technological', label: 'التكنولوجي', icon: 'fa-microchip' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // مراقبة القسم النشط أثناء التمرير
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          setActiveSection(link.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الصف العلوي: اللوجو والبحث والأدوات */}
        <div className="flex justify-between items-center h-16 md:h-20 border-b border-gray-50 md:border-none">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <i className="fa-solid fa-leaf text-lg"></i>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-l from-accent to-primary leading-tight">
                العدالة المناخية
              </h1>
              <p className="text-[9px] text-primary/80 font-black uppercase tracking-wider -mt-1">د. مروى حسين إسماعيل</p>
            </div>
          </div>

          <div className="flex-1 max-w-sm mx-4 md:mx-8">
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-sm"></i>
              <input
                type="text"
                placeholder="ابحث..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl py-2 pr-11 pl-4 outline-none transition-all font-bold text-xs"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={onPrint}
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              title="طباعة"
            >
              <i className="fa-solid fa-print"></i>
            </button>
            <button 
              onClick={onShare}
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              title="مشاركة"
            >
              <i className="fa-solid fa-share-nodes"></i>
            </button>
            <button 
              onClick={onWebSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg text-[10px] font-black hover:bg-slate-700 transition-colors shadow-md"
            >
              <i className="fa-brands fa-google"></i>
              <span>بحث خارجي</span>
            </button>
          </div>
        </div>

        {/* الصف السفلي: روابط الأقسام (Quick Nav) */}
        <div className="flex items-center justify-center gap-2 md:gap-6 py-3 overflow-x-auto no-scrollbar scroll-smooth">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                activeSection === link.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                : 'bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <i className={`fa-solid ${link.icon} text-[10px]`}></i>
              <span className="text-[11px] font-black">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default Navbar;
