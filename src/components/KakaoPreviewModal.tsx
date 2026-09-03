import React from 'react';
import { MessageSquare, X, ExternalLink, Calendar, CheckCircle2, ChevronRight, Share2, Copy } from 'lucide-react';
import { DigitalReport, RetentionReminder, Reservation } from '../types';

interface KakaoPreviewModalProps {
  type: 'report' | 'reminder' | 'booking';
  reportData?: DigitalReport | null;
  reminderData?: RetentionReminder | null;
  reservationData?: Reservation | null;
  onClose: () => void;
}

export const KakaoPreviewModal: React.FC<KakaoPreviewModalProps> = ({
  type,
  reportData,
  reminderData,
  reservationData,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A202C]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFF9F5] w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-[#FEE2D5] flex flex-col max-h-[90vh]">
        
        {/* Kakao Header */}
        <div className="bg-[#FF6B35] px-4 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-[#FF6B35] flex items-center justify-center font-black text-xs shadow-xs">
              💬
            </div>
            <div>
              <h4 className="text-xs font-black leading-none text-white">펫프론트 알림톡</h4>
              <span className="text-[10px] text-white/80">공식 비즈니스 인증 채널</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Kakao Chat Body */}
        <div className="p-4 overflow-y-auto space-y-3 font-sans">
          
          <div className="text-center">
            <span className="bg-[#FEE2D5] text-[#1A1A1A] text-[10px] px-3 py-1 rounded-full font-bold">
              2026년 9월 3일 목요일
            </span>
          </div>

          {/* Kakao Message Bubble (AlimTalk Card) */}
          <div className="bg-white rounded-[24px] p-4.5 shadow-sm border border-[#FEE2D5] space-y-3">
            
            {/* Header Tag */}
            <div className="flex items-center justify-between border-b border-[#FEE2D5] pb-2">
              <span className="text-[11px] font-black text-[#FF6B35] bg-[#FFF9F5] px-2.5 py-0.5 rounded-full border border-[#FEE2D5]">
                {type === 'report' ? '🐾 훈련/시술 디지털 알림장' : type === 'reminder' ? '💌 정기 케어 재방문 리마인드' : '✅ 예약 및 예약금 확정 안내'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">오후 2:30</span>
            </div>

            {/* CONTENT: 1) Report (알림장) */}
            {type === 'report' && reportData && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1A1A]">
                    [{reportData.trainerName}] {reportData.petName}의 알림장이 도착했습니다!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {reportData.customerName} 보호자님, 오늘 {reportData.petName}와 함께한 맞춤 훈련 리포트입니다.
                  </p>
                </div>

                {reportData.photos[0] && (
                  <div className="rounded-2xl overflow-hidden h-36 bg-[#FFF9F5] border border-[#FEE2D5]">
                    <img
                      src={reportData.photos[0]}
                      alt="pet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#FEE2D5] space-y-1.5 text-xs">
                  <div className="font-bold text-[#1A1A1A]">📝 오늘 실습 총평</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {reportData.trainingSummary}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#1A1A1A]">📌 항목별 성취도</div>
                  {reportData.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs py-1 border-b border-[#FEE2D5]">
                      <span className="text-slate-600">{it.category}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        it.evaluation === '우수' ? 'bg-[#2EC4B6]/15 text-[#2EC4B6]' : 'bg-[#FF9F1C]/15 text-[#FF9F1C]'
                      }`}>
                        {it.evaluation}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#FF9F1C]/40 text-xs">
                  <span className="font-bold text-[#FF9F1C] block mb-0.5">🏡 보호자 홈트레이닝 숙제</span>
                  <p className="text-[11px] text-slate-700 whitespace-pre-line">
                    {reportData.homeworkGuide}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>권장 2차 재방문 일자</span>
                  <strong className="text-[#FF6B35] font-black">{reportData.nextCareRecommendDate}</strong>
                </div>
              </div>
            )}

            {/* CONTENT: 2) Retention Reminder */}
            {type === 'reminder' && reminderData && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1A1A]">
                    {reminderData.petName}의 {reminderData.purpose} 주기 안내
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {reminderData.customerName} 보호자님, 지난 세션 후 {reminderData.cycleDays}일이 경과했습니다. 행동 강화 및 안전 점검을 위해 2차 세션을 추천드립니다.
                  </p>
                </div>

                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#FEE2D5] text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>마지막 방문 훈련</span>
                    <strong className="text-[#1A1A1A]">{reminderData.lastServiceDate}</strong>
                  </div>
                  <div className="flex justify-between text-[#FF6B35] font-bold">
                    <span>권장 방문 시기</span>
                    <strong className="text-[#FF6B35] font-black">{reminderData.recommendedDate}</strong>
                  </div>
                  {reminderData.discountCoupon && (
                    <div className="pt-1.5 border-t border-[#FEE2D5] text-[#2EC4B6] font-bold text-[11px]">
                      🎁 재방문 전용 혜택: {reminderData.discountCoupon}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  * 1인 전문가 특성상 주말 슬롯은 조기 마감되오니 미리 일정을 선점하세요.
                </p>
              </div>
            )}

            {/* CONTENT: 3) Booking Confirmation */}
            {type === 'booking' && reservationData && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-black text-[#1A1A1A]">
                    방문 훈련 예약이 확정되었습니다!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {reservationData.customerName}님, 예약금({reservationData.depositAmount.toLocaleString()}원) 결제가 정상 완료되어 일정이 캘린더에 고정되었습니다.
                  </p>
                </div>

                <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#FEE2D5] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">일시</span>
                    <strong className="text-[#1A1A1A]">{reservationData.date} {reservationData.time}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">훈련견</span>
                    <strong className="text-[#FF6B35] font-black">🐶 {reservationData.petInfo.name} ({reservationData.petInfo.breed})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">방문 주소</span>
                    <strong className="text-[#1A1A1A] truncate max-w-[180px]">{reservationData.address}</strong>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#FEE2D5]">
                    <span className="text-slate-500">결제된 예약금</span>
                    <strong className="text-[#FF6B35] font-black">{reservationData.depositAmount.toLocaleString()}원</strong>
                  </div>
                </div>

                <div className="bg-[#FFF9F5] p-2.5 rounded-xl border border-[#FF9F1C]/40 text-[11px] text-[#1A1A1A] space-y-0.5">
                  <span className="font-black text-[#FF6B35] block">⚠️ 노쇼 방지 규정 안내</span>
                  <span className="text-slate-600">1인 전문가 이동 일정 특성상 24시간 전 취소 시 50%, 당일 취소 시 예약금은 반환되지 않습니다.</span>
                </div>
              </div>
            )}

            {/* Bottom Button inside Kakao Message */}
            <div className="pt-2 border-t border-[#FEE2D5]">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-[#FEE500] hover:bg-[#ebd300] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>{type === 'report' ? '알림장 전체 리포트 상세 보기' : type === 'reminder' ? '빈 시간 확인하고 바로 재예약하기' : '예약 상세 및 길안내 확인'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          <div className="text-center text-[10px] text-slate-500">
            {copied ? '✅ 링크가 클립보드에 복사되었습니다!' : '카카오톡 알림톡 연동 시뮬레이션'}
          </div>

        </div>

      </div>
    </div>
  );
};
