export type ServiceCategory = '훈련' | '미용' | '시팅';

export interface ExpertProfile {
  id: string;
  name: string;
  age: number;
  jobTitle: string;
  category: ServiceCategory;
  shopName: string;
  tagline: string;
  bio: string;
  instagramHandle: string;
  serviceArea: string;
  serviceFee: number;
  depositFee: number;
  durationMinutes: number;
  bufferMinutes: number;
  plan: 'free' | 'pro';
  monthlyBookingsCount: number;
  maxFreeBookings: number;
}

export type BiteRisk = '없음' | '경미(낯선 사람 경계)' | '심함(보호자/미용사 물림 이력)';
export type ScaleLevel = 1 | 2 | 3 | 4 | 5;

export interface PetMedicalAndSafety {
  biteHistory: BiteRisk;
  barkLevel: ScaleLevel;
  separationAnxiety: ScaleLevel;
  healthIssues: string;
  isVaccinated: boolean;
  isNeutered: boolean;
}

export interface PetInfo {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: '남아' | '여아';
  medicalSafety: PetMedicalAndSafety;
  problemDetails: string;
  customerRequests: string;
}

export interface CustomFormField {
  id: string;
  label: string;
  description: string;
  type: 'text' | 'radio' | 'checkbox' | 'scale';
  options?: string[];
  required: boolean;
  category: '기본정보' | '안전/입질문진' | '행동/증상';
}

export type ReservationStatus = 
  | '확정(예약금완료)'
  | '진행완료'
  | '노쇼방어'
  | '취소/환불';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  petInfo: PetInfo;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: ReservationStatus;
  depositAmount: number;
  totalAmount: number;
  paymentMethod: '카카오페이' | '토스페이' | '신용카드';
  isDepositSecured: boolean;
  createdAt: string;
  hasReportSent?: boolean;
  notes?: string;
}

export interface ReportItem {
  id: string;
  category: string;
  evaluation: '우수' | '개선중' | '주의필요';
  comment: string;
}

export interface DigitalReport {
  id: string;
  reservationId: string;
  petName: string;
  customerName: string;
  customerPhone: string;
  trainerName: string;
  date: string;
  photos: string[];
  trainingSummary: string;
  items: ReportItem[];
  homeworkGuide: string;
  nextCareRecommendDate: string; // e.g. 3 weeks or 2 months later
  sentViaKakao: boolean;
  sentAt?: string;
}

export interface RetentionReminder {
  id: string;
  reservationId: string;
  customerName: string;
  customerPhone: string;
  petName: string;
  petBreed: string;
  lastServiceDate: string;
  recommendedDate: string;
  cycleDays: number;
  purpose: '2차 심화 세션 권장' | '정기 위생/미용 케어' | '분리불안 사후점검';
  status: '발송대기' | '발송완료' | '재예약성공';
  discountCoupon?: string;
}
