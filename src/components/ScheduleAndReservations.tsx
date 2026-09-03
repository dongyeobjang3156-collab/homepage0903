import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Phone, ShieldCheck, AlertTriangle, 
  FileText, Send, CheckCircle2, XCircle, Navigation, Eye, User, Sparkles, Filter
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../types';

interface ScheduleAndReservationsProps {
  reservations: Reservation[];
  onOpenQuestionnaire: (reservation: Reservation) => void;
  onCreateReport: (reservation: Reservation) => void;
  onTriggerNoShow: (reservationId: string) => void;
  onCompleteReservation: (reservationId: string) => void;
  onSendKakaoReminder: (reservation: Reservation) => void;
}

export const ScheduleAndReservations: React.FC<ScheduleAndReservationsProps> = ({
  reservations,
  onOpenQuestionnaire,
  onCreateReport,
  onTriggerNoShow,
  onCompleteReservation,
  onSendKakaoReminder,
}) => {
  const [filter, setFilter] = useState<'all' | 'today' | 'secured' | 'noshow' | 'done'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Persona context: today is 2026-09-03
  const todayDateStr = '2026-09-03';

  const filteredReservations = reservations.filter((res) => {
    if (filter === 'today' && res.date !== todayDateStr) return false;
    if (filter === 'secured' && res.status !== '확정(예약금완료)') return false;
    if (filter === 'noshow' && res.status !== '노쇼방어') return false;
    if (filter === 'done' && res.status !== '진행완료') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = res.customerName.toLowerCase().includes(q);
      const matchPet = res.petInfo.name.toLowerCase().includes(q);
      const matchBreed = res.petInfo.breed.toLowerCase().includes(q);
      const matchPhone = res.customerPhone.includes(q);
      return matchName || matchPet || matchBreed || matchPhone;
    }
    return true;
  });

  const todayCount = reservations.filter(r => r.date === todayDateStr && r.status === '확정(예약금완료)').length;
  const noShowDefendedTotal = reservations
    .filter(r => r.status === '노쇼방어')
    .reduce((acc, curr) => acc + curr.depositAmount, 0) + 200000; // includes past month defense
  
  return (
    <div className="space-y-6">
      
      {/* Top Stat Highlights for 1-person Pet Business */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#FEE2D5]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">오늘의 예약</span>
            <span className="p-2.5 rounded-xl bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#FF6B35]">{todayCount}</span>
            <span className="text-sm font-medium text-slate-400">건</span>
            <span className="text-xs font-bold text-[#2EC4B6] ml-auto">100% 선납 확정</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">송파구, 강남구, 서초구 동선</p>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#FEE2D5]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">보호된 노쇼 매출</span>
            <span className="p-2.5 rounded-xl bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/25">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#2EC4B6]">
              {(noShowDefendedTotal / 10000).toFixed(0)}
            </span>
            <span className="text-sm font-medium text-slate-400">만원</span>
            <span className="text-xs font-bold text-[#2EC4B6] ml-auto">방어 성공</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            월 구독료(2.9만)의 <strong className="text-[#1A1A1A] font-bold">약 9배</strong> 회수
          </p>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#FEE2D5]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">절약된 행정/CS 시간</span>
            <span className="p-2.5 rounded-xl bg-[#FF9F1C]/10 text-[#FF9F1C] border border-[#FF9F1C]/25">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#FF9F1C]">48</span>
            <span className="text-sm font-medium text-slate-400">시간</span>
            <span className="text-xs font-bold text-[#FF9F1C] ml-auto">이번 달 누적</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">DM 조율 및 수기 메모 복사 제로</p>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#FEE2D5]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">사전 문진 응답률</span>
            <span className="p-2.5 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/25">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#FF6B35]">100%</span>
            <span className="text-xs font-bold text-[#2EC4B6] ml-auto">예약 시 필수 작성</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">상담 시간 80% 단축 효과</p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-[20px] border border-[#FEE2D5] shadow-sm">
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            id="filter-today-btn"
            onClick={() => setFilter('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'today'
                ? 'bg-[#FF6B35] text-white shadow-xs'
                : 'bg-[#FFF9F5] text-slate-600 hover:text-[#FF6B35] border border-[#FEE2D5]'
            }`}
          >
            오늘 일정 ({reservations.filter(r => r.date === todayDateStr).length})
          </button>
          <button
            id="filter-all-btn"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-[#FF6B35] text-white shadow-xs'
                : 'bg-[#FFF9F5] text-slate-600 hover:text-[#FF6B35] border border-[#FEE2D5]'
            }`}
          >
            전체 예약 ({reservations.length})
          </button>
          <button
            id="filter-secured-btn"
            onClick={() => setFilter('secured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'secured'
                ? 'bg-[#2EC4B6] text-white shadow-xs'
                : 'bg-[#FFF9F5] text-slate-600 hover:text-[#2EC4B6] border border-[#FEE2D5]'
            }`}
          >
            예약금 완납 ({reservations.filter(r => r.status === '확정(예약금완료)').length})
          </button>
          <button
            id="filter-noshow-btn"
            onClick={() => setFilter('noshow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'noshow'
                ? 'bg-[#FF9F1C] text-white shadow-xs'
                : 'bg-[#FFF9F5] text-slate-600 hover:text-[#FF9F1C] border border-[#FEE2D5]'
            }`}
          >
            노쇼 방어 건 ({reservations.filter(r => r.status === '노쇼방어').length})
          </button>
          <button
            id="filter-done-btn"
            onClick={() => setFilter('done')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filter === 'done'
                ? 'bg-[#FF6B35] text-white shadow-xs'
                : 'bg-[#FFF9F5] text-slate-600 hover:text-[#FF6B35] border border-[#FEE2D5]'
            }`}
          >
            진행 완료 ({reservations.filter(r => r.status === '진행완료').length})
          </button>
        </div>

        <div className="relative">
          <input
            id="reservation-search-input"
            type="text"
            placeholder="고객명, 반려견, 견종 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-60 text-xs px-3.5 py-2 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:bg-white focus:outline-[#FF6B35] transition-colors"
          />
        </div>

      </div>

      {/* Reservation List Cards */}
      <div className="space-y-3.5">
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center border border-[#FEE2D5]">
            <Calendar className="w-10 h-10 text-[#FF9F1C] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-[#1A1A1A]">해당 조건의 예약 내역이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">상단에서 '고객 예약 체험'을 통해 새 예약을 생성해보세요.</p>
          </div>
        ) : (
          filteredReservations.map((res) => {
            const isBiteWarning = res.petInfo.medicalSafety.biteHistory.includes('심함') || res.petInfo.medicalSafety.biteHistory.includes('물림');
            const isCautionBite = res.petInfo.medicalSafety.biteHistory.includes('경미');

            return (
              <div
                key={res.id}
                id={`reservation-card-${res.id}`}
                className={`bg-white rounded-[24px] border p-4 sm:p-5 shadow-sm transition-all hover:border-[#FF6B35]/50 ${
                  res.status === '노쇼방어'
                    ? 'border-[#FF9F1C] bg-[#FFF9F5]'
                    : res.status === '진행완료'
                    ? 'border-[#FEE2D5] bg-white opacity-95'
                    : 'border-[#FEE2D5]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  {/* Left Column: Time & Customer Info */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      
                      {/* Date & Time Badge */}
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#1A202C] text-white">
                        <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                        {res.date === todayDateStr ? '오늘' : res.date} {res.time}
                      </span>

                      {/* Status Badge */}
                      {res.status === '확정(예약금완료)' && (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#2EC4B6] text-white uppercase shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          결제완료 (30,000원 보증)
                        </span>
                      )}

                      {res.status === '노쇼방어' && (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#FF9F1C] text-white uppercase shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          노쇼방어 ➝ 30,000원 귀속
                        </span>
                      )}

                      {res.status === '진행완료' && (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#FF6B35] text-white uppercase shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          진행완료 {res.hasReportSent && '· 알림장 발송됨'}
                        </span>
                      )}

                      {/* Payment method */}
                      <span className="text-[11px] text-slate-400 font-medium">
                        결제: {res.paymentMethod} (잔금 {(res.totalAmount - res.depositAmount).toLocaleString()}원 현장)
                      </span>
                    </div>

                    {/* Customer & Pet Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <div className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{res.customerName} 보호자님</span>
                        <span className="text-xs text-slate-400 font-normal">({res.customerPhone})</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FEE2D5] hidden sm:inline-block"></span>
                        <span className="text-[#FF6B35] font-black">🐶 {res.petInfo.name}</span>
                        <span className="text-xs text-slate-500">
                          ({res.petInfo.breed}, {res.petInfo.age}, {res.petInfo.weight}, {res.petInfo.gender})
                        </span>
                      </div>
                    </div>

                    {/* Address for visiting trainer */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{res.address}</span>
                      <a
                        href={`https://map.kakao.com/link/search/${encodeURIComponent(res.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF6B35] hover:underline flex items-center gap-0.5 ml-1 font-bold"
                      >
                        <Navigation className="w-3 h-3" />
                        길안내
                      </a>
                    </div>

                    {/* Safety Warnings based on Custom Questionnaire */}
                    <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                      {isBiteWarning ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          ⚠️ 입질 주의: {res.petInfo.medicalSafety.biteHistory}
                        </span>
                      ) : isCautionBite ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF9F5] text-[#FF9F1C] border border-[#FEE2D5]">
                          경계성 으르렁 이력 있음
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">입질 이력 없음</span>
                      )}

                      <span className="text-xs text-slate-400">
                        짖음도 {res.petInfo.medicalSafety.barkLevel}/5 · 분리불안 {res.petInfo.medicalSafety.separationAnxiety}/5
                      </span>
                    </div>

                    {/* Problem teaser (replaces manual notes copy/paste!) */}
                    <div className="bg-[#FFF9F5] rounded-xl p-3 text-xs text-slate-700 border border-[#FEE2D5] line-clamp-1 max-w-2xl">
                      <strong className="text-[#1A1A1A] font-bold">문제 행동 요약:</strong> {res.petInfo.problemDetails}
                    </div>

                    {res.notes && (
                      <p className="text-xs text-[#FF6B35] font-semibold bg-[#FFF9F5] p-2.5 rounded-xl border border-[#FEE2D5]">
                        📌 {res.notes}
                      </p>
                    )}

                  </div>

                  {/* Right Column: Actions (Custom Form, Report, No-Show management) */}
                  <div className="flex flex-wrap lg:flex-col items-stretch sm:items-center lg:items-end justify-start gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#FEE2D5]/50">
                    
                    {/* View Custom Questionnaire Form Modal */}
                    <button
                      id={`view-form-btn-${res.id}`}
                      onClick={() => onOpenQuestionnaire(res)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] bg-[#FFF9F5] hover:bg-[#FEE2D5] border border-[#FEE2D5] transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>사전 문진표 열람</span>
                    </button>

                    {/* Action depending on status */}
                    {res.status === '확정(예약금완료)' && (
                      <>
                        <button
                          id={`complete-visit-btn-${res.id}`}
                          onClick={() => {
                            onCompleteReservation(res.id);
                            onCreateReport(res);
                          }}
                          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e85a2a] shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>방문완료 &amp; 알림장 쓰기</span>
                        </button>

                        <button
                          id={`noshow-trigger-btn-${res.id}`}
                          onClick={() => onTriggerNoShow(res.id)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                          title="고객 미출현 시 예약금을 위약금으로 귀속하고 노쇼 방어 처리합니다"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>노쇼 발생 처리</span>
                        </button>
                      </>
                    )}

                    {res.status === '진행완료' && (
                      <button
                        id={`open-report-again-btn-${res.id}`}
                        onClick={() => onCreateReport(res)}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#2EC4B6] bg-[#2EC4B6]/10 hover:bg-[#2EC4B6]/20 border border-[#2EC4B6]/30 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-[#2EC4B6]" />
                        <span>디지털 알림장 {res.hasReportSent ? '확인/수정' : '작성하기'}</span>
                      </button>
                    )}

                    {/* Kakao reminder resend */}
                    <button
                      id={`resend-kakao-btn-${res.id}`}
                      onClick={() => onSendKakaoReminder(res)}
                      className="text-[11px] text-slate-400 hover:text-[#FF6B35] flex items-center gap-1 font-medium transition-colors"
                    >
                      <Send className="w-3 h-3 text-[#FF9F1C]" />
                      <span>카카오 예약안내톡 미리보기</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
