import React from 'react';
import { ChapterCategory, ExamPresetMode } from '../types/quiz';
import { Sparkles, CheckCircle, Flame, Filter, Clock, Layers, BookA, LayoutGrid } from 'lucide-react';

interface ExamControlsProps {
  presetMode: ExamPresetMode;
  onSelectPresetMode: (mode: ExamPresetMode) => void;
  selectedChapter: ChapterCategory;
  onSelectChapter: (ch: ChapterCategory) => void;
  onlyAImportance: boolean;
  onToggleOnlyA: () => void;
  onGenerateNewExam: () => void;
  answeredCount: number;
  totalQuestions: number;
  onSubmitExam: () => void;
  isSubmitted: boolean;
  timeLeft: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
}

export const ExamControls: React.FC<ExamControlsProps> = ({
  presetMode,
  onSelectPresetMode,
  selectedChapter,
  onSelectChapter,
  onlyAImportance,
  onToggleOnlyA,
  onGenerateNewExam,
  answeredCount,
  totalQuestions,
  onSubmitExam,
  isSubmitted,
  timeLeft,
  isTimerRunning,
  onToggleTimer
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
      {/* Quick Mode Selection Bar */}
      <div className="pb-3 mb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
            집중 학습 모드:
          </span>

          {/* 전체 종합 버튼 */}
          <button
            onClick={() => onSelectPresetMode('ALL')}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              presetMode === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 종합 (1~12장)
          </button>

          {/* 디결응 버튼 */}
          <button
            onClick={() => onSelectPresetMode('DI_GYEOL_EUNG')}
            type="button"
            title="디자인패턴 + 결합도 + 응집도 집중 훈련 모드"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              presetMode === 'DI_GYEOL_EUNG'
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200 ring-2 ring-purple-300'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>디결응</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              presetMode === 'DI_GYEOL_EUNG' ? 'bg-purple-700 text-purple-100' : 'bg-purple-200/70 text-purple-800'
            }`}>
              디자인패턴·결합도·응집도
            </span>
          </button>

          {/* 용어 버튼 */}
          <button
            onClick={() => onSelectPresetMode('TERMS')}
            type="button"
            title="네트워크, SW, HW, 데이터베이스, 보안 핵심 단답형 용어 연습 모드"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              presetMode === 'TERMS'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-200 ring-2 ring-teal-300'
                : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:border-teal-300'
            }`}
          >
            <BookA className="w-3.5 h-3.5" />
            <span>용어</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              presetMode === 'TERMS' ? 'bg-teal-700 text-teal-100' : 'bg-teal-200/70 text-teal-800'
            }`}>
              NW·SW·HW·DB·보안
            </span>
          </button>
        </div>

        {/* Current Mode Status Label */}
        <div className="text-xs text-slate-500 font-medium">
          {presetMode === 'DI_GYEOL_EUNG' && (
            <span className="text-purple-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping inline-block" />
              디자인패턴 / 결합도 / 응집도 10문항 집중 출제 중
            </span>
          )}
          {presetMode === 'TERMS' && (
            <span className="text-teal-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" />
              NW · SW · HW · DB · 보안 단답형 용어 10문항 출제 중
            </span>
          )}
          {presetMode === 'ALL' && (
            <span className="text-slate-600 font-medium">
              실전 기출 및 전 단원 통합 10문항 출제 중
            </span>
          )}
        </div>
      </div>

      {/* Top Filter and Generator Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Options & Chapter Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {presetMode !== 'DI_GYEOL_EUNG' && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>단원 선택:</span>
              <select
                value={selectedChapter}
                onChange={(e) => onSelectChapter(e.target.value as ChapterCategory)}
                className="bg-transparent font-bold text-indigo-700 outline-hidden cursor-pointer"
              >
                <option value="ALL">전체 과목 (종합)</option>
                <option value="CH1_요구사항확인">1장 요구사항 확인</option>
                <option value="CH2_데이터입출력">2장 데이터 입·출력</option>
                <option value="CH4_서버프로그램">4장 서버 프로그램</option>
                <option value="CH5_인터페이스">5장 인터페이스 구현</option>
                <option value="CH7_애플리케이션테스트">7장 애플리케이션 테스트</option>
                <option value="CH8_SQL응용">8장 SQL 응용</option>
                <option value="CH9_소프트웨어보안">9장 SW 개발 보안</option>
                <option value="CH11_응용SW기초">11장 응용 SW 기초 기술</option>
                <option value="CH12_소프트웨어패키징">12장 제품 SW 패키징</option>
              </select>
            </div>
          )}

          <button
            onClick={onToggleOnlyA}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              onlyAImportance
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyAImportance ? 'fill-rose-500 text-rose-600' : 'text-slate-400'}`} />
            기출 최빈출(A등급만)
          </button>

          {/* Timer Button */}
          {!isSubmitted && (
            <button
              onClick={onToggleTimer}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {isTimerRunning ? `제한시간 ${formatTime(timeLeft)}` : '타이머 15분'}
            </button>
          )}
        </div>

        {/* Right: Problem Generator Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateNewExam}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
            10문제 새로 생성
          </button>
        </div>
      </div>

      {/* Answer Progress & Submit Row */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Progress Bar */}
        <div className="w-full sm:max-w-md">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-600">
            <span>답안 작성 현황</span>
            <span>
              <strong className="text-indigo-600">{answeredCount}</strong> / {totalQuestions} 문항 완료 ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                answeredCount === totalQuestions ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Submit Button */}
        {!isSubmitted ? (
          <button
            onClick={onSubmitExam}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            {answeredCount === totalQuestions
              ? '답안 제출 및 자동 채점'
              : answeredCount > 0
              ? `답안 제출 (미입력 ${totalQuestions - answeredCount}개 포함)`
              : '답안 제출 및 자동 채점'}
          </button>
        ) : (
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            ✓ 채점이 완료되었습니다 (아래 결과 및 해설 확인)
          </div>
        )}
      </div>
    </div>
  );
};
