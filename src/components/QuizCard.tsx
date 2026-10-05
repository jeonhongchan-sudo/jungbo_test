import React, { useRef, useEffect } from 'react';
import { Question } from '../types/quiz';
import { Check, X, Bookmark, BookmarkCheck, HelpCircle } from 'lucide-react';
import { gradeAnswer } from '../utils/grader';

interface QuizCardProps {
  index: number;
  question: Question;
  userAnswer: string;
  onChangeAnswer: (value: string) => void;
  isSubmitted: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onEnterPress?: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  index,
  question,
  userAnswer,
  onChangeAnswer,
  isSubmitted,
  isBookmarked,
  onToggleBookmark,
  onEnterPress
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isCorrect = isSubmitted ? gradeAnswer(userAnswer, question) : false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnterPress) {
        onEnterPress();
      }
    }
  };

  // Importance color styling
  const getBadgeColor = (imp: string) => {
    switch (imp) {
      case 'A':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'B':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Type label helper
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CODE':
        return { label: '실행 결과 예측', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'CALC':
        return { label: '계산식/수치형', style: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'BLANK':
        return { label: '빈칸/괄호 채우기', style: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: '용어 단답형', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
  };

  const typeInfo = getTypeBadge(question.questionType || 'TERM');

  return (
    <div
      id={`question-${index}`}
      className={`rounded-2xl transition-all duration-200 border p-5 sm:p-6 bg-white shadow-xs ${
        isSubmitted
          ? isCorrect
            ? 'border-emerald-300 ring-2 ring-emerald-500/10'
            : 'border-rose-300 ring-2 ring-rose-500/10'
          : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center flex-wrap gap-2">
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
            {index + 1}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${typeInfo.style}`}>
            {typeInfo.label}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            {question.chapterTitle}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getBadgeColor(question.importance)}`}>
            중요도 {question.importance}
          </span>
          {question.frequency && (
            <span className="text-[11px] text-slate-600 hidden md:inline-block">
              {question.frequency}
            </span>
          )}
        </div>

        {/* Bookmark button */}
        <button
          onClick={onToggleBookmark}
          type="button"
          title={isBookmarked ? '오답노트 보관 중' : '오답노트에 추가'}
          className={`p-2 rounded-lg transition-colors ${
            isBookmarked
              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
              : 'text-slate-500 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-600" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Question Prompt */}
      <div className="mb-4">
        <h3 className="text-slate-900 font-medium text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {question.question}
        </h3>
      </div>

      {/* Code Snippet if any */}
      {question.codeSnippet && (
        <div className="mb-4 rounded-xl bg-slate-900 p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto">
          <pre>{question.codeSnippet}</pre>
        </div>
      )}

      {/* Answer Input Section */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>정답 기입 (단답식 용어)</span>
          {!isSubmitted && userAnswer.trim() && (
            <span className="text-[11px] font-normal text-indigo-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> 입력 완료
            </span>
          )}
        </label>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            disabled={isSubmitted}
            value={userAnswer}
            onChange={(e) => onChangeAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isSubmitted ? '' : '용어 또는 명칭을 기입하세요 (한글 또는 영문 약어)'}
            className={`w-full px-4 py-3 rounded-xl text-base font-medium transition-all outline-hidden border ${
              isSubmitted
                ? isCorrect
                  ? 'bg-emerald-50/60 border-emerald-400 text-emerald-950 font-bold'
                  : 'bg-rose-50/60 border-rose-400 text-rose-950 line-through'
                : 'bg-white border-slate-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/15'
            }`}
          />
          {isSubmitted && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isCorrect ? (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  <Check className="w-4 h-4 stroke-[3]" /> 정답 (+10점)
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md">
                  <X className="w-4 h-4 stroke-[3]" /> 오답
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* After Submission: Detailed Review */}
      {isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex flex-wrap items-baseline gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700">모범 정답:</span>
            <span className="text-sm font-bold text-indigo-700">
              {question.standardAnswer}
            </span>
            {question.acceptedAnswers.length > 0 && (
              <span className="text-xs text-slate-500">
                (허용 정답: {question.acceptedAnswers.join(', ')})
              </span>
            )}
          </div>

          <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 text-xs sm:text-sm text-slate-700">
            <div className="font-semibold text-blue-900 mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> 해설 & 핵심 암기 포인트
            </div>
            <p className="leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
