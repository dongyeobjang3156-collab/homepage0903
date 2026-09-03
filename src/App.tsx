import React, { useState } from 'react';
import { 
  Calendar, FileText, Send, BellRing, ShieldCheck, Sparkles, 
  Smartphone, Plus, ArrowRight, CheckCircle2, User, ChevronRight,
  TrendingUp, Award, DollarSign, Clock, HelpCircle, Instagram
} from 'lucide-react';
import { 
  ExpertProfile, CustomFormField, Reservation, DigitalReport, 
  RetentionReminder, ServiceCategory 
} from './types';
import { 
  initialExpert, defaultFormFields, initialReservations, 
  initialReports, initialRetentionReminders 
} from './data/initialData';
import { Header } from './components/Header';
import { InstagramLinkBanner } from './components/InstagramLinkBanner';
import { ScheduleAndReservations } from './components/ScheduleAndReservations';
import { CustomFormBuilder } from './components/CustomFormBuilder';
import { DigitalReportManager } from './components/DigitalReportManager';
import { RetentionManager } from './components/RetentionManager';
import { CustomerBookingFlow } from './components/CustomerBookingFlow';
import { KakaoPreviewModal } from './components/KakaoPreviewModal';
import { PlanAndRoiModal } from './components/PlanAndRoiModal';

export default function App() {
  // Mode state: 'expert' (CRM Dashboard) or 'customer' (Instagram Profile Booking Flow)
  const [currentMode, setCurrentMode] = useState<'expert' | 'customer'>('expert');

  // Core Data States
  const [expert, setExpert] = useState<ExpertProfile>(initialExpert);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [formFields, setFormFields] = useState<CustomFormField[]>(defaultFormFields);
  const [reports, setReports] = useState<DigitalReport[]>(initialReports);
  const [reminders, setReminders] = useState<RetentionReminder[]>(initialRetentionReminders);

  // Active CRM Tab
  const [activeTab, setActiveTab] = useState<'schedule' | 'forms' | 'reports' | 'retention'>('schedule');

  // Modal states
  const [selectedResForForm, setSelectedResForForm] = useState<Reservation | null>(null);
  const [activeResForReport, setActiveResForReport] = useState<Reservation | null>(null);
  const [kakaoModal, setKakaoModal] = useState<{
    isOpen: boolean;
    type: 'report' | 'reminder' | 'booking';
    reportData?: DigitalReport | null;
    reminderData?: RetentionReminder | null;
    reservationData?: Reservation | null;
  }>({
    isOpen: false,
    type: 'booking',
  });
  const [isPlanRoiModalOpen, setIsPlanRoiModalOpen] = useState(false);
  const [planRoiTab, setPlanRoiTab] = useState<'roi' | 'plan' | 'growth'>('roi');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleAddNewBooking = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
    setExpert(prev => ({
      ...prev,
      monthlyBookingsCount: prev.monthlyBookingsCount + 1,
    }));
    showToast(`🎉 새 예약 접수! [${newRes.petInfo.name}] 예약금 30,000원 입금 확인되어 캘린더에 확정되었습니다.`);
  };

  const handleAddField = (field: CustomFormField) => {
    setFormFields(prev => [...prev, field]);
    showToast('새 사전 문진 항목이 추가되었습니다.');
  };

  const handleDeleteField = (fieldId: string) => {
    setFormFields(prev => prev.filter(f => f.id !== fieldId));
    showToast('문진 항목이 삭제되었습니다.');
  };

  const handleSaveReport = (report: DigitalReport) => {
    setReports(prev => [report, ...prev]);
    // update reservation status
    setReservations(prev =>
      prev.map(r => r.id === report.reservationId ? { ...r, hasReportSent: true, status: '진행완료' } : r)
    );
    // add to retention reminder pool (recommended in 3 weeks)
    const newRetention: RetentionReminder = {
      id: `ret_${Date.now()}`,
      reservationId: report.reservationId,
      customerName: report.customerName,
      customerPhone: report.customerPhone,
      petName: report.petName,
      petBreed: '훈련견',
      lastServiceDate: report.date,
      recommendedDate: report.nextCareRecommendDate,
      cycleDays: 21,
      purpose: '2차 심화 세션 권장',
      status: '발송대기',
    };
    setReminders(prev => [newRetention, ...prev]);

    showToast(`🐾 ${report.petName}의 디지털 알림장이 카카오톡으로 발송되었습니다!`);
  };

  const handleTriggerNoShow = (reservationId: string) => {
    setReservations(prev =>
      prev.map(r =>
        r.id === reservationId
          ? {
              ...r,
              status: '노쇼방어',
              notes: '당일 불출현 발생 ➝ 예약금 30,000원 위약금 전액 귀속 처리로 빈 시간 매출 방어 완료!',
            }
          : r
      )
    );
    showToast('🛡️ 노쇼 방어 처리: 예약금 30,000원이 정상 귀속 처리되었습니다.');
  };

  const handleCompleteReservation = (reservationId: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: '진행완료' } : r))
    );
  };

  const handleTriggerRetentionReminder = (reminderId: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === reminderId ? { ...r, status: '발송완료' } : r))
    );
    showToast('카카오톡 재예약 리마인드 알림톡이 전송되었습니다.');
  };

  const handleUpgradeToPro = () => {
    setExpert(prev => ({
      ...prev,
      plan: 'pro',
      maxFreeBookings: 9999,
    }));
    setIsPlanRoiModalOpen(false);
    showToast('🎉 Pro 플랜으로 업그레이드되었습니다! 무제한 예약과 커스텀 브랜딩이 적용됩니다.');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      
      {/* Global Header */}
      <Header
        currentMode={currentMode}
        onChangeMode={setCurrentMode}
        expert={expert}
        onOpenRoiModal={() => {
          setPlanRoiTab('roi');
          setIsPlanRoiModalOpen(true);
        }}
        onOpenPlanModal={() => {
          setPlanRoiTab('plan');
          setIsPlanRoiModalOpen(true);
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A202C] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-[#2EC4B6]/50 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#2EC4B6] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: Customer Mode (Instagram Booking Simulation) */}
        {currentMode === 'customer' ? (
          <div className="py-2">
            <div className="text-center max-w-md mx-auto mb-4 bg-white border border-[#FEE2D5] p-3 rounded-[20px] shadow-sm">
              <span className="text-xs font-bold text-[#FF6B35] flex items-center justify-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" />
                <span>견주 시점: 인스타그램 프로필 링크 클릭 시 화면</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                여기서 예약을 완료하면 이민수 훈련사의 관리자 대시보드에 실시간 자동 등록됩니다.
              </p>
            </div>

            <CustomerBookingFlow
              expert={expert}
              fields={formFields}
              existingReservations={reservations}
              onCompleteBooking={handleAddNewBooking}
              onBackToDashboard={() => setCurrentMode('expert')}
            />
          </div>
        ) : (
          /* VIEW 2: Expert CRM Dashboard (이민수 훈련사) */
          <div className="space-y-6">
            
            {/* Instagram Profile Link Banner with DM Auto-Reply guide */}
            <InstagramLinkBanner
              expert={expert}
              onPreviewCustomerBooking={() => setCurrentMode('customer')}
            />

            {/* Persona Quick Status Bar */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#FEE2D5] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[16px] bg-[#1A202C] text-[#FF6B35] flex items-center justify-center font-black text-sm shadow-sm">
                  32세
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-sm font-black text-[#1A1A1A]">{expert.name} 훈련사</strong>
                    <span className="text-[11px] font-bold text-[#FF6B35] bg-[#FFF9F5] px-2.5 py-0.5 rounded-full border border-[#FEE2D5]">
                      방문 행동교정 전문
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-mono text-xs">{expert.instagramHandle}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    "운전 및 훈련 중 인스타 DM 예약 문의를 자동으로 접수하고 노쇼를 완벽 차단 중"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    setPlanRoiTab('growth');
                    setIsPlanRoiModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#FF6B35] bg-[#FFF9F5] hover:bg-[#FEE2D5]/60 border border-[#FEE2D5] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-[#FF9F1C]" />
                  <span>초기 고객 100명 전략</span>
                </button>
              </div>
            </div>

            {/* Feature Sub-Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-[#FEE2D5]/40 p-1.5 rounded-[20px] border border-[#FEE2D5] overflow-x-auto">
              <button
                id="tab-schedule-btn"
                onClick={() => {
                  setActiveTab('schedule');
                  setSelectedResForForm(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#FF6B35] hover:bg-white/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>[1순위] 스케줄 &amp; 노쇼 예약금 관리</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'schedule' ? 'bg-white/25 text-white' : 'bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5]'
                }`}>
                  {reservations.filter(r => r.date === '2026-09-03').length}건
                </span>
              </button>

              <button
                id="tab-forms-btn"
                onClick={() => setActiveTab('forms')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'forms'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#FF6B35] hover:bg-white/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>[2순위] 펫 맞춤 사전 문진 폼</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'forms' ? 'bg-white/25 text-white' : 'bg-[#FFF9F5] text-[#FF9F1C] border border-[#FEE2D5]'
                }`}>
                  {formFields.length}문항
                </span>
              </button>

              <button
                id="tab-reports-btn"
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#FF6B35] hover:bg-white/60'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>[3순위] 디지털 알림장 발송</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'reports' ? 'bg-white/25 text-white' : 'bg-[#FFF9F5] text-[#2EC4B6] border border-[#FEE2D5]'
                }`}>
                  {reports.length}건
                </span>
              </button>

              <button
                id="tab-retention-btn"
                onClick={() => setActiveTab('retention')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'retention'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#FF6B35] hover:bg-white/60'
                }`}
              >
                <BellRing className="w-4 h-4" />
                <span>2~3개월 재예약 리텐션</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'retention' ? 'bg-white/25 text-white' : 'bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5]'
                }`}>
                  {reminders.filter(r => r.status === '발송대기').length}명 대기
                </span>
              </button>
            </div>

            {/* TAB CONTENT: 1) Schedule & Reservations */}
            {activeTab === 'schedule' && (
              <ScheduleAndReservations
                reservations={reservations}
                onOpenQuestionnaire={(res) => {
                  setSelectedResForForm(res);
                  setActiveTab('forms');
                }}
                onCreateReport={(res) => {
                  setActiveResForReport(res);
                  setActiveTab('reports');
                }}
                onTriggerNoShow={handleTriggerNoShow}
                onCompleteReservation={handleCompleteReservation}
                onSendKakaoReminder={(res) => {
                  setKakaoModal({
                    isOpen: true,
                    type: 'booking',
                    reservationData: res,
                  });
                }}
              />
            )}

            {/* TAB CONTENT: 2) Custom Questionnaire Form */}
            {activeTab === 'forms' && (
              <CustomFormBuilder
                fields={formFields}
                onAddField={handleAddField}
                onDeleteField={handleDeleteField}
                selectedReservationForForm={selectedResForForm}
                onCloseDetailedView={() => setSelectedResForForm(null)}
                onPreviewCustomerBooking={() => setCurrentMode('customer')}
              />
            )}

            {/* TAB CONTENT: 3) Digital Reports */}
            {activeTab === 'reports' && (
              <DigitalReportManager
                reports={reports}
                reservations={reservations}
                onSaveReport={handleSaveReport}
                onOpenKakaoPreview={(rep) => {
                  setKakaoModal({
                    isOpen: true,
                    type: 'report',
                    reportData: rep,
                  });
                }}
                activeReservationForReport={activeResForReport}
                onClearActiveReservation={() => setActiveResForReport(null)}
              />
            )}

            {/* TAB CONTENT: 4) Retention & Re-booking Reminders */}
            {activeTab === 'retention' && (
              <RetentionManager
                reminders={reminders}
                onTriggerReminder={handleTriggerRetentionReminder}
                onPreviewKakaoReminder={(rem) => {
                  setKakaoModal({
                    isOpen: true,
                    type: 'reminder',
                    reminderData: rem,
                  });
                }}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#FEE2D5] mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A1A]">🐾 펫프론트 (PetFront)</span>
            <span>· 1인 펫 전문가(미용/훈련/시팅) 전용 예약 &amp; CRM 솔루션</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>페르소나: 이민수 (32세, 1인 방문 펫 훈련사)</span>
            <span>·</span>
            <span className="font-semibold text-[#FF6B35]">Freemium (월 20건 무료) &amp; Pro (월 29,000원)</span>
          </div>
        </div>
      </footer>

      {/* KakaoTalk AlimTalk Simulation Modal */}
      {kakaoModal.isOpen && (
        <KakaoPreviewModal
          type={kakaoModal.type}
          reportData={kakaoModal.reportData}
          reminderData={kakaoModal.reminderData}
          reservationData={kakaoModal.reservationData}
          onClose={() => setKakaoModal({ isOpen: false, type: 'booking' })}
        />
      )}

      {/* Plan and ROI Modal */}
      <PlanAndRoiModal
        expert={expert}
        isOpen={isPlanRoiModalOpen}
        initialTab={planRoiTab}
        onClose={() => setIsPlanRoiModalOpen(false)}
        onUpgradeToPro={handleUpgradeToPro}
      />

    </div>
  );
}
