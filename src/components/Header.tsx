import React from 'react';
import { BookOpen, Award, CheckCircle2, Bookmark, Layers, BarChart3, Code2, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'EXAM' | 'CODELAB';
  onTabChange: (tab: 'EXAM' | 'CODELAB') => void;
  currentRound: number;
  totalSolved: number;
  averageScore: number;
  totalQuestionPool: number;
  wrongNotesCount: number;
  codeLabCount?: number;
  onOpenWrongNotes: () => void;
  onOpenStatistics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentRound,
  totalSolved,
  averageScore,
  totalQuestionPool,
  wrongNotesCount,
  codeLabCount = 112,
  onOpenWrongNotes,
  onOpenStatistics
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
            {activeTab === 'EXAM' ? (
              <BookOpen className="w-5 h-5" />
            ) : (
              <Code2 className="w-5 h-5 text-amber-300" />
            )}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                {activeTab === 'EXAM'
                  ? '정보처리기사 실기 단답형 10제'
                  : '고난도 프로그래밍 & SQL 디버그관'}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {activeTab === 'EXAM' ? `${totalQuestionPool}문제 수록` : `${codeLabCount}문제 수록`}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {activeTab === 'EXAM'
                ? '2025~2026 실기 최신기출 및 핵심요약 기반 10제 무작위 출제 & 자동 채점'
                : 'C/Java/Python/SQL 메모리 번지(1000번지) 및 단계별 디버깅 과정 시각화'}
            </p>
          </div>
        </div>

        {/* Center / Mode Switcher Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => onTabChange('EXAM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'EXAM'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>단답형 10제</span>
          </button>
          <button
            onClick={() => onTabChange('CODELAB')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CODELAB'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-indigo-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>프로그래밍·SQL 전용관</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'CODELAB' ? 'bg-indigo-950 text-indigo-200' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {codeLabCount}
            </span>
          </button>
        </div>

        {/* Right Tools (PWA Install Button, Round, Wrong Notes, Stats) */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          {activeTab === 'EXAM' && (
            <>
              {totalSolved > 0 && (
                <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>응시 <strong className="text-slate-900">{currentRound}</strong>회</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>평균 <strong className="text-indigo-600">{averageScore}</strong>점</span>
                  </div>
                </div>
              )}

              {/* 오답 통계 버튼 */}
              <button
                onClick={onOpenStatistics}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>오답 통계</span>
              </button>

              {/* 오답노트 버튼 */}
              <button
                onClick={onOpenWrongNotes}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>오답노트</span>
                <span className="bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[10px]">
                  {wrongNotesCount}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
