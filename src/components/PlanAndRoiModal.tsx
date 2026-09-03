import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, Sparkles, TrendingUp, DollarSign, Clock, 
  HelpCircle, ArrowRight, Instagram, GraduationCap, Award
} from 'lucide-react';
import { ExpertProfile } from '../types';

interface PlanAndRoiModalProps {
  expert: ExpertProfile;
  isOpen: boolean;
  initialTab?: 'roi' | 'plan' | 'growth';
  onClose: () => void;
  onUpgradeToPro: () => void;
}

export const PlanAndRoiModal: React.FC<PlanAndRoiModalProps> = ({
  expert,
  isOpen,
  initialTab = 'roi',
  onClose,
  onUpgradeToPro,
}) => {
  const [activeTab, setActiveTab] = useState<'roi' | 'plan' | 'growth'>(initialTab);

  // ROI Interactive Calculator
  const [avgPricePerSession, setAvgPricePerSession] = useState(130000);
  const [monthlyNoShowsBefore, setMonthlyNoShowsBefore] = useState(2); // 2 no shows prevented per month

  if (!isOpen) return null;

  const monthlyDefendedRevenue = avgPricePerSession * monthlyNoShowsBefore;
  const proCost = 29000;
  const netProfit = monthlyDefendedRevenue - proCost;
  const roiMultiplier = Math.round((monthlyDefendedRevenue / proCost) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A202C]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-[#FEE2D5] flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#FF6B35] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-white text-[#FF6B35] flex items-center justify-center text-base font-black shadow-xs">🐾</span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                펫프론트 비즈니스 &amp; 요금제
              </h3>
            </div>
            <p className="text-xs text-white/90">
              "한 달에 노쇼 1건만 방어해도 월 구독료의 4~5배를 회수합니다."
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-[#FFF9F5] p-2 flex items-center gap-2 border-b border-[#FEE2D5]">
          <button
            onClick={() => setActiveTab('roi')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'roi' ? 'bg-[#FF6B35] text-white shadow-xs' : 'text-slate-600 hover:text-[#FF6B35]'
            }`}
          >
            💰 노쇼 방어 ROI 계산기
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'plan' ? 'bg-[#FF6B35] text-white shadow-xs' : 'text-slate-600 hover:text-[#FF6B35]'
            }`}
          >
            ✨ 요금제 (Free vs Pro)
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'growth' ? 'bg-[#FF6B35] text-white shadow-xs' : 'text-slate-600 hover:text-[#FF6B35]'
            }`}
          >
            🚀 초기 고객 확보 &amp; 전략
          </button>
        </div>

        {/* Tab 1: Interactive ROI Calculator */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 font-sans">
          
          {activeTab === 'roi' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-[#FFF9F5] rounded-[24px] p-5 border border-[#2EC4B6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#2EC4B6] uppercase tracking-wider block">
                    구독료 대비 투자 수익률 (ROI)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-0.5">
                    월 <span className="text-[#2EC4B6]">{roiMultiplier}배</span> ({((roiMultiplier) * 100).toFixed(0)}%) 회수!
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    노쇼로 날리던 <strong className="text-[#1A1A1A]">{monthlyDefendedRevenue.toLocaleString()}원</strong>을 보존하여 순수익 <strong className="text-[#2EC4B6]">+{netProfit.toLocaleString()}원</strong> 창출
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#FEE2D5] text-center shrink-0 shadow-xs">
                  <span className="text-[11px] text-slate-400 block">Pro 월 구독료</span>
                  <span className="text-lg font-black text-[#1A1A1A]">29,000원</span>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 bg-[#FFF9F5] p-5 rounded-[24px] border border-[#FEE2D5]">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#1A1A1A] mb-1.5">
                    <span>1회 시술/훈련비 평균 단가</span>
                    <span className="text-[#FF6B35] font-black">{avgPricePerSession.toLocaleString()}원</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={250000}
                    step={10000}
                    value={avgPricePerSession}
                    onChange={(e) => setAvgPricePerSession(Number(e.target.value))}
                    className="w-full accent-[#FF6B35]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>5만 원 (위생/목욕)</span>
                    <span>13만 원 (방문 훈련)</span>
                    <span>25만 원 (종합 코스)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#1A1A1A] mb-1.5">
                    <span>월 평균 방어할 노쇼/당일 취소 건수</span>
                    <span className="text-[#FF6B35] font-black">{monthlyNoShowsBefore}건 / 월</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={monthlyNoShowsBefore}
                    onChange={(e) => setMonthlyNoShowsBefore(Number(e.target.value))}
                    className="w-full accent-[#FF6B35]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1건 (최소치)</span>
                    <span>3건</span>
                    <span>6건 (성수기)</span>
                  </div>
                </div>
              </div>

              {/* Administrative Time Saved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#2EC4B6]/30 text-[#1A1A1A]">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-[#2EC4B6]">
                    <Clock className="w-4 h-4" />
                    <span className="font-black">월 48시간의 행정 CS 절약</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    운전 중 인스타 DM 확인, 카톡 문진 메모장 복사, 수기 엑셀 정산이 사라져 본업인 훈련/미용에만 온전히 집중 가능합니다.
                  </p>
                </div>

                <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FF6B35]/30 text-[#1A1A1A]">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-[#FF6B35]">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-black">2~3개월 뒤 재방문율 +42% 향상</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    시술 후 발송되는 디지털 알림장과 자동 리마인더로 이탈 고객을 방지하고 고정 단골 고객을 락인(Lock-in)합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Pricing Tiers */}
          {activeTab === 'plan' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              
              {/* Free Plan */}
              <div className="p-5 rounded-[24px] border border-[#FEE2D5] bg-[#FFF9F5] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-base text-[#1A1A1A]">Freemium</h4>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-600 border border-[#FEE2D5]">
                      현재 이용 중
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#1A1A1A]">0원 <span className="text-xs text-slate-400 font-normal">/ 월</span></div>
                  <p className="text-xs text-slate-500">
                    막 창업한 1인 펫 전문가의 초기 허들을 낮추고 편리함을 직접 체험
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 pt-2.5 border-t border-[#FEE2D5]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                      <span>월 예약 접수 <strong className="text-[#1A1A1A]">20건까지 무료</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                      <span>노쇼 방지 예약금 자동 결제</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                      <span>사전 문진표 기본 폼 제공</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <X className="w-3.5 h-3.5 text-slate-300" />
                      <span>커스텀 로고/브랜딩 미제공</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-[#FEE2D5] text-xs text-slate-400 font-medium">
                  현재 사용량: {expert.monthlyBookingsCount}/{expert.maxFreeBookings}건
                </div>
              </div>

              {/* Pro Plan */}
              <div className="p-5 rounded-[24px] border-2 border-[#FF6B35] bg-[#FFF9F5] flex flex-col justify-between relative shadow-lg shadow-[#FF6B35]/15">
                <div className="absolute -top-3 right-4 bg-[#FF6B35] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  추천 인기 플랜
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-base text-[#1A1A1A]">Pro 티어</h4>
                    <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                  </div>
                  <div className="text-2xl font-black text-[#1A1A1A]">
                    29,000원 <span className="text-xs text-slate-400 font-normal">/ 월</span>
                  </div>
                  <p className="text-xs text-[#FF6B35] font-bold">
                    "노쇼 1건만 막아도 월 구독료의 4~5배 회수"
                  </p>

                  <ul className="space-y-2 text-xs text-[#1A1A1A] pt-2.5 border-t border-[#FEE2D5]">
                    <li className="flex items-center gap-2 font-black text-[#FF6B35]">
                      <Check className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>예약 접수 무제한</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                      <span>내 샵 로고/커스텀 브랜딩 예약 페이지</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                      <span>카카오톡 알림톡 월 200건 기본 포함</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                      <span>2~3개월 재예약 자동 리마인드 엔진</span>
                    </li>
                  </ul>
                </div>

                <button
                  id="upgrade-pro-btn"
                  onClick={onUpgradeToPro}
                  className="mt-5 w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-black text-xs shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer"
                >
                  Pro 플랜으로 지금 업그레이드
                </button>
              </div>

            </div>
          )}

          {/* Tab 3: Growth & 100 Customers Strategy */}
          {activeTab === 'growth' && (
            <div className="space-y-4 animate-in fade-in text-xs">
              
              <div className="bg-[#1A202C] text-white p-5 rounded-[24px]">
                <h4 className="font-black text-sm flex items-center gap-1.5 text-[#FF6B35]">
                  <Award className="w-4 h-4" />
                  <span>첫 100명 1인 펫 전문가 확보 로드맵</span>
                </h4>
                <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
                  IT 리터러시가 낮고 월 3만 원 지출 저항감이 있는 영세 사업자를 위해 <strong className="text-white">'무료 링크 대리 세팅'</strong>과 <strong className="text-[#FF6B35]">'수수료 0원 독립 자사몰'</strong> 프레이밍으로 침투합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FEE2D5] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-black text-[#1A1A1A]">
                    <Instagram className="w-4 h-4 text-[#FF6B35]" />
                    <span>1. 인스타 DM 아웃바운드</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    프로필에 '예약 문의는 DM'인 계정 500개 추출 ➝ 3개월 Pro 무료 + 프로필 링크 세팅 대행 제안
                  </p>
                </div>

                <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FEE2D5] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-black text-[#1A1A1A]">
                    <DollarSign className="w-4 h-4 text-[#2EC4B6]" />
                    <span>2. 크몽/숨고 프리랜서 공략</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    플랫폼의 10~20% 과도한 중개 수수료 대신 독립된 자사 전용 예약 링크로 순마진 15% 이상 개선
                  </p>
                </div>

                <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FEE2D5] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-black text-[#1A1A1A]">
                    <GraduationCap className="w-4 h-4 text-[#FF9F1C]" />
                    <span>3. 아카데미 B2B 제휴</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    펫 미용/훈련 자격증 취득 후 막 창업하는 신규 원장님들에게 '창업 필수 관리 솔루션' 공식 온보딩 제휴
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#FF9F1C]/40 text-[#1A1A1A]">
                <strong className="block font-black text-[#FF6B35]">⚠️ 실패 요인 극복 전략 (IT 지불 저항감 돌파)</strong>
                <span className="text-[11px] text-slate-600 mt-1 block leading-relaxed">
                  수기 장부와 카톡에 익숙한 원장님들을 위해, 카톡 채팅방처럼 친숙한 3버튼 인터페이스를 제공하고 "노쇼 1건 방어 = 연간 구독료 회수" 논리로 지불 저항을 완벽히 무력화합니다.
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
