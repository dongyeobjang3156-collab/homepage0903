import React, { useState } from 'react';
import { 
  BellRing, Calendar, Send, CheckCircle2, Sparkles, MessageSquare, 
  Tag, Clock, UserCheck, ArrowRight, RefreshCw 
} from 'lucide-react';
import { RetentionReminder, Reservation } from '../types';

interface RetentionManagerProps {
  reminders: RetentionReminder[];
  onTriggerReminder: (reminderId: string) => void;
  onPreviewKakaoReminder: (reminder: RetentionReminder) => void;
}

export const RetentionManager: React.FC<RetentionManagerProps> = ({
  reminders,
  onTriggerReminder,
  onPreviewKakaoReminder,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent'>('all');

  const filtered = reminders.filter((rem) => {
    if (filter === 'pending') return rem.status === '발송대기';
    if (filter === 'sent') return rem.status === '발송완료' || rem.status === '재예약성공';
    return true;
  });

  const pendingCount = reminders.filter(r => r.status === '발송대기').length;
  const successCount = reminders.filter(r => r.status === '재예약성공').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-[24px] border border-[#FEE2D5] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFF9F5] text-[#FF9F1C] border border-[#FF9F1C]/30">
              리텐션 &amp; 재예약 케어
            </span>
            <h2 className="text-lg font-black text-[#1A1A1A]">
              2~3개월 주기 자동 리마인드 &amp; 고객 재방문 유도
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            훈련 사후 점검 및 정기 미용 주기에 도달한 고객에게 <strong className="text-[#1A1A1A]">원클릭 재예약 링크가 포함된 카카오 알림톡</strong>을 자동 발송하여 단골을 유지합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF9F5] border border-[#FF9F1C]/30 text-xs text-[#FF9F1C] font-black">
            ⚡ 발송 대기: {pendingCount}명
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF9F5] border border-[#2EC4B6]/30 text-xs text-[#2EC4B6] font-black">
            🎉 재예약 성공: {successCount}건
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-[#FF6B35] text-white shadow-xs' : 'bg-white text-slate-600 hover:text-[#FF6B35] border border-[#FEE2D5]'
          }`}
        >
          전체 리스트 ({reminders.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'pending' ? 'bg-[#FF9F1C] text-white shadow-xs' : 'bg-white text-slate-600 hover:text-[#FF9F1C] border border-[#FEE2D5]'
          }`}
        >
          발송 대기 ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'sent' ? 'bg-[#2EC4B6] text-white shadow-xs' : 'bg-white text-slate-600 hover:text-[#2EC4B6] border border-[#FEE2D5]'
          }`}
        >
          발송 완료/재예약 성사 ({reminders.length - pendingCount})
        </button>
      </div>

      {/* Reminder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rem) => (
          <div
            key={rem.id}
            id={`reminder-card-${rem.id}`}
            className="bg-white rounded-[24px] border border-[#FEE2D5] p-5 shadow-sm flex flex-col justify-between hover:border-[#FF6B35]/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F5] text-[#1A1A1A] border border-[#FEE2D5]">
                  {rem.purpose}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  rem.status === '재예약성공'
                    ? 'bg-[#2EC4B6]/15 text-[#2EC4B6]'
                    : rem.status === '발송완료'
                    ? 'bg-[#FFF9F5] text-slate-600 border border-[#FEE2D5]'
                    : 'bg-[#FF9F1C]/15 text-[#FF9F1C] animate-pulse'
                }`}>
                  {rem.status}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-black text-sm text-[#1A1A1A]">
                  <span>🐶 {rem.petName}</span>
                  <span className="text-xs text-slate-400 font-normal">({rem.petBreed})</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  보호자: {rem.customerName} ({rem.customerPhone})
                </p>
              </div>

              <div className="bg-[#FFF9F5] p-3.5 rounded-xl border border-[#FEE2D5] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>마지막 세션</span>
                  <span className="font-mono text-slate-700 font-bold">{rem.lastServiceDate}</span>
                </div>
                <div className="flex items-center justify-between text-[#1A1A1A] font-semibold">
                  <span className="flex items-center gap-1 text-[#FF9F1C]">
                    <Calendar className="w-3.5 h-3.5" />
                    권장 재방문 시기
                  </span>
                  <span className="font-mono text-[#FF9F1C] font-black">{rem.recommendedDate}</span>
                </div>
                {rem.discountCoupon && (
                  <div className="mt-2 pt-2 border-t border-[#FEE2D5] flex items-center gap-1 text-[11px] text-[#2EC4B6] font-bold">
                    <Tag className="w-3 h-3 shrink-0" />
                    <span>{rem.discountCoupon}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-[#FEE2D5] flex items-center justify-between gap-2">
              <button
                onClick={() => onPreviewKakaoReminder(rem)}
                className="text-[11px] font-bold text-slate-500 hover:text-[#FF6B35] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#FF9F1C]" />
                <span>알림톡 미리보기</span>
              </button>

              {rem.status === '발송대기' ? (
                <button
                  id={`send-reminder-btn-${rem.id}`}
                  onClick={() => onTriggerReminder(rem.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e85a2a] transition-colors shadow-xs cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>알림톡 1초 발송</span>
                </button>
              ) : rem.status === '발송완료' ? (
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  발송 완료됨
                </span>
              ) : (
                <span className="text-xs text-[#2EC4B6] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  재예약 확정 완료!
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
