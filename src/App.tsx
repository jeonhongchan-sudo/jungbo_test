/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Question, ChapterCategory, WrongNoteItem } from './types/quiz';
import { generate10Questions, ALL_QUESTIONS, shuffleArray } from './data/questions';
import { ALL_CODE_DEBUG_QUESTIONS } from './data/codeDebugQuestions';
import { gradeAnswer } from './utils/grader';
import {
  getSavedWrongNotes,
  recordWrongQuestions,
  removeCorrectQuestions,
  toggleWrongNoteBookmark,
  removeWrongNote,
  clearAllWrongNotes
} from './utils/wrongNoteStorage';
import { Header } from './components/Header';
import { ExamControls } from './components/ExamControls';
import { QuestionNav } from './components/QuestionNav';
import { QuizCard } from './components/QuizCard';
import { ScoreReport } from './components/ScoreReport';
import { WrongNotesModal } from './components/WrongNotesModal';
import { StatisticsModal } from './components/StatisticsModal';
import { CodeLabView } from './components/CodeLabView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Sparkles, CheckCircle2, Bookmark, BarChart3 } from 'lucide-react';

const TIMER_INITIAL_SECONDS = 15 * 60; // 15분

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'EXAM' | 'CODELAB'>('EXAM');

  // Session State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Filters and Options
  const [selectedChapter, setSelectedChapter] = useState<ChapterCategory>('ALL');
  const [onlyAImportance, setOnlyAImportance] = useState<boolean>(false);
  const [isWrongNotesMode, setIsWrongNotesMode] = useState<boolean>(false);

  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_INITIAL_SECONDS);

  // Wrong Notes State (Persistent)
  const [savedNotes, setSavedNotes] = useState<WrongNoteItem[]>(() => {
    return getSavedWrongNotes();
  });
  const [graduatedNotesCount, setGraduatedNotesCount] = useState<number>(0);

  // Exam History State
  const [examHistory, setExamHistory] = useState<{ round: number; score: number }[]>(() => {
    try {
      const saved = localStorage.getItem('infogisa_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [isWrongNotesOpen, setIsWrongNotesOpen] = useState<boolean>(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState<boolean>(false);

  // Refresh wrong notes from storage
  const refreshWrongNotes = useCallback(() => {
    setSavedNotes(getSavedWrongNotes());
  }, []);

  // 10문제 생성 함수
  const loadNew10Questions = useCallback(
    (chapter = selectedChapter, onlyA = onlyAImportance) => {
      const new10 = generate10Questions(chapter, onlyA);
      setQuestions(new10);
      setUserAnswers({});
      setIsSubmitted(false);
      setScore(0);
      setCorrectCount(0);
      setGraduatedNotesCount(0);
      setIsWrongNotesMode(false);
      setTimeLeft(TIMER_INITIAL_SECONDS);
      // 스크롤 상단 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedChapter, onlyAImportance]
  );

  // 초기 로딩 시 10문제 생성
  useEffect(() => {
    loadNew10Questions();
  }, [loadNew10Questions]);

  // 타이머 로직
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, isSubmitted, timeLeft]);

  // 답안 변경 핸들러
  const handleAnswerChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 북마크 토글
  const handleToggleBookmark = (question: Question) => {
    const updated = toggleWrongNoteBookmark(question);
    setSavedNotes(updated);
  };

  // 답안 제출 및 자동 채점
  const handleSubmitExam = () => {
    let correct = 0;
    const correctQuestionIds: string[] = [];
    const wrongItems: { question: Question; userAnswer: string }[] = [];

    questions.forEach((q) => {
      const ans = userAnswers[q.id] || '';
      if (gradeAnswer(ans, q)) {
        correct += 1;
        correctQuestionIds.push(q.id);
      } else {
        wrongItems.push({ question: q, userAnswer: ans.trim() || '(미입력)' });
      }
    });

    const calculatedScore = correct * 10;
    setCorrectCount(correct);
    setScore(calculatedScore);
    setIsSubmitted(true);
    setIsTimerRunning(false);

    // 1. 맞힌 문제: 오답노트에 존재하던 문제라면 오답노트에서 자동으로 삭제 (마스터 처리)
    let currentNotes = getSavedWrongNotes();
    let removedCount = 0;
    if (correctQuestionIds.length > 0) {
      const res = removeCorrectQuestions(correctQuestionIds);
      currentNotes = res.updatedNotes;
      removedCount = res.removedCount;
    }
    setGraduatedNotesCount(removedCount);

    // 2. 틀린 문제: 오답노트에 자동 누적 저장
    if (wrongItems.length > 0) {
      currentNotes = recordWrongQuestions(wrongItems);
    }

    setSavedNotes(currentNotes);

    // 응시 기록 업데이트
    const newHistory = [
      ...examHistory,
      { round: examHistory.length + 1, score: calculatedScore }
    ];
    setExamHistory(newHistory);
    localStorage.setItem('infogisa_history_v2', JSON.stringify(newHistory));

    // 점수 영역으로 스크롤 이동
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // 틀린 문제만 다시 풀기
  const handleRetakeWrongOnly = () => {
    const wrongList = questions.filter(
      (q) => !gradeAnswer(userAnswers[q.id] || '', q)
    );
    if (wrongList.length === 0) return;

    setQuestions(wrongList);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCorrectCount(0);
    setGraduatedNotesCount(0);
    setIsWrongNotesMode(true);
    setTimeLeft(TIMER_INITIAL_SECONDS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 보관된 오답 문제로 시험 시작 (10문제 집중 풀기)
  const handleStartWithSaved = (savedList: Question[]) => {
    if (savedList.length === 0) return;
    setQuestions(savedList);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCorrectCount(0);
    setGraduatedNotesCount(0);
    setIsWrongNotesMode(true);
    setTimeLeft(TIMER_INITIAL_SECONDS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 특정 단원 10문제 풀기 (통계 모달 등에서 호출)
  const handleStartChapterQuiz = (chapter: ChapterCategory) => {
    setSelectedChapter(chapter);
    loadNew10Questions(chapter, onlyAImportance);
  };

  // 오답노트에서 특정 문제 수동 삭제
  const handleRemoveWrongNote = (questionId: string) => {
    const updated = removeWrongNote(questionId);
    setSavedNotes(updated);
  };

  // 오답노트 전체 삭제
  const handleClearAllWrongNotes = () => {
    clearAllWrongNotes();
    setSavedNotes([]);
  };

  // 특정 문항으로 스크롤
  const scrollToQuestion = (idx: number) => {
    const el = document.getElementById(`question-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 엔터 키 누를 때 다음 문제로 스크롤 포커스 이동
  const handleEnterNext = (idx: number) => {
    if (idx < questions.length - 1) {
      scrollToQuestion(idx + 1);
    }
  };

  const answeredCount = questions.filter((q) => userAnswers[q.id]?.trim()).length;
  const wrongCount = questions.length - correctCount;

  const averageScore =
    examHistory.length > 0
      ? Math.round(
          examHistory.reduce((acc, cur) => acc + cur.score, 0) / examHistory.length
        )
      : 0;

  const isBookmarkedMap = new Map<string, boolean>();
  savedNotes.forEach((item) => {
    if (item.isBookmarked) isBookmarkedMap.set(item.questionId, true);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRound={examHistory.length}
        totalSolved={examHistory.length * 10}
        averageScore={averageScore}
        totalQuestionPool={ALL_QUESTIONS.length}
        wrongNotesCount={savedNotes.length}
        codeLabCount={ALL_CODE_DEBUG_QUESTIONS.length}
        onOpenWrongNotes={() => setIsWrongNotesOpen(true)}
        onOpenStatistics={() => setIsStatisticsOpen(true)}
      />

      {activeTab === 'CODELAB' ? (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
          <CodeLabView />
        </main>
      ) : (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
          {/* Exam Score Report Banner (when submitted) */}
          {isSubmitted && (
          <ScoreReport
            score={score}
            correctCount={correctCount}
            totalQuestions={questions.length}
            wrongCount={wrongCount}
            onRestart={() => loadNew10Questions(selectedChapter, onlyAImportance)}
            onRetakeWrongOnly={wrongCount > 0 ? handleRetakeWrongOnly : undefined}
            onOpenWrongNotes={() => setIsWrongNotesOpen(true)}
            onOpenStatistics={() => setIsStatisticsOpen(true)}
            savedNotesCount={savedNotes.length}
            graduatedNotesCount={graduatedNotesCount}
          />
        )}

        {/* Top Control Bar */}
        <ExamControls
          selectedChapter={selectedChapter}
          onSelectChapter={(ch) => {
            setSelectedChapter(ch);
            loadNew10Questions(ch, onlyAImportance);
          }}
          onlyAImportance={onlyAImportance}
          onToggleOnlyA={() => {
            const nextOnlyA = !onlyAImportance;
            setOnlyAImportance(nextOnlyA);
            loadNew10Questions(selectedChapter, nextOnlyA);
          }}
          onGenerateNewExam={() => loadNew10Questions(selectedChapter, onlyAImportance)}
          answeredCount={answeredCount}
          totalQuestions={questions.length}
          onSubmitExam={handleSubmitExam}
          isSubmitted={isSubmitted}
          timeLeft={timeLeft}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning((prev) => !prev)}
          savedNotesCount={savedNotes.length}
          onOpenWrongNotes={() => setIsWrongNotesOpen(true)}
          onOpenStatistics={() => setIsStatisticsOpen(true)}
          isWrongNotesMode={isWrongNotesMode}
        />

        {/* Quick Navigation for Questions */}
        {questions.length > 0 && (
          <QuestionNav
            questions={questions}
            userAnswers={userAnswers}
            isSubmitted={isSubmitted}
            onScrollToQuestion={scrollToQuestion}
          />
        )}

        {/* Question Cards (1 to 10) */}
        <div className="space-y-5">
          {questions.map((q, idx) => (
            <QuizCard
              key={q.id}
              index={idx}
              question={q}
              userAnswer={userAnswers[q.id] || ''}
              onChangeAnswer={(val) => handleAnswerChange(q.id, val)}
              isSubmitted={isSubmitted}
              isBookmarked={Boolean(isBookmarkedMap.get(q.id))}
              onToggleBookmark={() => handleToggleBookmark(q)}
              onEnterPress={() => handleEnterNext(idx)}
            />
          ))}
        </div>

        {/* Bottom Submission & Retake Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs sm:text-sm text-slate-500">
            {!isSubmitted ? (
              <span>
                원하는 문제까지 답안을 작성한 뒤 언제든 <strong className="text-indigo-600 font-semibold">답안 제출</strong> 버튼을 누르면 실시간 자동 채점됩니다. (공란은 오답 처리 및 오답노트에 자동 기록)
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                채점 완료: 100점 만점 중 <strong>{score}점</strong> 획득
                {graduatedNotesCount > 0 && (
                  <span className="ml-1 text-emerald-800 font-bold">
                    (맞힌 {graduatedNotesCount}문제 오답노트에서 자동 제거 완료)
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitExam}
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                답안 제출 및 자동 채점
              </button>
            ) : (
              <button
                onClick={() => loadNew10Questions()}
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                새로운 10문제 생성
              </button>
            )}
          </div>
        </div>
      </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <p>2025~2026 정보처리기사 실기 기출 및 핵심요약 기반 실전 500제 트레이너 ({ALL_QUESTIONS.length}문항 수록)</p>
        <p className="mt-1 text-slate-400">오답노트 브라우저 자동 안전 저장 및 취약점 분석 통계 그래프 지원</p>
      </footer>

      {/* Wrong Notes & Bookmark Modal */}
      <WrongNotesModal
        isOpen={isWrongNotesOpen}
        onClose={() => setIsWrongNotesOpen(false)}
        savedNotes={savedNotes}
        onRemoveQuestion={handleRemoveWrongNote}
        onClearAll={handleClearAllWrongNotes}
        onStartQuizWithSaved={handleStartWithSaved}
        onOpenStatistics={() => setIsStatisticsOpen(true)}
      />

      {/* Statistics & Weakness Analytics Modal */}
      <StatisticsModal
        isOpen={isStatisticsOpen}
        onClose={() => setIsStatisticsOpen(false)}
        savedNotes={savedNotes}
        onStartChapterQuiz={handleStartChapterQuiz}
        onStartWrongNotesQuiz={() => {
          const sampled = shuffleArray(savedNotes.map((n) => n.question)).slice(0, 10);
          handleStartWithSaved(sampled);
        }}
      />

      {/* Offline Mode Alert */}
      <OfflineIndicator />
    </div>
  );
}
