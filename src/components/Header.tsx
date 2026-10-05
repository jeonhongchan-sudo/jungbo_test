import React from 'react';
import { BookOpen, Award, CheckCircle2, Bookmark, Layers } from 'lucide-react';

interface HeaderProps {
  currentRound: number;
  totalSolved: number;
  averageScore: number;
  totalQuestionPool: number;
  wrongNotesCount: number;
  onOpenWrongNotes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRound,
  totalSolved,
  averageScore,
  totalQuestionPool,
  wrongNotesCount,
  onOpenWrongNotes
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                정보처리기사 실기 단답형 10제
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {totalQuestionPool}문제 수록
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              2025~2026 실기 최신기출 및 핵심요약 기반 10제 무작위 출제 & 자동 채점
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {totalSolved > 0 && (
            <div className="hidden md:flex items-center gap-2.5 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>응시 <strong className="text-slate-900">{currentRound}</strong>회</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>평균 <strong className="text-indigo-600">{averageScore}</strong>점</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenWrongNotes}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>오답노트</span>
            <span className="bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[10px]">
              {wrongNotesCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

