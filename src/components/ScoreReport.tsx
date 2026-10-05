import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, AlertTriangle, CheckCircle2, ChevronDown, Bookmark } from 'lucide-react';

interface ScoreReportProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
  onRetakeWrongOnly?: () => void;
  wrongCount: number;
  onOpenWrongNotes: () => void;
  savedNotesCount: number;
}

export const ScoreReport: React.FC<ScoreReportProps> = ({
  score,
  correctCount,
  totalQuestions,
  onRestart,
  onRetakeWrongOnly,
  wrongCount,
  onOpenWrongNotes,
  savedNotesCount
}) => {
  const isPass = score >= 60;

  useEffect(() => {
    if (isPass) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPass]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 mb-8 overflow-hidden relative">
      {/* Background ambient decoration */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -z-10 opacity-20 pointer-events-none ${
          isPass ? 'bg-emerald-400' : 'bg-rose-400'
        }`}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Score & Pass Status */}
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center border shadow-inner ${
              isPass
                ? 'bg-emerald-500/10 border-emerald-400 text-emerald-700'
                : 'bg-rose-500/10 border-rose-400 text-rose-700'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black tracking-tight">{score}</span>
            <span className="text-xs font-semibold uppercase tracking-wider mt-0.5">/ 100점</span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isPass
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isPass ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> 합격 기준 달성 (60점 이상)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> 불합격 (60점 미만, 복습 필요)
                  </>
                )}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {isPass ? '합격 안정권입니다! 축하합니다 🎉' : '조금만 더 복습해보세요! 💪'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              총 {totalQuestions}문항 중 정답 <strong className="text-emerald-600 font-bold">{correctCount}</strong>개, 오답 <strong className="text-rose-600 font-bold">{wrongCount}</strong>개
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
          {wrongCount > 0 && onRetakeWrongOnly && (
            <button
              onClick={onRetakeWrongOnly}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4" /> 틀린 {wrongCount}문제만 다시 풀기
            </button>
          )}

          <button
            onClick={onRestart}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> 새 10문제 생성하여 풀기
          </button>

          <button
            onClick={onOpenWrongNotes}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            오답노트 ({savedNotesCount})
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> 아래에서 각 문항별 모범 정답 및 해설을 확인하세요.
        </span>
        <span>배점: 문항당 10점</span>
      </div>
    </div>
  );
};
