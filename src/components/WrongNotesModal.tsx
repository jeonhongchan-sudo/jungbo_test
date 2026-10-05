import React, { useRef, useState } from 'react';
import { Question, WrongNoteItem } from '../types/quiz';
import {
  X,
  Trash2,
  BookmarkCheck,
  PlayCircle,
  Download,
  Upload,
  Search,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Flame
} from 'lucide-react';
import {
  exportWrongNotesToJson,
  importWrongNotesFromJson
} from '../utils/wrongNoteStorage';

interface WrongNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: WrongNoteItem[];
  onRemoveQuestion: (id: string) => void;
  onClearAll: () => void;
  onStartQuizWithSaved: (questions: Question[]) => void;
  onRefreshNotes: () => void;
}

export const WrongNotesModal: React.FC<WrongNotesModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onRemoveQuestion,
  onClearAll,
  onStartQuizWithSaved,
  onRefreshNotes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    exportWrongNotesToJson();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importWrongNotesFromJson(content);
      if (res.success) {
        setImportStatus({ type: 'success', message: res.message });
        onRefreshNotes();
      } else {
        setImportStatus({ type: 'error', message: res.message });
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
                  누적 오답노트 & 복습 보관함
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                  총 {savedNotes.length}문항
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                시험 제출 시 틀린 문제가 자동 누적되며, 로컬 JSON 파일로 영구 백업 및 복원이 가능합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Search Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="문제 또는 정답 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
            />
          </div>

          {/* Export / Import Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="로컬 JSON 파일에서 오답노트 불러오기"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              JSON 불러오기
            </button>

            <button
              onClick={handleExport}
              disabled={savedNotes.length === 0}
              title="현재 오답노트를 JSON 파일로 내 PC에 저장"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors shadow-2xs ${
                savedNotes.length > 0
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              JSON 저장(백업)
            </button>
          </div>
        </div>

        {/* Status message on import */}
        {importStatus && (
          <div
            className={`px-5 py-2 text-xs flex items-center gap-2 ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
                : 'bg-rose-50 text-rose-800 border-b border-rose-100'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Notes List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {savedNotes.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BookmarkCheck className="w-14 h-14 mx-auto mb-3 opacity-20 text-slate-600" />
              <p className="font-bold text-base text-slate-600">
                아직 저장된 오답노트가 없습니다.
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                10문제를 풀고 제출하면 틀린 문제들이 자동으로 이곳에 기록되며, 언제든 JSON 파일로 저장하거나 불러올 수 있습니다.
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
                        {q.importance}
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
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="오답노트에서 삭제"
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
                      {q.acceptedAnswers.length > 0 && (
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
                if (window.confirm('오답노트의 모든 문제를 삭제하시겠습니까?')) {
                  onClearAll();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              전체 비우기
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  const sampled = savedNotes.map((n) => n.question).slice(0, 10);
                  onStartQuizWithSaved(sampled);
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                오답노트 10문제 집중 풀기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
