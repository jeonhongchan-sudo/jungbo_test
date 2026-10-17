import React, { useState } from 'react';
import { Question, WrongNoteItem } from '../types/quiz';
import {
  X,
  Trash2,
  BookmarkCheck,
  PlayCircle,
  Search,
  Flame,
  BarChart3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { shuffleArray } from '../data/questions';

interface WrongNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: WrongNoteItem[];
  onRemoveQuestion: (id: string) => void;
  onClearAll: () => void;
  onStartQuizWithSaved: (questions: Question[]) => void;
  onOpenStatistics: () => void;
}

export const WrongNotesModal: React.FC<WrongNotesModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onRemoveQuestion,
  onClearAll,
  onStartQuizWithSaved,
  onOpenStatistics
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredNotes = savedNotes.filter((note) => {
    const q = note.question;
    const term = searchTerm.toLowerCase();
    return (
      q.question.toLowerCase().includes(term) ||
      q.standardAnswer.toLowerCase().includes(term) ||
      q.chapterTitle.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg sm:text-xl text-slate-900">
                  누적 오답노트 & 취약점 관리
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                  총 {savedNotes.length}문항
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                틀린 문제는 자동 누적되며, 다시 풀어 맞히면 오답노트에서 자동으로 삭제되어 모르는 문제만 남습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Search Bar (Cleaned up: No JSON, added Stats button) */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="문제, 정답 또는 단원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
            />
          </div>

          {/* Quick Actions: Open Statistics */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenStatistics();
              }}
              title="단원별, 문제 유형별 오답 통계 그래프 보기"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              오답 분석 통계 그래프
            </button>
          </div>
        </div>

        {/* Smart Hint Bar */}
        <div className="px-5 py-2 bg-amber-50/70 border-b border-amber-100 text-[11px] text-amber-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>스마트 마스터 시스템</strong>: 아래 &apos;오답노트 10문제 집중 풀기&apos;로 문제를 풀어 맞히게 되면, 오답노트에서 자동으로 삭제(졸업)됩니다.
          </span>
        </div>

        {/* Notes List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {savedNotes.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-3 text-emerald-400 opacity-60" />
              <p className="font-bold text-base text-slate-700">
                현재 보관 중인 오답노트가 없습니다.
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                10문제를 풀고 제출 시 틀린 문제가 자동 보관되며, 다시 풀어서 맞히면 이곳에서 자동으로 삭제되어 진정한 취약점만 남게 됩니다.
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              검색 조건에 맞는 문제가 없습니다.
            </div>
          ) : (
            filteredNotes.map((item, idx) => {
              const q = item.question;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-all shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {q.chapterTitle}
                      </span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                        {q.importance}등급
                      </span>
                      {item.wrongCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                          <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
                          오답 {item.wrongCount}회
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveQuestion(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                      title="오답노트에서 수동 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                    {q.question}
                  </p>

                  {q.codeSnippet && (
                    <div className="rounded-xl bg-slate-900 p-3 text-emerald-400 font-mono text-xs overflow-x-auto">
                      <pre>{q.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Answers review box */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    {item.lastWrongAnswer && (
                      <div className="flex items-center gap-2 text-rose-600 font-medium">
                        <span className="font-bold">내가 적은 오답:</span>
                        <span className="line-through">{item.lastWrongAnswer}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-bold text-indigo-700">모범 정답:</span>
                      <strong className="text-slate-900">{q.standardAnswer}</strong>
                      {q.acceptedAnswers && q.acceptedAnswers.length > 0 && (
                        <span className="text-slate-500">
                          (허용 정답: {q.acceptedAnswers.join(', ')})
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 pt-1 border-t border-slate-200/60 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer */}
        {savedNotes.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                if (window.confirm('오답노트의 모든 문제를 완전히 비우시겠습니까?')) {
                  onClearAll();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              전체 비우기
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  const sampled = shuffleArray(savedNotes.map((n) => n.question)).slice(0, 10);
                  onStartQuizWithSaved(sampled);
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                오답노트 10문제 집중 풀기 (맞히면 삭제)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
