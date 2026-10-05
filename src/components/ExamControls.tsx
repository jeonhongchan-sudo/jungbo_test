import React from 'react';
import { ChapterCategory } from '../types/quiz';
import { Sparkles, Play, CheckCircle, Flame, Filter, Clock } from 'lucide-react';

interface ExamControlsProps {
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
      {/* Top Filter and Generator Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Options & Chapter Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>단원 선택:</span>
            <select
              value={selectedChapter}
              onChange={(e) => onSelectChapter(e.target.value as ChapterCategory)}
              className="bg-transparent font-bold text-indigo-700 outline-hidden cursor-pointer"
            >
              <option value="ALL">전체 과목 (1장~12장 종합)</option>
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

          <button
            onClick={onToggleOnlyA}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              onlyAImportance
                ? 'bg-rose-50 text-rose-700 border-rose-300'
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
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
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
