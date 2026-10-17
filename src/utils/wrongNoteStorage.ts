import { Question, WrongNoteItem } from '../types/quiz';

const STORAGE_KEY = 'infogisa_wrong_notes_v2';

/**
 * 로컬스토리지에서 오답노트 목록 불러오기
 */
export function getSavedWrongNotes(): WrongNoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load wrong notes:', e);
    return [];
  }
}

/**
 * 로컬스토리지에 오답노트 저장
 */
export function saveWrongNotes(notes: WrongNoteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save wrong notes:', e);
  }
}

/**
 * 시험 채점 후 오답들을 자동으로 누적 저장
 */
export function recordWrongQuestions(
  wrongList: { question: Question; userAnswer: string }[]
): WrongNoteItem[] {
  const current = getSavedWrongNotes();
  const map = new Map<string, WrongNoteItem>();

  current.forEach((item) => map.set(item.questionId, item));

  const now = new Date().toISOString();

  wrongList.forEach(({ question, userAnswer }) => {
    const existing = map.get(question.id);
    if (existing) {
      existing.wrongCount += 1;
      existing.lastWrongAnswer = userAnswer;
      existing.lastTestedAt = now;
      existing.question = question; // 최신 질문 데이터 동기화
    } else {
      map.set(question.id, {
        questionId: question.id,
        question,
        wrongCount: 1,
        lastWrongAnswer: userAnswer,
        lastTestedAt: now,
        isBookmarked: true
      });
    }
  });

  const updated = Array.from(map.values());
  saveWrongNotes(updated);
  return updated;
}

/**
 * 오답노트에 있던 문제 중 정답을 맞힌 문제를 오답노트에서 자동 삭제
 * (오답노트에서 다시 풀거나 일반 시험에서 정답 처리된 문제)
 */
export function removeCorrectQuestions(correctQuestionIds: string[]): {
  updatedNotes: WrongNoteItem[];
  removedCount: number;
} {
  if (!correctQuestionIds || correctQuestionIds.length === 0) {
    const current = getSavedWrongNotes();
    return { updatedNotes: current, removedCount: 0 };
  }

  const current = getSavedWrongNotes();
  const correctSet = new Set(correctQuestionIds);
  const updatedNotes = current.filter((item) => !correctSet.has(item.questionId));
  const removedCount = current.length - updatedNotes.length;

  if (removedCount > 0) {
    saveWrongNotes(updatedNotes);
  }

  return { updatedNotes, removedCount };
}

/**
 * 수동 북마크 토글
 */
export function toggleWrongNoteBookmark(question: Question): WrongNoteItem[] {
  const current = getSavedWrongNotes();
  const idx = current.findIndex((item) => item.questionId === question.id);

  if (idx >= 0) {
    current[idx].isBookmarked = !current[idx].isBookmarked;
  } else {
    current.push({
      questionId: question.id,
      question,
      wrongCount: 0,
      lastWrongAnswer: '',
      lastTestedAt: new Date().toISOString(),
      isBookmarked: true
    });
  }

  saveWrongNotes(current);
  return current;
}

/**
 * 특정 문제 오답노트에서 삭제
 */
export function removeWrongNote(questionId: string): WrongNoteItem[] {
  const current = getSavedWrongNotes();
  const filtered = current.filter((item) => item.questionId !== questionId);
  saveWrongNotes(filtered);
  return filtered;
}

/**
 * 전체 오답노트 비우기
 */
export function clearAllWrongNotes(): void {
  localStorage.removeItem(STORAGE_KEY);
}
