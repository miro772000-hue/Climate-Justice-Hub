
import { MapPoint, MapLandmark } from '../types';
import React, { useState, useEffect } from 'react';

interface InteractiveMapProps {
  selectedPoint: MapPoint | null;
  sectionId?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedPoint, sectionId }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState<MapLandmark | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // إعادة ضبط الحالة عند تغيير المنطقة المختارة
  useEffect(() => {
    setShowAnalysis(false);
    setActiveLandmark(null);
  }, [selectedPoint]);

  // إدارة التمرير في الصفحة
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isFullScreen]);

  const getMapUrl = () => {
    if (!selectedPoint) return '';
    const { lat, lng, zoom = 6 } = selectedPoint;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=k&output=embed&hl=ar`;
  };

  const getLandmarkUrl = (landmark: MapLandmark) => {
    return `https://maps.google.com/maps?q=${landmark.lat},${landmark.lng}&z=15&t=k&output=embed&hl=ar`;
  };

  const getRiskLabel = (level: string) => {
    const isIntro = sectionId === 'intro';
    switch (level) {
      case 'critical': return { text: isIntro ? 'حرج' : 'خطر حرج', color: 'bg-red-500' };
      case 'high': return { text: isIntro ? 'مرتفع' : 'خطر مرتفع', color: 'bg-orange-400' };
      case 'medium': return { text: isIntro ? 'متوسط' : 'خطر متوسط', color: 'bg-amber-400' };
      default: return { text: isIntro ? 'مستقر' : 'خطر مستقر', color: 'bg-emerald-400' };
    }
  };

  const renderMapUI = (full: boolean) => {
    if (!selectedPoint) return null;

    return (
      <div className={`relative w-full h-full bg-slate-900 overflow-hidden transition-all duration-700 ${full ? 'rounded-[1.5rem] md:rounded-[2rem]' : 'rounded-[2.5rem]'}`}>
        {/* نافذة الخريطة - Map Frame */}
        <iframe
          key={activeLandmark ? `lm-${activeLandmark.lat}-${activeLandmark.lng}-${full}` : `sp-${selectedPoint.lat}-${selectedPoint.lng}-${full}`}
          src={activeLandmark ? getLandmarkUrl(activeLandmark) : getMapUrl()}
          className="w-full h-full border-none animate-map-focus object-cover"
          allowFullScreen
          loading="lazy"
          title="التحليل الجيو-فضائي"
        ></iframe>

        {/* طبقة التظليل عند فتح التحليل */}
        {showAnalysis && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-500"></div>
        )}

        {/* شريط التحكم العلوي - Floating Window Header */}
        <div className={`absolute left-4 right-4 md:left-6 md:right-6 z-[60] flex justify-between items-center transition-all duration-500 pointer-events-none ${full ? 'top-6' : 'top-4'}`}>
          <div className="bg-white/90 backdrop-blur-xl px-4 md:px-5 py-3 rounded-[2rem] shadow-2xl border border-white/50 flex items-center gap-4 pointer-events-auto group/header max-w-[70%] md:max-w-none">
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover/header:rotate-12 shrink-0`}>
              <i className="fa-solid fa-satellite-dish text-base md:text-lg"></i>
            </div>
            <div className="text-right overflow-hidden">
              <h4 className="font-black text-accent text-xs md:text-lg leading-tight truncate">
                {activeLandmark ? activeLandmark.name : selectedPoint.regionName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${getRiskLabel(selectedPoint.riskLevel).color} animate-pulse shrink-0`}></span>
                <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-wider truncate">
                  {activeLandmark ? 'رصد دقيق' : getRiskLabel(selectedPoint.riskLevel).text}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
             {!full ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen(true);
                  }}
                  className="bg-white/90 backdrop-blur-md w-12 h-12 rounded-full border border-white shadow-xl flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 group z-[80]"
                  title="تكبير العرض"
                >
                  <i className="fa-solid fa-expand text-base"></i>
                </button>
             ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen(false);
                  }}
                  className="bg-white/90 backdrop-blur-md w-12 h-12 rounded-full border border-white shadow-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
                  title="إغلاق"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
             )}
          </div>
        </div>

        {/* قائمة المحطات الميدانية المدمجة - Landmarks Panel */}
        {selectedPoint.landmarks && (
          <div className={`absolute bottom-6 left-6 z-[55] transition-all duration-700 ease-out ${full ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 md:translate-y-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}>
            <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/10 shadow-2xl w-64 md:w-72 pointer-events-auto">
              <div className="px-4 py-2 border-b border-white/5 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-location-crosshairs text-primary"></i>
                <span className="text-[10px] font-black text-white/50 uppercase">المحطات الميدانية</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar-dark px-1">
                {selectedPoint.landmarks.map((landmark, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLandmark(landmark);
                      setShowAnalysis(true); // تفعيل عرض التحليل تلقائياً عند اختيار معلم
                    }}
                    className={`w-full text-right p-3 rounded-2xl transition-all border-2 flex items-center gap-3 ${
                      activeLandmark === landmark 
                      ? 'border-primary bg-primary/20 text-white' 
                      : 'border-transparent bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activeLandmark === landmark ? 'bg-primary' : 'bg-white/20'}`}></span>
                    <span className="text-[11px] font-black truncate">{landmark.name}</span>
                  </button>
                ))}
                {activeLandmark && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLandmark(null);
                    }}
                    className="w-full py-2.5 text-[10px] font-black text-red-400 bg-red-400/10 rounded-xl mt-2 hover:bg-red-400/20 transition-colors"
                  >
                    إعادة ضبط المسح
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* زر التبديل للبيانات - Analytics Toggle */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowAnalysis(!showAnalysis);
          }}
          className={`absolute bottom-8 right-8 z-[100] transition-all duration-500 ${showAnalysis ? 'bg-primary scale-110' : 'bg-accent'} text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] font-black text-xs md:text-sm flex items-center gap-3 hover:scale-105 active:scale-95 border border-white/20`}
        >
          <i className={`fa-solid ${showAnalysis ? 'fa-times' : 'fa-chart-pie'}`}></i>
          <span>{showAnalysis ? 'إغلاق المرصد' : 'فتح مرصد البيانات'}</span>
        </button>

        {/* لوحة البيانات الجانبية - Sidebar Analytics */}
        <div 
          className={`absolute top-0 right-0 h-full z-[65] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${
            showAnalysis ? 'translate-x-0' : 'translate-x-full'
          } ${full ? 'w-full md:w-[600px]' : 'w-[95%] md:w-[500px]'}`}
        >
          <div className="h-full bg-white/95 backdrop-blur-3xl shadow-[-10px_0_50px_rgba(0,0,0,0.4)] border-l-[12px] flex flex-col" style={{ borderLeftColor: selectedPoint.focusColor }}>
            <div className={`p-8 md:p-10 pb-4 ${full ? 'pt-28' : 'pt-24'}`}>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-1 bg-primary rounded-full"></div>
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Data Analysis</span>
              </div>
              <h4 className="font-black text-accent text-3xl leading-tight">
                {activeLandmark ? activeLandmark.name : 'مرصد البيانات'}
              </h4>
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 md:px-10 pb-12 space-y-6 custom-scrollbar">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-sm md:text-base font-bold text-slate-600 leading-relaxed shadow-inner italic">
                {activeLandmark ? activeLandmark.description : selectedPoint.explanation}
              </div>

              <div className="space-y-4">
                {selectedPoint.detailedImpacts?.map((impact, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group/card">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 text-xl group-hover/card:scale-110 transition-transform">
                      <i className={`fa-solid ${impact.icon}`}></i>
                    </div>
                    <div>
                      <h6 className="font-black text-accent text-sm md:text-base mb-1">{impact.title}</h6>
                      <p className="text-slate-500 text-[10px] md:text-xs font-bold leading-relaxed">{impact.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-900 rounded-[3rem] overflow-hidden border-[6px] border-white shadow-2xl group/main z-0">
        {selectedPoint ? renderMapUI(false) : (
          <div className="h-full flex items-center justify-center">
             <div className="text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10 text-3xl animate-pulse">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <p className="font-black text-white/20 text-xs tracking-widest uppercase">بانتظار تفعيل إحداثيات الموقع</p>
             </div>
          </div>
        )}
        
        {/* زر شفاف لتفعيل التكبير عند النقر على أي مكان في الخريطة المصغرة */}
        {selectedPoint && (
          <button 
            onClick={() => setIsFullScreen(true)}
            className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
            aria-label="تكبير الخريطة"
          />
        )}

        {/* تلميح عند التمرير */}
        {selectedPoint && (
          <div className="absolute inset-0 z-0 bg-primary/20 opacity-0 group-hover/main:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-full text-primary font-black text-sm shadow-2xl scale-0 group-hover/main:scale-100 transition-transform delay-100">
               انقر للتكبير وبدء التحليل <i className="fa-solid fa-maximize ml-2"></i>
            </div>
          </div>
        )}
      </div>

      {/* النافذة الداخلية المنبثقة - Full Screen Internal Window */}
      {isFullScreen && selectedPoint && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-6 no-print">
          <div 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsFullScreen(false)}
          ></div>
          
          <div className="relative w-full h-full bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col">
            {renderMapUI(true)}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

        @keyframes mapFocus {
          0% { opacity: 0; transform: scale(1.1); filter: blur(15px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-map-focus { animation: mapFocus 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  );
};

export default InteractiveMap;
