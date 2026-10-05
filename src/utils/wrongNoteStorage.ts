import { Question, WrongNoteItem, WrongNotesExportData } from '../types/quiz';

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

/**
 * JSON 파일로 다운로드 (로컬 파일 저장)
 */
export function exportWrongNotesToJson(): void {
  const notes = getSavedWrongNotes();
  const exportData: WrongNotesExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalNotes: notes.length,
    notes
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `정보처리기사_실기_오답노트_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 로컬 JSON 파일로부터 오답노트 불러오기(가져오기 및 병합)
 */
export function importWrongNotesFromJson(jsonString: string): {
  success: boolean;
  count: number;
  message: string;
} {
  try {
    const data = JSON.parse(jsonString) as WrongNotesExportData;
    if (!data || !Array.isArray(data.notes)) {
      return { success: false, count: 0, message: '올바른 형식의 오답노트 JSON 파일이 아닙니다.' };
    }

    const current = getSavedWrongNotes();
    const map = new Map<string, WrongNoteItem>();

    current.forEach((item) => map.set(item.questionId, item));

    data.notes.forEach((item) => {
      if (item && item.questionId && item.question) {
        const existing = map.get(item.questionId);
        if (existing) {
          existing.wrongCount = Math.max(existing.wrongCount, item.wrongCount || 1);
          existing.lastWrongAnswer = item.lastWrongAnswer || existing.lastWrongAnswer;
          existing.isBookmarked = true;
        } else {
          map.set(item.questionId, {
            ...item,
            isBookmarked: true
          });
        }
      }
    });

    const merged = Array.from(map.values());
    saveWrongNotes(merged);
    return {
      success: true,
      count: data.notes.length,
      message: `성공적으로 ${data.notes.length}개의 오답노트를 불러와 병합했습니다.`
    };
  } catch (e: any) {
    return { success: false, count: 0, message: `파일 파싱 오류: ${e?.message || '알 수 없음'}` };
  }
}
