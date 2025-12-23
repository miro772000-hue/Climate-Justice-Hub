
export interface RegionalImpact {
  title: string;
  description: string;
  icon: string;
}

export interface MapLandmark {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface MapPoint {
  regionName: string;
  lat: number;
  lng: number;
  zoom?: number;
  explanation: string;
  focusColor: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  type: 'river' | 'region' | 'arctic';
  detailedImpacts?: RegionalImpact[];
  landmarks?: MapLandmark[];
}

export interface Point {
  text: string;
  definition?: string;
  causes?: string[];
  impacts?: string[];
  specificExamples?: string;
  mapInfo?: MapPoint;
}

export interface Activity {
  title: string;
  task: string;
  icon: string;
}

export interface InteractiveActivities {
  individual: Activity;
  group: Activity;
}

export interface Source {
  name: string;
  url: string;
}

export interface SectionData {
  id: string;
  type: string;
  title: string;
  intro: string;
  points: Point[];
  interactiveActivities?: InteractiveActivities;
  sources?: Source[];
  isMapSection?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  groundingUrls?: { title: string; uri: string }[];
}
