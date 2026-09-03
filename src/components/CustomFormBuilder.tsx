import React, { useState } from 'react';
import { 
  FileText, Plus, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, Eye, Sliders, ArrowUpRight, Sparkles 
} from 'lucide-react';
import { CustomFormField, Reservation } from '../types';

interface CustomFormBuilderProps {
  fields: CustomFormField[];
  onAddField: (field: CustomFormField) => void;
  onDeleteField: (fieldId: string) => void;
  selectedReservationForForm?: Reservation | null;
  onCloseDetailedView?: () => void;
  onPreviewCustomerBooking: () => void;
}

export const CustomFormBuilder: React.FC<CustomFormBuilderProps> = ({
  fields,
  onAddField,
  onDeleteField,
  selectedReservationForForm,
  onCloseDetailedView,
  onPreviewCustomerBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'view_submitted' | 'manage_template'>(
    selectedReservationForForm ? 'view_submitted' : 'manage_template'
  );

  // New question form state
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'text' | 'radio' | 'scale'>('text');
  const [newCategory, setNewCategory] = useState<'기본정보' | '안전/입질문진' | '행동/증상'>('행동/증상');
  const [newOptionsStr, setNewOptionsStr] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newField: CustomFormField = {
      id: `f_custom_${Date.now()}`,
      label: newLabel.trim(),
      description: newDesc.trim() || '추가된 사전 문진 문항입니다.',
      type: newType,
      category: newCategory,
      required: true,
      options: newType === 'radio' && newOptionsStr ? newOptionsStr.split(',').map(s => s.trim()) : undefined,
    };

    onAddField(newField);
    setNewLabel('');
    setNewDesc('');
    setNewOptionsStr('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="bg-white p-5 rounded-[24px] border border-[#FEE2D5] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5]">
                핵심 기능 [2순위]
              </span>
              <h2 className="text-lg font-black text-[#1A1A1A]">
                펫 맞춤형 사전 문진 폼 (Custom Form)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              고객이 인스타그램 예약 시 견종, 나이, 입질 여부, 병력 등을 필수로 입력하도록 강제하여 <strong className="text-[#1A1A1A]">상담 및 장문 카톡 복사 시간을 80% 단축</strong>합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="tab-manage-template-btn"
              onClick={() => setActiveTab('manage_template')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'manage_template'
                  ? 'bg-[#FF6B35] text-white shadow-xs'
                  : 'bg-[#FFF9F5] text-slate-600 hover:text-[#FF6B35] border border-[#FEE2D5]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 inline-block mr-1.5" />
              문진표 항목 설정 ({fields.length}개)
            </button>

            {selectedReservationForForm && (
              <button
                id="tab-view-submitted-btn"
                onClick={() => setActiveTab('view_submitted')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'view_submitted'
                    ? 'bg-[#2EC4B6] text-white shadow-xs'
                    : 'bg-[#FFF9F5] text-[#2EC4B6] hover:bg-[#2EC4B6]/10 border border-[#2EC4B6]/30'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline-block mr-1.5" />
                {selectedReservationForForm.petInfo.name}의 제출 문진표
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode 1: View Submitted Questionnaire for a Customer */}
      {activeTab === 'view_submitted' && selectedReservationForForm && (
        <div className="bg-white rounded-[28px] border border-[#FEE2D5] shadow-sm p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FEE2D5]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[18px] bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5] flex items-center justify-center text-2xl font-bold shadow-xs">
                🐶
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#1A1A1A]">
                    {selectedReservationForForm.petInfo.name} 사전 문진표
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2EC4B6] text-white font-bold">
                    제출 완료 (예약금 연동)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  보호자: {selectedReservationForForm.customerName} ({selectedReservationForForm.customerPhone}) · {selectedReservationForForm.address}
                </p>
              </div>
            </div>

            {onCloseDetailedView && (
              <button
                onClick={() => setActiveTab('manage_template')}
                className="text-xs font-bold text-[#FF6B35] hover:underline cursor-pointer"
              >
                항목 설정으로 돌아가기
              </button>
            )}
          </div>

          {/* Safety Alert highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-4 rounded-[20px] border ${
              selectedReservationForForm.petInfo.medicalSafety.biteHistory.includes('심함')
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-[#FFF9F5] border-[#FEE2D5] text-[#1A1A1A]'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B35]">
                <AlertTriangle className="w-4 h-4" />
                <span>입질 및 공격성 이력</span>
              </div>
              <p className="text-base font-black mt-1">
                {selectedReservationForForm.petInfo.medicalSafety.biteHistory}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {selectedReservationForForm.petInfo.medicalSafety.biteHistory.includes('심함')
                  ? '⚠️ 방문 시 안전 장갑 및 입마개 지참 필수'
                  : '경계 단계 모니터링'}
              </p>
            </div>

            <div className="p-4 rounded-[20px] border border-[#FEE2D5] bg-[#FFF9F5] text-[#1A1A1A]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Sliders className="w-4 h-4 text-[#FF9F1C]" />
                <span>외부소음 짖음 척도</span>
              </div>
              <p className="text-base font-black mt-1 text-[#FF9F1C]">
                {selectedReservationForForm.petInfo.medicalSafety.barkLevel} / 5 점
              </p>
              <div className="w-full bg-[#FFE8D9] h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-[#FF9F1C] h-full rounded-full" 
                  style={{ width: `${(selectedReservationForForm.petInfo.medicalSafety.barkLevel / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-[20px] border border-[#FEE2D5] bg-[#FFF9F5] text-[#1A1A1A]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Sliders className="w-4 h-4 text-[#FF6B35]" />
                <span>분리불안 강도</span>
              </div>
              <p className="text-base font-black mt-1 text-[#FF6B35]">
                {selectedReservationForForm.petInfo.medicalSafety.separationAnxiety} / 5 점
              </p>
              <div className="w-full bg-[#FFE8D9] h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-[#FF6B35] h-full rounded-full" 
                  style={{ width: `${(selectedReservationForForm.petInfo.medicalSafety.separationAnxiety / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Question Answers (No more copying from KakaoTalk!) */}
          <div className="space-y-4 pt-2">
            <div className="bg-[#FFF9F5] p-4.5 rounded-[20px] border border-[#FEE2D5]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                기본 신체 정보 &amp; 병력
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">견종</span>
                  <strong className="text-[#1A1A1A] text-sm font-bold">{selectedReservationForForm.petInfo.breed}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">나이 / 체중</span>
                  <strong className="text-[#1A1A1A] text-sm font-bold">{selectedReservationForForm.petInfo.age} / {selectedReservationForForm.petInfo.weight}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">성별 / 중성화</span>
                  <strong className="text-[#1A1A1A] text-sm font-bold">
                    {selectedReservationForForm.petInfo.gender} ({selectedReservationForForm.petInfo.medicalSafety.isNeutered ? '중성화 완료' : '미완료'})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">병력 및 주의사항</span>
                  <strong className="text-[#1A1A1A] text-sm font-bold">{selectedReservationForForm.petInfo.medicalSafety.healthIssues || '없음'}</strong>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF9F5] p-4.5 rounded-[20px] border border-[#FEE2D5] space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                가장 고치고 싶은 문제 행동 상세 (보호자 작성본)
              </h4>
              <p className="text-sm text-[#1A1A1A] leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-[#FEE2D5]">
                "{selectedReservationForForm.petInfo.problemDetails}"
              </p>
            </div>

            {selectedReservationForForm.petInfo.customerRequests && (
              <div className="bg-[#FFF9F5] p-4.5 rounded-[20px] border border-[#FEE2D5] space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  방문 시 보호자 특별 요청사항
                </h4>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-[#FEE2D5]">
                  {selectedReservationForForm.petInfo.customerRequests}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Questionnaire Template Manager & Custom Field Builder */}
      {activeTab === 'manage_template' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#1A1A1A]">
                현재 활성화된 사전 문진 질문지 ({fields.length}개)
              </h3>
              <p className="text-xs text-slate-500">
                인스타그램 예약 링크로 접속한 고객이 결제 전 반드시 답변해야 하는 문항들입니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="preview-custom-form-customer-btn"
                onClick={onPreviewCustomerBooking}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] bg-white border border-[#FEE2D5] hover:bg-[#FFF9F5] transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>고객 화면에서 확인</span>
              </button>
              <button
                id="open-add-question-modal-btn"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e85a2a] shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>질문 추가</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {fields.map((field, idx) => (
              <div 
                key={field.id}
                id={`field-card-${field.id}`}
                className="bg-white p-5 rounded-[24px] border border-[#FEE2D5] shadow-sm hover:border-[#FF6B35]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F5] text-[#FF6B35] border border-[#FEE2D5]">
                      #{idx + 1} · {field.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {field.required && (
                        <span className="text-[10px] font-bold text-white bg-[#FF6B35] px-2 py-0.5 rounded-full">
                          필수입력
                        </span>
                      )}
                      {field.id.startsWith('f_custom_') && (
                        <button
                          onClick={() => onDeleteField(field.id)}
                          className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                          title="질문 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1A1A]">
                    {field.label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {field.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FEE2D5] flex items-center justify-between text-[11px] text-slate-400">
                  <span>입력 형태: {field.type === 'scale' ? '1~5 척도 슬라이더' : field.type === 'radio' ? '선택형 버튼' : '텍스트 입력'}</span>
                  {field.options && <span className="text-[#FF6B35] font-semibold">선택지: {field.options.length}개</span>}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Modal to Add Custom Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#1A202C]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-[#FEE2D5] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-[#1A1A1A] mb-1">
              새 사전 문진 항목 추가
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              내 전문 분야(방문 훈련/미용/호텔)에 꼭 필요한 사전 질문지를 생성하세요.
            </p>

            <form onSubmit={handleCreateQuestion} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  질문 제목 *
                </label>
                <input
                  id="new-question-label"
                  type="text"
                  placeholder="예: 산책 시 다른 강아지를 보면 반응이 어떤가요?"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  required
                  className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:outline-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  질문 보충 설명 (플레이스홀더)
                </label>
                <input
                  id="new-question-desc"
                  type="text"
                  placeholder="예: 꼬리를 흔들며 다가감 / 엎드려서 경계 / 짖으며 돌진"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5] focus:outline-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5]"
                  >
                    <option value="기본정보">기본정보</option>
                    <option value="안전/입질문진">안전/입질문진</option>
                    <option value="행동/증상">행동/증상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">입력 형태</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5]"
                  >
                    <option value="text">직접 서술형 (텍스트)</option>
                    <option value="radio">선택형 (옵션 버튼)</option>
                    <option value="scale">1~5 척도 점수</option>
                  </select>
                </div>
              </div>

              {newType === 'radio' && (
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    선택지 목록 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 전혀 안 함, 가끔 발생, 매일 발생"
                    value={newOptionsStr}
                    onChange={(e) => setNewOptionsStr(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FFF9F5] border border-[#FEE2D5]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#FEE2D5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#FFF9F5] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e85a2a] shadow-xs cursor-pointer"
                >
                  질문 추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
