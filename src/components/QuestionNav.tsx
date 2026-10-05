import React from 'react';
import { Question } from '../types/quiz';
import { gradeAnswer } from '../utils/grader';
import { Check, X } from 'lucide-react';

interface QuestionNavProps {
  questions: Question[];
  userAnswers: Record<string, string>;
  isSubmitted: boolean;
  onScrollToQuestion: (index: number) => void;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  questions,
  userAnswers,
  isSubmitted,
  onScrollToQuestion
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
        <span>문항 빠른 이동:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {questions.map((q, idx) => {
          const hasAnswer = Boolean(userAnswers[q.id]?.trim());
          const isCorrect = isSubmitted ? gradeAnswer(userAnswers[q.id] || '', q) : false;

          let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
          if (!isSubmitted && hasAnswer) {
            btnClass = 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs';
          } else if (isSubmitted) {
            btnClass = isCorrect
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
              : 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => onScrollToQuestion(idx)}
              className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center border transition-all ${btnClass}`}
              title={`문제 ${idx + 1}번`}
            >
              {isSubmitted ? (
                isCorrect ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <X className="w-4 h-4 stroke-[3]" />
                )
              ) : (
                idx + 1
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
