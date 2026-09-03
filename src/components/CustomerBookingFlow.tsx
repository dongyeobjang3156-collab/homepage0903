import React, { useState } from 'react';
import { 
  Calendar, Clock, ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle, 
  MapPin, Award, User, Heart, Sparkles, CreditCard, ArrowLeft, Send
} from 'lucide-react';
import { ExpertProfile, CustomFormField, Reservation, BiteRisk, ScaleLevel } from '../types';

interface CustomerBookingFlowProps {
  expert: ExpertProfile;
  fields: CustomFormField[];
  existingReservations: Reservation[];
  onCompleteBooking: (newReservation: Reservation) => void;
  onBackToDashboard: () => void;
}

export const CustomerBookingFlow: React.FC<CustomerBookingFlowProps> = ({
  expert,
  fields,
  existingReservations,
  onCompleteBooking,
  onBackToDashboard,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Date & Time
  const [selectedDate, setSelectedDate] = useState('2026-09-04');
  const [selectedTime, setSelectedTime] = useState('11:00');

  // Step 2: Customer & Pet Details (Mandatory Custom Questionnaire)
  const [customerName, setCustomerName] = useState('이동엽');
  const [customerPhone, setCustomerPhone] = useState('010-5542-8891');
  const [customerAddress, setCustomerAddress] = useState('서울시 강남구 대치동 은마아파트 12동 402호');

  // Pet info
  const [petName, setPetName] = useState('두부');
  const [petBreed, setPetBreed] = useState('비숑프리제');
  const [petAge, setPetAge] = useState('1세 8개월');
  const [petWeight, setPetWeight] = useState('4.5kg');
  const [petGender, setPetGender] = useState<'남아' | '여아'>('남아');
  const [isNeutered, setIsNeutered] = useState(true);
  
  // Safety questionnaire (crucial)
  const [biteHistory, setBiteHistory] = useState<BiteRisk>('경미(낯선 사람 경계)');
  const [barkLevel, setBarkLevel] = useState<ScaleLevel>(4);
  const [separationAnxiety, setSeparationAnxiety] = useState<ScaleLevel>(3);
  const [healthIssues, setHealthIssues] = useState('귓병 병력 있음 (치료 완료)');
  const [problemDetails, setProblemDetails] = useState(
    '배달 오토바이 소리와 현관문 발자국 소리만 들리면 5분 이상 날카롭게 짖어 이웃 민원이 들어옵니다. 산책할 때도 다른 강아지를 보면 흥분해서 짖어요.'
  );
  const [specialRequests, setSpecialRequests] = useState('주차는 아파트 지하 2층 주차장에 편하게 하시면 됩니다.');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'카카오페이' | '토스페이' | '신용카드'>('카카오페이');
  const [agreeNoShowPolicy, setAgreeNoShowPolicy] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Available time slots
  const timeSlots = [
    { time: '09:30', available: true },
    { time: '11:00', available: true },
    { time: '13:30', available: false, bookedReason: '예약마감' },
    { time: '15:30', available: true },
    { time: '17:30', available: true },
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName || !customerName || !customerPhone || !problemDetails) {
      alert('필수 문진 항목을 모두 입력해주세요.');
      return;
    }
    setStep(3);
  };

  const handleConfirmReservation = () => {
    if (!agreeNoShowPolicy) {
      alert('노쇼 방지 예약금 약관에 동의해주셔야 예약이 확정됩니다.');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);

      const newReservation: Reservation = {
        id: `res_${Date.now()}`,
        customerName,
        customerPhone,
        address: customerAddress,
        petInfo: {
          name: petName,
          breed: petBreed,
          age: petAge,
          weight: petWeight,
          gender: petGender,
          medicalSafety: {
            biteHistory,
            barkLevel,
            separationAnxiety,
            healthIssues,
            isVaccinated: true,
            isNeutered,
          },
          problemDetails,
          customerRequests: specialRequests,
        },
        date: selectedDate,
        time: selectedTime,
        status: '확정(예약금완료)',
        depositAmount: expert.depositFee,
        totalAmount: expert.serviceFee,
        paymentMethod,
        isDepositSecured: true,
        createdAt: '방금 전',
        hasReportSent: false,
      };

      onCompleteBooking(newReservation);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-[85vh] rounded-[32px] shadow-2xl border border-[#FEE2D5] overflow-hidden flex flex-col justify-between my-4 font-sans">
      
      {/* Top Mobile Bar Simulation */}
      <div>
        <div className="bg-[#1A202C] text-white px-4 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse"></span>
            <span className="font-mono font-semibold">petfront.io/{expert.instagramHandle.replace('@', '')}</span>
          </div>
          <button
            onClick={onBackToDashboard}
            className="text-white/80 hover:text-white underline text-[11px] cursor-pointer"
          >
            관리자 화면으로
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-[#FFF9F5] px-4 py-2.5 border-b border-[#FEE2D5] flex items-center justify-between text-xs font-bold text-[#FF6B35]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
            <span>노쇼 안심 보증 예약 시스템</span>
          </div>
          <span className="text-[#FF6B35] font-mono font-black">단계 {step}/4</span>
        </div>

        {/* Expert Profile Card (Instagram Profile Header Look) */}
        {step !== 4 && (
          <div className="p-4.5 bg-[#FFF9F5]/70 border-b border-[#FEE2D5]">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                🐾
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-sm font-black text-[#1A1A1A]">{expert.name} 훈련사</h1>
                  <span className="text-[10px] bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5] font-black px-2 py-0.5 rounded-full">
                    공인 1급 훈련사
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700">{expert.shopName}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{expert.serviceArea}</p>
              </div>
            </div>
            
            <div className="mt-3.5 p-3 rounded-2xl bg-white border border-[#FEE2D5] flex items-center justify-between text-xs shadow-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">1:1 맞춤 방문 훈련 (90분)</span>
                <strong className="text-[#1A1A1A] font-bold">{expert.serviceFee.toLocaleString()}원</strong>
              </div>
              <div className="text-right">
                <span className="text-[#FF6B35] block text-[10px] font-bold">노쇼 방지 예약금</span>
                <strong className="text-[#FF6B35] font-black">{expert.depositFee.toLocaleString()}원 선납</strong>
              </div>
            </div>
          </div>
        )}

        {/* Content per Step */}
        <div className="p-4 sm:p-5">
          
          {/* STEP 1: Date & Time selection */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  <span>1. 희망 방문 날짜를 선택해주세요</span>
                </h3>
                <p className="text-xs text-slate-500">
                  실시간으로 마감되지 않은 빈 슬롯만 선택 가능합니다.
                </p>
              </div>

              {/* Date button chips */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '내일', date: '2026-09-04' },
                  { label: '토요일', date: '2026-09-05' },
                  { label: '일요일', date: '2026-09-06' },
                ].map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                      selectedDate === d.date
                        ? 'bg-[#FF6B35] text-white border-[#FF6B35] font-black shadow-xs'
                        : 'bg-[#FFF9F5] text-slate-700 border-[#FEE2D5] hover:bg-[#FEE2D5]'
                    }`}
                  >
                    <span className="block text-[11px] opacity-80">{d.label}</span>
                    <span className="text-xs font-mono font-bold">{d.date.substring(5)}</span>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  희망 시간대 선택 (이동 시간 30분 자동 확보)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                        !slot.available
                          ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
                          : 'bg-[#FFF9F5] text-[#1A1A1A] border-[#FEE2D5] hover:bg-[#FEE2D5]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {slot.time}
                      </span>
                      {slot.available ? (
                        <span className="text-[10px] font-bold opacity-90">예약가능</span>
                      ) : (
                        <span className="text-[10px] text-rose-500 font-normal">마감</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <span>다음: 펫 맞춤 사전 문진표 작성하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Mandatory Custom Questionnaire */}
          {step === 2 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                    <span>2. 맞춤형 사전 문진표 (필수)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-[#1A1A1A] flex items-center cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3 mr-0.5" /> 날짜변경
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  사전 작성 시 현장 상담 시간이 80% 단축되며 맞춤 솔루션을 준비해갑니다.
                </p>
              </div>

              {/* Guardian Info */}
              <div className="bg-[#FFF9F5] p-4 rounded-[20px] border border-[#FEE2D5] space-y-2.5">
                <span className="text-[11px] font-bold text-[#1A1A1A] block">보호자 정보</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="성함 *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                  <input
                    type="tel"
                    placeholder="연락처 *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="방문 주소 (아파트명/동호수) *"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                />
              </div>

              {/* Pet Info */}
              <div className="bg-[#FFF9F5] p-4 rounded-[20px] border border-[#FEE2D5] space-y-2.5">
                <span className="text-[11px] font-bold text-[#1A1A1A] block">반려견 기본 정보</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="반려견 이름 *"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    required
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                  <input
                    type="text"
                    placeholder="견종 (예: 비숑, 푸들) *"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    required
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="나이 (예: 2세) *"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    required
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                  <input
                    type="text"
                    placeholder="체중 (예: 4.5kg) *"
                    value={petWeight}
                    onChange={(e) => setPetWeight(e.target.value)}
                    required
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                  <select
                    value={petGender}
                    onChange={(e) => setPetGender(e.target.value as any)}
                    className="text-xs p-2.5 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  >
                    <option value="남아">남아</option>
                    <option value="여아">여아</option>
                  </select>
                </div>
              </div>

              {/* Crucial Safety & Behavior Questions */}
              <div className="bg-[#FFF9F5] p-4 rounded-[20px] border border-[#FF6B35]/30 space-y-3">
                <div>
                  <label className="text-xs font-black text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    <span>입질 및 공격성 이력 (필수 체크) *</span>
                  </label>
                  <div className="space-y-1.5">
                    {(['없음', '경미(낯선 사람 경계)', '심함(보호자/미용사 물림 이력)'] as BiteRisk[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setBiteHistory(opt)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                          biteHistory === opt
                            ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
                            : 'bg-white text-slate-700 border-[#FEE2D5] hover:bg-[#FFF9F5]'
                        }`}
                      >
                        <span>{opt}</span>
                        {biteHistory === opt && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scale 1: Barking */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>외부소음 / 초인종 짖음 정도</span>
                    <span className="text-[#FF6B35] font-black">{barkLevel} / 5 점</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={barkLevel}
                    onChange={(e) => setBarkLevel(Number(e.target.value) as ScaleLevel)}
                    className="w-full accent-[#FF6B35]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1: 거의 안 짖음</span>
                    <span>5: 극심한 경계 짖음</span>
                  </div>
                </div>

                {/* Detailed description */}
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] block mb-1">
                    가장 고민인 문제 행동 상세 (카톡 장문 대신 작성) *
                  </label>
                  <textarea
                    rows={3}
                    value={problemDetails}
                    onChange={(e) => setProblemDetails(e.target.value)}
                    required
                    placeholder="언제부터 증상이 시작되었는지, 어떤 상황에서 주로 심해지는지 적어주세요."
                    className="w-full text-xs p-3 rounded-xl bg-white border border-[#FEE2D5] focus:outline-[#FF6B35]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <span>다음: 노쇼 방지 예약금 결제</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: Payment & No-Show Deposit */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#FF6B35]" />
                    <span>3. 노쇼 방지 예약금 결제</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-slate-500 hover:text-[#1A1A1A] flex items-center cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3 mr-0.5" /> 문진표 수정
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  예약금 선납 시 캘린더에 즉시 자동 확정됩니다.
                </p>
              </div>

              {/* Price summary */}
              <div className="bg-[#FFF9F5] p-4.5 rounded-[20px] border border-[#FEE2D5] space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>훈련 일정</span>
                  <span className="font-bold text-[#1A1A1A]">{selectedDate} ({selectedTime})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>훈련 대상</span>
                  <span className="font-bold text-[#1A1A1A]">{petName} ({petBreed})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>총 서비스 비용 (90분)</span>
                  <span className="font-mono text-slate-700">{expert.serviceFee.toLocaleString()}원</span>
                </div>
                <div className="pt-2.5 border-t border-[#FEE2D5] flex justify-between items-baseline">
                  <span className="font-black text-[#1A1A1A]">지금 결제할 예약금</span>
                  <span className="text-xl font-black text-[#FF6B35]">
                    {expert.depositFee.toLocaleString()}원
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 text-right">
                  * 잔금 {(expert.serviceFee - expert.depositFee).toLocaleString()}원은 훈련 종료 후 현장 결제
                </p>
              </div>

              {/* Payment methods */}
              <div>
                <label className="text-xs font-bold text-[#1A1A1A] block mb-2">
                  결제 수단 선택 (원클릭 간편결제)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '카카오페이', bg: 'bg-[#FEE500] text-slate-900' },
                    { id: '토스페이', bg: 'bg-[#0064FF] text-white' },
                    { id: '신용카드', bg: 'bg-[#1A202C] text-white' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'ring-2 ring-[#FF6B35] scale-[1.02] shadow-xs'
                          : 'opacity-70 hover:opacity-100'
                      } ${pm.bg}`}
                    >
                      {pm.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* No-show policy consent */}
              <div className="bg-[#FFF9F5] p-4 rounded-[20px] border border-[#FF9F1C]/40 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="policy-agree"
                    checked={agreeNoShowPolicy}
                    onChange={(e) => setAgreeNoShowPolicy(e.target.checked)}
                    className="mt-0.5 accent-[#FF6B35] rounded"
                  />
                  <label htmlFor="policy-agree" className="text-xs text-[#1A1A1A] leading-snug cursor-pointer">
                    <strong className="font-black text-[#FF6B35]">[필수] 노쇼 방지 및 환불 규정 동의</strong>
                    <span className="block text-[11px] text-slate-600 mt-1">
                      1인 전문가의 시간 보호를 위해 방문 24시간 전 취소 시 50% 위약금, 당일 취소 및 연락두절 시 예약금(30,000원)은 전액 환불 불가 규정에 동의합니다.
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessingPayment || !agreeNoShowPolicy}
                onClick={handleConfirmReservation}
                className="w-full py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-slate-300 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FF6B35]/25 cursor-pointer transition-all active:scale-95"
              >
                {isProcessingPayment ? (
                  <span>간편결제 승인 처리 중...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{expert.depositFee.toLocaleString()}원 결제하고 예약 확정</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 4: Success Screen & Kakao Notification Simulation */}
          {step === 4 && (
            <div className="space-y-4 text-center py-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-[#2EC4B6]/15 text-[#2EC4B6] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#1A1A1A]">
                  예약 및 예약금 결제 완료!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {expert.name} 훈련사의 캘린더에 실시간으로 등록되었습니다.
                </p>
              </div>

              <div className="bg-[#FFF9F5] p-4.5 rounded-[24px] border border-[#FEE2D5] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">예약 일시</span>
                  <strong className="text-[#1A1A1A] font-bold">{selectedDate} ({selectedTime})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">방문 장소</span>
                  <strong className="text-[#1A1A1A] truncate max-w-[200px]">{customerAddress}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">반려견</span>
                  <strong className="text-[#FF6B35] font-black">🐶 {petName} ({petBreed})</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#FEE2D5]">
                  <span className="text-slate-500">결제된 예약금</span>
                  <strong className="text-[#FF6B35] font-black">{expert.depositFee.toLocaleString()}원 (선납 완료)</strong>
                </div>
              </div>

              {/* Kakao notification badge */}
              <div className="bg-[#FEE500]/20 p-3.5 rounded-2xl border border-[#FEE500] text-xs text-[#1A1A1A] flex items-center gap-2.5 text-left">
                <span className="text-lg">💬</span>
                <div>
                  <strong className="font-bold block text-[#1A1A1A]">카카오톡 예약 알림톡 발송 완료</strong>
                  <span className="text-[11px] text-slate-600">
                    보호자({customerPhone})와 {expert.name} 훈련사에게 안내 메시지가 전송되었습니다.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onBackToDashboard}
                  className="w-full py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  전문가 관리자 대시보드에서 예약 확인하기
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-[#FF6B35] py-1 cursor-pointer"
                >
                  다른 시간으로 다시 예약 체험하기
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-[#FFF9F5] border-t border-[#FEE2D5] text-center text-[10px] text-slate-500 font-medium">
        Powered by 🐾 펫프론트 (PetFront) · 1인 펫 전문가 전용 솔루션
      </div>

    </div>
  );
};
