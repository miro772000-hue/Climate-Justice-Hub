import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  // أداة خرائط جوجل مدعومة فقط في سلسلة موديلات Gemini 2.5 حالياً
  private modelName = 'gemini-1.5-flash';

  constructor() {
    // دمج مفتاح خرائط جوجل إذا توفر لضمان عمل الأداة بشكل صحيح، وإلا استخدام المفتاح الافتراضي
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.ai = new GoogleGenAI({ apiKey });
  }

  async askAboutClimate(question: string, history: ChatMessage[]): Promise<{ text: string, urls?: {title: string, uri: string}[] }> {
    try {
      const systemInstruction = `
        أنت "المساعد الذكي الشامل" للمنصة التعليمية للدكتورة مروى حسين إسماعيل.
        
        دورك هو:
        1. الإجابة عن **أي سؤال** يطرحه الطالب يتعلق بموضوعات "العدالة المناخية" (البيئية، السياسية، الاجتماعية، الاقتصادية، التكنولوجية) التي يدرسها في المنصة.
        2. كن مساعداً ذكياً ودوداً، وتحدث باللغة العربية الفصحى.
        3. استخدم المعلومات الواردة في المنهج (أبعاد العدالة المناخية الستة) كأساس لإجاباتك.
        
        توجيهات المحتوى المثبت للمنهج:
        - المقدمة: مبادئ العدالة (التوزيعية، الإجرائية) والعدالة بين الأجيال.
        - البيئي: التغيرات الهيدرولوجية، منابع النيل، ذوبان الجليد.
        - السياسي: السيادة الوطنية (توفالو)، سد النهضة، دبلوماسية المناخ.
        - الاجتماعي: الفئات المهمشة (المكس)، النزوح البيئي (بنغلاديش)، الصحة (نيودلهي).
        - الاقتصادي: صندوق الخسائر والأضرار، الأمن الغذائي، الاقتصاد الأخضر.
        - التكنولوجي: الإنذار المبكر، المدن الذكية، نقل التكنولوجيا.
        
        استخدم أداة خرائط جوجل (googleMaps) **فقط** إذا كان السؤال يتطلب تحديد موقع جغرافي أو رؤية مكان معين. إذا كان السؤال نظرياً أو عاماً، أجب مباشرة دون استخدام الخريطة.
      `;

      // إنشاء مثيل جديد لضمان استخدام أحدث مفتاح API مع أولوية لمفتاح الخرائط إذا وجد
      const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY;
      const aiClient = new GoogleGenAI({ apiKey });
      
      const response = await aiClient.models.generateContent({
        model: this.modelName,
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: question }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleMaps: {} }],
          temperature: 0.7,
        }
      });

      let text = response.text || "عذراً، لم أستطع صياغة إجابة حالياً.";
      
      // إضافة العبارة الترحيبية فقط في بداية المحادثة (عندما يكون السجل فارغاً)
      if (history.length === 0) {
        const welcomePhrase = "(أهلاً بك يا طالبنا العزيز في رحاب منصة الدكتورة مروى حسين إسماعيل لتعزيز فهمك للعدالة المناخية)!\n\n";
        text = welcomePhrase + text;
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const urls: {title: string, uri: string}[] = [];
      
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.maps) {
            urls.push({ 
              title: chunk.maps.title || "عرض الموقع على الخريطة", 
              uri: chunk.maps.uri 
            });
          }
        });
      }

      return { text, urls: urls.length > 0 ? urls : undefined };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "حدث خطأ أثناء الاتصال بنظام الذكاء الاصطناعي. يرجى التأكد من اتصال الإنترنت وصلاحية مفتاح API." };
    }
  }
}

export const geminiService = new GeminiService();
