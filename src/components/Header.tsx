import React from 'react';
import { ShieldCheck, Instagram, ExternalLink, Sparkles, Check, Copy } from 'lucide-react';
import { ExpertProfile } from '../types';

interface HeaderProps {
  currentMode: 'expert' | 'customer';
  onChangeMode: (mode: 'expert' | 'customer') => void;
  expert: ExpertProfile;
  onOpenRoiModal: () => void;
  onOpenPlanModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onChangeMode,
  expert,
  onOpenRoiModal,
  onOpenPlanModal,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://petfront.io/${expert.instagramHandle.replace('@', '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#FEE2D5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#FF6B35]/25">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-[#FF6B35]">
                  펫프론트
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5]">
                  1인 펫 전문가 전용 CRM
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                인스타그램 DM 예약의 번거로움 &amp; 노쇼 방지 솔루션
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-[#FFF9F5] p-1 rounded-2xl border border-[#FEE2D5]">
            <button
              id="view-expert-mode-btn"
              onClick={() => onChangeMode('expert')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'expert'
                  ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#FEE2D5]'
                  : 'text-slate-600 hover:text-[#FF6B35]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2EC4B6] inline-block"></span>
              전문가 관리자 (이민수)
            </button>
            <button
              id="view-customer-mode-btn"
              onClick={() => onChangeMode('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'customer'
                  ? 'bg-[#FF6B35] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#FF6B35]'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>고객 예약 체험 (인스타 링크)</span>
            </button>
          </div>

          {/* Quick Actions: ROI & Plan */}
          <div className="flex items-center gap-2">
            <button
              id="roi-calculator-trigger-btn"
              onClick={onOpenRoiModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2EC4B6] bg-[#2EC4B6]/10 hover:bg-[#2EC4B6]/20 border border-[#2EC4B6]/30 transition-colors cursor-pointer"
              title="노쇼 방어 수익성 분석"
            >
              <ShieldCheck className="w-4 h-4 text-[#2EC4B6]" />
              <span>노쇼 2건 방어 (26만원 회수)</span>
            </button>

            <button
              id="plan-status-btn"
              onClick={onOpenPlanModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-[#FFF9F5] hover:bg-[#FEE2D5]/60 border border-[#FEE2D5] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span className="hidden sm:inline">무료 플랜:</span>
              <span className="font-bold text-[#FF6B35]">{expert.monthlyBookingsCount}/{expert.maxFreeBookings}건</span>
              <span className="text-[11px] text-slate-500 hidden lg:inline">· Pro</span>
            </button>

            <button
              id="copy-public-link-btn"
              onClick={handleCopyLink}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-[#FFF9F5] border border-[#FEE2D5] transition-colors cursor-pointer"
              title="내 인스타 프로필용 예약링크 복사"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  <span className="text-[#2EC4B6] font-bold">복사완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>예약링크 복사</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
