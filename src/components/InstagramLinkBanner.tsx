import React, { useState } from 'react';
import { Instagram, Copy, Check, MessageSquareText, ShieldAlert, Sparkles, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { ExpertProfile } from '../types';

interface InstagramLinkBannerProps {
  expert: ExpertProfile;
  onPreviewCustomerBooking: () => void;
}

export const InstagramLinkBanner: React.FC<InstagramLinkBannerProps> = ({
  expert,
  onPreviewCustomerBooking,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const reservationUrl = `https://petfront.io/${expert.instagramHandle.replace('@', '')}`;
  
  const dmAutoReplyTemplate = `안녕하세요! [${expert.shopName}] ${expert.name} 훈련사입니다 🐾
현재 출장 훈련 및 운전 중이라 DM 답변이 지연될 수 있습니다.

아래 전용 예약 링크에서 [실시간 빈 시간 확인 + 펫 사전 문진표 작성] 후 예약금을 결제해주시면 즉시 일정이 확정됩니다!

👉 빠른 예약하기: ${reservationUrl}
(노쇼 방지를 위해 예약금 30,000원 결제 후 예약 확정)`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reservationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(dmAutoReplyTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="bg-[#1A202C] text-white rounded-[28px] p-5 sm:p-6 shadow-xl border border-[#FF6B35]/20 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        
        {/* Left: Persona context & Value proposition */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF6B35] text-white flex items-center gap-1.5 shadow-sm">
              <Instagram className="w-3.5 h-3.5" />
              인스타 프로필 링크 연동
            </span>
            <span className="text-xs text-[#2EC4B6] font-bold">
              💡 DM 응대 2시간 ➝ 0분으로 단축!
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            "인스타 DM으로 늦게 답장하다 고객 놓치지 마세요"
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            프로필 링크에 등록해두면 고객이 <strong className="text-white underline decoration-[#FF6B35] underline-offset-4 font-bold">스스로 빈 시간 확인 + 펫 문진표 작성 + 예약금 결제</strong>까지 1분 만에 완료합니다.
          </p>
        </div>

        {/* Right: Action buttons & link badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 flex items-center justify-between gap-3 text-xs font-mono text-[#2EC4B6]">
            <span className="truncate max-w-[200px] sm:max-w-none">{reservationUrl}</span>
            <button
              id="copy-banner-link-btn"
              onClick={handleCopyLink}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
              title="링크 복사"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#2EC4B6]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            id="test-customer-screen-btn"
            onClick={onPreviewCustomerBooking}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-black text-sm shadow-lg shadow-[#FF6B35]/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>고객 화면 테스트</span>
          </button>
        </div>

      </div>

      {/* Accordion: Quick DM reply template for solo operators */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <button
            id="toggle-dm-template-btn"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#FF6B35] transition-colors"
          >
            <MessageSquareText className="w-4 h-4 text-[#FF9F1C]" />
            <span>인스타그램 DM 문의 시 복사해서 바로 보낼 1초 응답 템플릿 보기</span>
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showGuide && (
            <button
              id="copy-dm-template-btn"
              onClick={handleCopyTemplate}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              {copiedTemplate ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  <span>문구 복사완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>문구 복사</span>
                </>
              )}
            </button>
          )}
        </div>

        {showGuide && (
          <div className="mt-3 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-slate-300 whitespace-pre-line font-sans leading-relaxed">
            {dmAutoReplyTemplate}
          </div>
        )}
      </div>

    </div>
  );
};
