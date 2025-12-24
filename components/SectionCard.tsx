
import React, { useState } from 'react';
import { SectionData, Point } from '../types';
import InteractiveMap from './InteractiveMap';

interface SectionCardProps {
  section: SectionData;
  onShowSources: (section: SectionData) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, onShowSources }) => {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [completedActivities, setCompletedActivities] = useState<{individual: boolean, group: boolean}>({
    individual: false,
    group: false
  });

  const toggleActivity = (type: 'individual' | 'group') => {
    setCompletedActivities(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const currentPoint = section.points[selectedPointIndex];

  const getColorClass = (type: string) => {
    switch (type) {
      case 'social': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'technological': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'economic': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'political': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'intro': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'environmental': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-primary/5 text-primary border-primary/10';
    }
  };

  const isAllDone = completedActivities.individual && completedActivities.group;

  return (
    <section id={section.id} className="bg-white rounded-[4rem] p-6 md:p-12 shadow-sm border border-gray-100 scroll-mt-24 transition-all hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 relative z-10">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl border-2 shadow-inner ${getColorClass(section.type)}`}>
          <i className={`fa-solid ${section.id === 'intro' ? 'fa-book-open' : section.id === 'environmental' ? 'fa-leaf' : section.id === 'political' ? 'fa-gavel' : section.id === 'economic' ? 'fa-chart-line' : section.id === 'social' ? 'fa-people-group' : 'fa-microchip'}`}></i>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-black text-accent mb-3">{section.title}</h2>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">{section.intro}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Master-Detail Layout */}
      <div className="grid lg:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* Right Column: List of Topics (Master) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">اختر موضوعاً للعرض التفصيلي:</p>
          {section.points.map((point, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPointIndex(idx)}
              className={`w-full text-right p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                selectedPointIndex === idx 
                ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-105 z-10' 
                : 'border-gray-100 bg-white hover:border-primary/30 hover:bg-gray-50 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-transform duration-500 ${selectedPointIndex === idx ? 'bg-white text-primary' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-primary'}`}>
                  {idx + 1}
                </span>
                <span className={`font-black text-sm md:text-base leading-tight ${selectedPointIndex === idx ? 'text-white' : 'text-accent'}`}>{point.text}</span>
              </div>
              
              {selectedPointIndex === idx && (
                <i className="fa-solid fa-arrow-left text-white/50 text-xl animate-pulse"></i>
              )}
            </button>
          ))}
        </div>

        {/* Left Column: Detail View & Map (Detail) */}
        <div className="lg:col-span-8">
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-[3rem] p-2 md:p-2 border border-gray-100/50 min-h-[600px] transition-all duration-500">
            {/* Animated Content Container */}
            <div key={selectedPointIndex} className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6 p-4 md:p-6">
              
              {/* Header of Detail */}
              <div className="flex items-center gap-3 mb-2">
                <span className="w-12 h-1 bg-primary rounded-full"></span>
                <h3 className="text-2xl font-black text-accent">{currentPoint.text}</h3>
              </div>

              {/* Definition Card */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-2 text-primary font-black text-xs uppercase mb-3">
                   <i className="fa-solid fa-quote-right"></i> المفهوم العلمي
                 </div>
                 <p className="text-gray-600 font-bold text-lg leading-relaxed">{currentPoint.definition}</p>
              </div>

              {/* Info Grid (Causes & Impacts) - Reordered: Causes/Impacts then Example then Map */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50/60 p-5 rounded-[2rem] border border-orange-100">
                  <div className="text-orange-600 font-black text-xs uppercase mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-list-ul"></i> العوامل المسببة
                  </div>
                  <ul className="space-y-2">
                    {currentPoint.causes?.map((c, i) => (
                      <li key={i} className="text-sm font-bold text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50/60 p-5 rounded-[2rem] border border-red-100">
                  <div className="text-red-600 font-black text-xs uppercase mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-house-crack"></i> التداعيات والآثار
                  </div>
                  <ul className="space-y-2">
                    {currentPoint.impacts?.map((imp, i) => (
                      <li key={i} className="text-sm font-bold text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Example Card */}
              <div className="bg-slate-800 text-white p-6 rounded-[2rem] border-r-4 border-primary relative overflow-hidden">
                 <div className="flex items-center gap-2 font-black text-xs uppercase mb-2 text-primary/90">
                   <i className="fa-solid fa-magnifying-glass-location"></i> مثال واقعي
                 </div>
                 <p className="text-base font-bold leading-relaxed">{currentPoint.specificExamples}</p>
              </div>

              {/* Map Section - Moved to bottom */}
              {currentPoint.mapInfo && (
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-white relative z-0">
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-100">
                    <span className="text-[10px] font-black text-accent uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-location-dot text-primary"></i>
                      الموقع الجغرافي للدراسة
                    </span>
                  </div>
                  <InteractiveMap 
                    selectedPoint={currentPoint.mapInfo} 
                    sectionId={section.id}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* مختبر العمل المناخي (Interactive Climate Lab) */}
      {section.interactiveActivities && (
        <div className="mt-24 relative">
          {/* Lab Header Badge */}
          <div className="absolute -top-12 right-1/2 translate-x-1/2 md:translate-x-0 md:right-16 bg-white border-4 border-primary px-10 py-4 rounded-[2rem] font-black text-accent shadow-2xl z-20 flex items-center gap-4 animate-bounce">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-vial-circle-check"></i>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-gray-400 uppercase tracking-tighter">مختبر العمل</span>
              <span className="text-base">تطبيق عملي للمسؤولية الأخلاقية</span>
            </div>
          </div>
          
          <div className={`bg-slate-50 rounded-[5rem] p-10 md:p-16 border-4 border-dashed transition-all duration-700 ${isAllDone ? 'border-primary bg-emerald-50/30' : 'border-gray-200'}`}>
             
             {/* Progress Status */}
             <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${isAllDone ? 'bg-primary scale-110 rotate-[360deg]' : 'bg-gray-300'}`}>
                      <i className={`fa-solid ${isAllDone ? 'fa-award' : 'fa-hourglass-start'}`}></i>
                   </div>
                   <div>
                      <h4 className="font-black text-accent text-lg">مستوى إنجاز المختبر</h4>
                      <p className="text-xs font-bold text-gray-400">بصفتك معلم المستقبل، إنجازك يعني استعدادك لنقل الرسالة.</p>
                   </div>
                </div>
                <div className="text-left">
                   <span className="text-3xl font-black text-primary">{isAllDone ? '100%' : completedActivities.individual || completedActivities.group ? '50%' : '0%'}</span>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-12">
                
                {/* Individual Activity Card */}
                <div className={`group relative p-10 rounded-[4rem] border-4 transition-all duration-500 overflow-hidden ${completedActivities.individual ? 'bg-white border-primary shadow-2xl scale-[1.02]' : 'bg-white/60 border-transparent hover:border-gray-200'}`}>
                  {completedActivities.individual && (
                    <div className="absolute top-6 left-6 animate-in zoom-in-50">
                      <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <i className="fa-solid fa-check text-xl"></i>
                      </div>
                    </div>
                  )}
                  
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-xl transition-all group-hover:rotate-12 ${completedActivities.individual ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <i className={`fa-solid ${section.interactiveActivities.individual.icon || 'fa-user-graduate'}`}></i>
                  </div>
                  
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase mb-3">مسؤولية فردية</span>
                    <h5 className="text-2xl font-black text-accent">{section.interactiveActivities.individual.title}</h5>
                  </div>
                  
                  <p className="text-base text-gray-500 font-bold mb-10 leading-relaxed min-h-[80px]">
                    {section.interactiveActivities.individual.task}
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => toggleActivity('individual')} 
                      className={`w-full py-5 rounded-[2rem] text-sm font-black transition-all flex items-center justify-center gap-3 ${
                        completedActivities.individual 
                          ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                          : 'bg-accent text-white hover:bg-primary shadow-xl shadow-accent/10'
                      }`}
                    >
                      <i className={`fa-solid ${completedActivities.individual ? 'fa-certificate' : 'fa-hand-peace'}`}></i>
                      {completedActivities.individual ? 'تم التعهد والإنجاز' : 'أتعهد بالعمل كمعلم مسؤول'}
                    </button>
                    {completedActivities.individual && (
                      <p className="text-center text-primary font-black text-xs animate-pulse">🌟 أحسنت! أنت الآن سفير حقيقي للعدالة المناخية.</p>
                    )}
                  </div>
                </div>

                {/* Group Activity Card */}
                <div className={`group relative p-10 rounded-[4rem] border-4 transition-all duration-500 overflow-hidden ${completedActivities.group ? 'bg-white border-blue-500 shadow-2xl scale-[1.02]' : 'bg-white/60 border-transparent hover:border-gray-200'}`}>
                  {completedActivities.group && (
                    <div className="absolute top-6 left-6 animate-in zoom-in-50">
                      <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <i className="fa-solid fa-users-viewfinder text-xl"></i>
                      </div>
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-xl transition-all group-hover:-rotate-12 ${completedActivities.group ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <i className={`fa-solid ${section.interactiveActivities.group.icon || 'fa-people-group'}`}></i>
                  </div>
                  
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase mb-3">مسؤولية جماعية</span>
                    <h5 className="text-2xl font-black text-accent">{section.interactiveActivities.group.title}</h5>
                  </div>
                  
                  <p className="text-base text-gray-500 font-bold mb-10 leading-relaxed min-h-[80px]">
                    {section.interactiveActivities.group.task}
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => toggleActivity('group')} 
                      className={`w-full py-5 rounded-[2rem] text-sm font-black transition-all flex items-center justify-center gap-3 ${
                        completedActivities.group 
                          ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/30' 
                          : 'bg-accent text-white hover:bg-blue-500 shadow-xl shadow-accent/10'
                      }`}
                    >
                      <i className={`fa-solid ${completedActivities.group ? 'fa-award' : 'fa-users-gear'}`}></i>
                      {completedActivities.group ? 'تم العمل المشترك بنجاح' : 'تفعيل العمل الجماعي المشترك'}
                    </button>
                    {completedActivities.group && (
                      <p className="text-center text-blue-500 font-black text-xs animate-pulse">🤝 مذهل! العمل الجماعي هو مفتاح التغيير الحقيقي.</p>
                    )}
                  </div>
                </div>
             </div>

             {/* Documentation/Templates Link Button */}
             <div className="mt-12 flex justify-center">
                <a 
                  href="https://drive.google.com/drive/folders/1P9lzk1UMaDaoZiyevNsC_hFMjQ9gxyUh?usp=drive_link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 bg-white border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-[2.5rem] font-black text-sm transition-all flex items-center gap-4 shadow-xl shadow-accent/5 group transform hover:-translate-y-1"
                >
                  <i className="fa-solid fa-file-signature group-hover:scale-110 transition-transform text-lg"></i>
                  <span>عرض نماذج الأنشطة (View Activity Templates)</span>
                </a>
             </div>
             
             {/* Final Encouragement Footer */}
             {isAllDone && (
               <div className="mt-16 p-10 bg-gradient-to-br from-primary/10 to-emerald-100/30 rounded-[3rem] border-2 border-primary/20 text-center animate-in fade-in slide-in-from-bottom-6">
                  <div className="text-4xl mb-6">🏆</div>
                  <h4 className="text-2xl font-black text-primary mb-4">تهانينا يا سفير المستقبل!</h4>
                  <p className="text-gray-600 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                    لقد أتممت كافة أنشطة هذا المختبر بنجاح. تذكر دائماً أن دورك كمعلم هو أن تزرع هذه القيم في نفوس تلاميذك لتضمن لهم وللكوكب غداً أفضل.
                  </p>
               </div>
             )}

             <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                   <span className="w-12 h-0.5 bg-gray-200"></span>
                   بصمتك اليوم تبني وعي الأجيال
                   <span className="w-12 h-0.5 bg-gray-200"></span>
                </p>
             </div>
          </div>
        </div>
      )}

      {/* External Sources Button */}
      {section.sources && (
        <div className="mt-24 pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 text-3xl shadow-inner">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div className="max-w-md">
                <p className="text-accent font-black text-lg mb-1">دليل المراجع الأكاديمية</p>
                <p className="text-sm font-bold text-gray-400 leading-relaxed italic">تم تدقيق هذه المعلومات بناءً على تقارير الهيئة الحكومية الدولية المعنية بتغير المناخ (IPCC) ومنظمة اليونسكو.</p>
              </div>
           </div>
           <button 
             onClick={() => onShowSources(section)} 
             className="w-full md:w-auto px-12 py-6 bg-accent text-white rounded-[2.5rem] font-black text-sm hover:bg-primary transition-all shadow-2xl shadow-accent/10 flex items-center justify-center gap-4 group"
           >
             <i className="fa-solid fa-book-atlas group-hover:rotate-12 transition-transform text-lg"></i> 
             عرض التقارير والمصادر الرسمية
           </button>
        </div>
      )}
    </section>
  );
};

export default SectionCard;
