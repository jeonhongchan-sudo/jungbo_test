import React, { useState, useEffect, useMemo } from 'react';
import { ALL_CODE_DEBUG_QUESTIONS } from '../data/codeDebugQuestions';
import { CodeDebugQuestion, CodeLanguage, CodeLabProgress } from '../types/codeDebug';
import { CodeDebuggerViewer } from './CodeDebuggerViewer';
import {
  Code2,
  Database,
  CheckCircle2,
  XCircle,
  Bookmark,
  Sparkles,
  Shuffle,
  HelpCircle,
  Eye,
  EyeOff,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'infogisa_codelab_progress_v2';

export const CodeLabView: React.FC = () => {
  // Load saved progress from localStorage
  const [progress, setProgress] = useState<CodeLabProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : { solvedQuestions: {}, bookmarkedIds: [] };
    } catch {
      return { solvedQuestions: {}, bookmarkedIds: [] };
    }
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save code lab progress', e);
    }
  }, [progress]);

  // Selected Language Mode
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage | 'ALL'>('ALL');

  // Active Question - Initially picked completely at random
  const [activeQuestionId, setActiveQuestionId] = useState<string>(() => {
    const randIdx = Math.floor(Math.random() * ALL_CODE_DEBUG_QUESTIONS.length);
    return ALL_CODE_DEBUG_QUESTIONS[randIdx]?.id || ALL_CODE_DEBUG_QUESTIONS[0]?.id;
  });

  // User Answer and Debugger State
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showDebugger, setShowDebugger] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Language count helpers
  const countByLang = useMemo(() => {
    const counts = { C: 0, JAVA: 0, PYTHON: 0, SQL: 0 };
    ALL_CODE_DEBUG_QUESTIONS.forEach((q) => {
      counts[q.language]++;
    });
    return counts;
  }, []);

  // Current active question
  const currentQuestion: CodeDebugQuestion = useMemo(() => {
    const found = ALL_CODE_DEBUG_QUESTIONS.find((q) => q.id === activeQuestionId);
    return found || ALL_CODE_DEBUG_QUESTIONS[0];
  }, [activeQuestionId]);

  // Sync answer input when changing active question
  useEffect(() => {
    const solved = progress.solvedQuestions[currentQuestion.id];
    if (solved) {
      setUserAnswer(solved.userAnswer);
      setShowDebugger(true);
    } else {
      setUserAnswer('');
      setShowDebugger(false);
    }
    setShowHint(false);
  }, [currentQuestion.id, progress.solvedQuestions]);

  // Pick a random question function
  const pickRandomQuestion = (lang: CodeLanguage | 'ALL' = selectedLanguage) => {
    let pool = ALL_CODE_DEBUG_QUESTIONS;
    if (lang !== 'ALL') {
      pool = pool.filter((q) => q.language === lang);
    }
    if (pool.length === 0) pool = ALL_CODE_DEBUG_QUESTIONS;

    // Exclude current question so a different question is picked if available
    const candidates = pool.filter((q) => q.id !== currentQuestion.id);
    const finalPool = candidates.length > 0 ? candidates : pool;
    const target = finalPool[Math.floor(Math.random() * finalPool.length)];

    if (target) {
      setActiveQuestionId(target.id);
    }
  };

  // Switch language mode and immediately draw a random question
  const handleSelectLanguage = (lang: CodeLanguage | 'ALL') => {
    setSelectedLanguage(lang);
    pickRandomQuestion(lang);
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setProgress((prev) => {
      const isBookmarked = prev.bookmarkedIds.includes(id);
      return {
        ...prev,
        bookmarkedIds: isBookmarked
          ? prev.bookmarkedIds.filter((bId) => bId !== id)
          : [...prev.bookmarkedIds, id]
      };
    });
  };

  // Grade user answer
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const normalizedUser = userAnswer.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
    const normalizedExpected = currentQuestion.expectedAnswer.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');

    let isCorrect = normalizedUser.toLowerCase() === normalizedExpected.toLowerCase();

    if (!isCorrect && currentQuestion.acceptedAnswers) {
      isCorrect = currentQuestion.acceptedAnswers.some((ans) => {
        const norm = ans.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
        return normalizedUser.toLowerCase() === norm.toLowerCase();
      });
    }

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setProgress((prev) => ({
      ...prev,
      solvedQuestions: {
        ...prev.solvedQuestions,
        [currentQuestion.id]: {
          isCorrect,
          userAnswer: userAnswer.trim(),
          solvedAt: new Date().toISOString()
        }
      }
    }));

    // Automatically open debugger to show execution trace
    setShowDebugger(true);
  };

  // Language badge styling helper
  const getLanguageBadge = (lang: CodeLanguage) => {
    switch (lang) {
      case 'C':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'JAVA':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PYTHON':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SQL':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  const currentSolvedRecord = progress.solvedQuestions[currentQuestion.id];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>정보처리기사 실기 합격 완성 전용관</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              고난도 프로그래밍 & SQL 인터랙티브 디버거 랩
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              가상 메모리 주소(1000번지, 2000번지)와 변수 변화, 재귀 호출 스택을 
              <strong> 이전 / 다음 단계 버튼</strong>으로 한 줄씩 시각화하여 디버깅할 수 있습니다.
              전체화면 모드를 통해 모바일·태블릿에서도 몰입감 있게 학습하세요.
            </p>

            {/* Quick Random Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => pickRandomQuestion(selectedLanguage)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Shuffle className="w-4 h-4" />
                <span>🎲 다음 랜덤 문제 뽑기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Language Category Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectLanguage('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLanguage === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            전체 랜덤 ({ALL_CODE_DEBUG_QUESTIONS.length})
          </button>
          <button
            onClick={() => handleSelectLanguage('C')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLanguage === 'C'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>C 언어 (포인터·배열·재귀)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-200">
              {countByLang.C}
            </span>
          </button>
          <button
            onClick={() => handleSelectLanguage('JAVA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLanguage === 'JAVA'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Java (상속·다형성·static)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-200">
              {countByLang.JAVA}
            </span>
          </button>
          <button
            onClick={() => handleSelectLanguage('PYTHON')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLanguage === 'PYTHON'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Python (슬라이싱·컴프리헨션)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-200">
              {countByLang.PYTHON}
            </span>
          </button>
          <button
            onClick={() => handleSelectLanguage('SQL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLanguage === 'SQL'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL (조인·HAVING·윈도우)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-200">
              {countByLang.SQL}
            </span>
          </button>
        </div>
      </div>

      {/* Main Single Problem Card (Focused Full Width) */}
      <div className="w-full max-w-5xl mx-auto space-y-4">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-md space-y-5">
          {/* Question Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${getLanguageBadge(
                  currentQuestion.language
                )}`}
              >
                {currentQuestion.language}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                {currentQuestion.topic}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  currentQuestion.difficulty === '최상'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                난이도 {currentQuestion.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => pickRandomQuestion(selectedLanguage)}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer"
                title="다른 랜덤 문제로 이동"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>다음 랜덤 🎲</span>
              </button>

              <button
                onClick={() => toggleBookmark(currentQuestion.id)}
                type="button"
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  progress.bookmarkedIds.includes(currentQuestion.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
                }`}
                title="북마크 토글"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    progress.bookmarkedIds.includes(currentQuestion.id)
                      ? 'fill-amber-500'
                      : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Question Title & Prompt */}
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {currentQuestion.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
              {currentQuestion.questionPrompt}
            </p>
          </div>

          {/* Code Box */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-100 border border-slate-800 shadow-inner overflow-x-auto select-text">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Code Snippet ({currentQuestion.language})</span>
              </div>
              <span className="text-slate-500 text-[11px]">정보처리기사 실기 기출 표준</span>
            </div>
            <pre className="leading-relaxed whitespace-pre font-mono">
              {currentQuestion.code}
            </pre>
          </div>

          {/* Answer Input and Grading Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              실행 결과 답안 입력 (출력문 또는 최종 반환값을 기재하세요)
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitAnswer();
                }}
                placeholder="예: 25 또는 ABC 또는 결과값"
                className="flex-1 px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder-slate-400 font-mono shadow-xs"
              />
              <button
                onClick={handleSubmitAnswer}
                type="button"
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                정답 채점하기
              </button>
            </div>

            {/* Status Alert if Solved */}
            {currentSolvedRecord && (
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  currentSolvedRecord.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  {currentSolvedRecord.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs sm:text-sm font-bold">
                      {currentSolvedRecord.isCorrect
                        ? '정답입니다! 코드 실행 원리를 정확히 파악하셨습니다. 🎉'
                        : '오답입니다. 아래 단계별 메모리 디버깅 과정을 확인해보세요!'}
                    </div>
                    <div className="text-xs mt-1.5">
                      <span className="font-semibold text-slate-600">공식 정답: </span>
                      <code className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono font-bold text-slate-900">
                        {currentQuestion.expectedAnswer}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => pickRandomQuestion(selectedLanguage)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>다음 랜덤 문제 풀기 ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* Debugger & Hint Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDebugger(!showDebugger)}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  {showDebugger ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>
                    {showDebugger ? '인터랙티브 디버깅 해설 접기' : '단계별 메모리 디버깅 해설 펼치기'}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setShowHint(!showHint)}
                type="button"
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>풀이 힌트 확인</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong className="font-bold mr-1">💡 문제 풀이 힌트:</strong>
                {currentQuestion.keyTakeaway}
              </div>
            )}
          </div>

          {/* Step-by-Step Interactive Debugger Viewer */}
          {showDebugger && (
            <div className="pt-2 animate-in fade-in duration-200">
              <CodeDebuggerViewer question={currentQuestion} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
