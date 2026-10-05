/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Question, ChapterCategory, WrongNoteItem } from './types/quiz';
import { generate10Questions, ALL_QUESTIONS } from './data/questions';
import { gradeAnswer } from './utils/grader';
import {
  getSavedWrongNotes,
  recordWrongQuestions,
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
import { Sparkles, CheckCircle2, Bookmark, Download } from 'lucide-react';

const TIMER_INITIAL_SECONDS = 15 * 60; // 15분

export default function App() {
  // Session State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Filters and Options
  const [selectedChapter, setSelectedChapter] = useState<ChapterCategory>('ALL');
  const [onlyAImportance, setOnlyAImportance] = useState<boolean>(false);

  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_INITIAL_SECONDS);

  // Wrong Notes State (Persistent)
  const [savedNotes, setSavedNotes] = useState<WrongNoteItem[]>(() => {
    return getSavedWrongNotes();
  });

  // Exam History State
  const [examHistory, setExamHistory] = useState<{ round: number; score: number }[]>(() => {
    try {
      const saved = localStorage.getItem('infogisa_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWrongNotesOpen, setIsWrongNotesOpen] = useState<boolean>(false);

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
            // 시간 종료 시 자동 채점
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
    const wrongItems: { question: Question; userAnswer: string }[] = [];

    questions.forEach((q) => {
      const ans = userAnswers[q.id] || '';
      if (gradeAnswer(ans, q)) {
        correct += 1;
      } else {
        wrongItems.push({ question: q, userAnswer: ans.trim() || '(미입력)' });
      }
    });

    const calculatedScore = correct * 10;
    setCorrectCount(correct);
    setScore(calculatedScore);
    setIsSubmitted(true);
    setIsTimerRunning(false);

    // 오답 자동 누적 저장 (사용자가 틀린 문제 및 미입력 문제는 자동으로 오답노트에 추가/누적됨)
    if (wrongItems.length > 0) {
      const updatedNotes = recordWrongQuestions(wrongItems);
      setSavedNotes(updatedNotes);
    }

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
    setTimeLeft(TIMER_INITIAL_SECONDS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 보관된 오답 문제로 시험 시작
  const handleStartWithSaved = (savedList: Question[]) => {
    if (savedList.length === 0) return;
    setQuestions(savedList);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCorrectCount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 오답노트에서 특정 문제 삭제
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
        currentRound={examHistory.length}
        totalSolved={examHistory.length * 10}
        averageScore={averageScore}
        totalQuestionPool={ALL_QUESTIONS.length}
        wrongNotesCount={savedNotes.length}
        onOpenWrongNotes={() => setIsWrongNotesOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {/* Exam Score Report Banner (when submitted) */}
        {isSubmitted && (
          <ScoreReport
            score={score}
            correctCount={correctCount}
            totalQuestions={questions.length}
            wrongCount={wrongCount}
            onRestart={() => loadNew10Questions()}
            onRetakeWrongOnly={wrongCount > 0 ? handleRetakeWrongOnly : undefined}
            onOpenWrongNotes={() => setIsWrongNotesOpen(true)}
            savedNotesCount={savedNotes.length}
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
          onGenerateNewExam={() => loadNew10Questions()}
          answeredCount={answeredCount}
          totalQuestions={questions.length}
          onSubmitExam={handleSubmitExam}
          isSubmitted={isSubmitted}
          timeLeft={timeLeft}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning((prev) => !prev)}
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
                채점 완료: 100점 만점 중 <strong>{score}점</strong> 획득 (틀린/미입력 {wrongCount}문제는 오답노트에 안전하게 저장되었습니다)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitExam}
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                답안 제출 및 자동 채점
              </button>
            ) : (
              <button
                onClick={() => loadNew10Questions()}
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                새로운 10문제 생성
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <p>2025~2026 정보처리기사 실기 기출 및 핵심요약 기반 실전 300제 트레이너</p>
        <p className="mt-1 text-slate-400">오답노트 로컬 JSON 파일 내보내기/불러오기 영구 저장 지원</p>
      </footer>

      {/* Wrong Notes & Bookmark Modal */}
      <WrongNotesModal
        isOpen={isWrongNotesOpen}
        onClose={() => setIsWrongNotesOpen(false)}
        savedNotes={savedNotes}
        onRemoveQuestion={handleRemoveWrongNote}
        onClearAll={handleClearAllWrongNotes}
        onStartQuizWithSaved={handleStartWithSaved}
        onRefreshNotes={refreshWrongNotes}
      />
    </div>
  );
}
