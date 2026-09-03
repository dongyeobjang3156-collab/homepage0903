import React, { useState } from 'react';
import { 
  Send, Image, CheckCircle2, AlertCircle, Sparkles, Plus, Share2, 
  ExternalLink, MessageSquare, Calendar, ChevronRight 
} from 'lucide-react';
import { DigitalReport, Reservation, ReportItem } from '../types';

interface DigitalReportManagerProps {
  reports: DigitalReport[];
  reservations: Reservation[];
  onSaveReport: (report: DigitalReport) => void;
  onOpenKakaoPreview: (report: DigitalReport) => void;
  activeReservationForReport?: Reservation | null;
  onClearActiveReservation?: () => void;
}

export const DigitalReportManager: React.FC<DigitalReportManagerProps> = ({
  reports,
  reservations,
  onSaveReport,
  onOpenKakaoPreview,
  activeReservationForReport,
  onClearActiveReservation,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(!!activeReservationForReport);
  const [selectedResId, setSelectedResId] = useState<string>(
    activeReservationForReport ? activeReservationForReport.id : reservations[0]?.id || ''
  );

  // Form states
  const [summaryText, setSummaryText] = useState(
    '오늘 훈련에서는 낯선 외부 자극에 대한 둔감화 및 켄넬 하우스 자발적 입실 루틴을 집중적으로 실습했습니다. 보호자님의 차분한 리더십 반응 덕분에 매우 빠른 진전을 보였습니다!'
  );
  const [homeworkText, setHomeworkText] = useState(
    '1. 하루 2회(각 5분씩) 초인종 소리 둔감화 실습\n2. 외출 전후 15분간 차분한 무반응 유지하기\n3. 하우스 안에서만 가장 좋아하는 특식(동결건조 간식) 급여'
  );
  const [nextDate, setNextDate] = useState('2026-09-24');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
  ];

  const [items, setItems] = useState<ReportItem[]>([
    {
      id: 'it_1',
      category: '켄넬 하우스 교육',
      evaluation: '우수',
      comment: '스스로 하우스에 들어가 편안히 쉬는 빈도가 크게 향상되었습니다.',
    },
    {
      id: 'it_2',
      category: '발 만지기/스킨십 둔감화',
      evaluation: '개선중',
      comment: '앞발 터치 시 으르렁거림이 줄었으나, 발톱깎이 시각 노출 시 보상 단계가 더 필요합니다.',
    },
    {
      id: 'it_3',
      category: '줄 당김 없는 힐워크 산책',
      evaluation: '우수',
      comment: '방향 전환 시 보호자 눈맞춤(아이컨택) 반응 속도가 2초 이내로 빨라졌습니다.',
    },
  ]);

  const targetReservation = reservations.find(r => r.id === selectedResId) || activeReservationForReport || reservations[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReservation) return;

    const newReport: DigitalReport = {
      id: `rep_${Date.now()}`,
      reservationId: targetReservation.id,
      petName: targetReservation.petInfo.name,
      customerName: targetReservation.customerName,
      customerPhone: targetReservation.customerPhone,
      trainerName: '이민수 훈련사',
      date: targetReservation.date,
      photos: [samplePhotos[selectedPhotoIndex]],
      trainingSummary: summaryText,
      items: items,
      homeworkGuide: homeworkText,
      nextCareRecommendDate: nextDate,
      sentViaKakao: true,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onSaveReport(newReport);
    setShowCreateModal(false);
    if (onClearActiveReservation) onClearActiveReservation();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-[24px] border border-[#FEE2D5] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFF9F5] text-[#2EC4B6] border border-[#2EC4B6]/30">
              핵심 기능 [3순위]
            </span>
            <h2 className="text-lg font-black text-[#1A1A1A]">
              시술/훈련 후 '알림장' 원클릭 발송 &amp; 리텐션 관리
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            훈련/미용 종료 후 사진과 코멘트가 담긴 깔끔한 디지털 리포트를 <strong className="text-[#1A1A1A]">카카오톡 알림톡으로 1분 만에 발송</strong>하고, 2~3주 뒤 재예약 주기를 자동 등록합니다.
          </p>
        </div>

        <button
          id="open-create-report-modal-btn"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>새 디지털 알림장 작성</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep) => (
          <div
            key={rep.id}
            id={`digital-report-card-${rep.id}`}
            className="bg-white rounded-[28px] border border-[#FEE2D5] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Header Image & Badge */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={rep.photos[0]}
                  alt={rep.petName}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-white/95 backdrop-blur-md text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                    🐶 {rep.petName}의 훈련 알림장
                  </span>
                  <span className="bg-[#2EC4B6] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xl flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    알림톡 발송완료
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-xs text-slate-300">보호자 {rep.customerName}님 · {rep.date}</p>
                  <p className="text-sm font-bold text-white">{rep.trainerName}</p>
                </div>
              </div>

              {/* Body summary */}
              <div className="p-5 space-y-3.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">훈련 총평</h4>
                  <p className="text-xs text-[#1A1A1A] line-clamp-2 mt-1 leading-relaxed">
                    {rep.trainingSummary}
                  </p>
                </div>

                {/* Progress items */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">항목별 평가</h4>
                  {rep.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5]">
                      <span className="font-bold text-[#1A1A1A]">{item.category}</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                        item.evaluation === '우수' ? 'bg-[#2EC4B6]/15 text-[#2EC4B6]' : 'bg-[#FF9F1C]/15 text-[#FF9F1C]'
                      }`}>
                        {item.evaluation}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Next session reminder */}
                <div className="bg-[#FFF9F5] p-3 rounded-xl border border-[#FEE2D5] text-xs text-[#1A1A1A] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
                    권장 2차 재방문 주기
                  </span>
                  <strong className="font-black text-[#FF6B35]">{rep.nextCareRecommendDate}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#FFF9F5] border-t border-[#FEE2D5] flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                발송 시각: {rep.sentAt || '방금 전'}
              </span>
              <button
                id={`preview-kakao-report-${rep.id}`}
                onClick={() => onOpenKakaoPreview(rep)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#1A1A1A] font-black text-xs transition-colors shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                <span>카카오 알림톡 보기</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Write Digital Report */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#1A202C]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#FEE2D5] animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#FEE2D5] mb-4">
              <div>
                <h3 className="text-base font-black text-[#1A1A1A]">
                  훈련/시술 디지털 알림장 작성
                </h3>
                <p className="text-xs text-slate-500">
                  오늘 훈련 결과를 작성하면 즉시 고객 스마트폰에 카카오 알림톡으로 전송됩니다.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-[#1A1A1A] text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Select target customer */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  대상 고객 및 반려견 선택
                </label>
                <select
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:outline-[#FF6B35]"
                >
                  {reservations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.date} ({r.time}) - {r.customerName}님 (🐶 {r.petInfo.name} - {r.petInfo.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo selection */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  훈련 현장 사진 첨부 (원클릭 선택)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {samplePhotos.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedPhotoIndex === idx ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={url} alt="dog" className="w-full h-full object-cover" />
                      {selectedPhotoIndex === idx && (
                        <div className="absolute top-1 right-1 bg-[#FF6B35] text-white p-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  오늘의 훈련 총평 (보호자 맞춤 칭찬 &amp; 피드백)
                </label>
                <textarea
                  rows={3}
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:outline-[#FF6B35]"
                />
              </div>

              {/* Check items */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  훈련 항목별 평가
                </label>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-[#FFF9F5] rounded-xl border border-[#FEE2D5] text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1A1A1A]">{item.category}</span>
                        <div className="flex items-center gap-1">
                          {(['우수', '개선중', '주의필요'] as const).map((grade) => (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => {
                                const copy = [...items];
                                copy[idx].evaluation = grade;
                                setItems(copy);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                item.evaluation === grade ? 'bg-[#FF6B35] text-white shadow-xs' : 'bg-white border border-[#FEE2D5] text-slate-600'
                              }`}
                            >
                              {grade}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={item.comment}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].comment = e.target.value;
                          setItems(copy);
                        }}
                        className="w-full text-xs p-2.5 rounded-lg bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                        placeholder="상세 코멘트 입력"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework guide */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  보호자 홈트레이닝 숙제
                </label>
                <textarea
                  rows={2}
                  value={homeworkText}
                  onChange={(e) => setHomeworkText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:outline-[#FF6B35]"
                />
              </div>

              {/* Next session recommendation date */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  다음 2차 심화 세션 권장 날짜 (자동 리마인더 등록)
                </label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:outline-[#FF6B35]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#FEE2D5]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#FFF9F5] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e85a2a] shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>알림장 발행 및 알림톡 전송</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
