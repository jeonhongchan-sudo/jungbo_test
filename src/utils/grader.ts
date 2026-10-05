import { Question } from '../types/quiz';

/**
 * 사용자 입력 문자열을 정규화
 * - 앞뒤 및 연속 공백 정리
 * - 영문 소문자 변환
 * - 특수기호 괄호 등 정리
 */
export function normalizeAnswer(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    // 괄호 안 내용이나 괄호 자체 처리
    .replace(/[\s\-_/.,]+/g, '')
    .replace(/[()[\]{}]/g, '');
}

/**
 * 답안 채점 판정
 */
export function gradeAnswer(userAnswer: string, question: Question): boolean {
  if (!userAnswer || !userAnswer.trim()) return false;

  const normalizedUser = normalizeAnswer(userAnswer);
  if (!normalizedUser) return false;

  // 1. 기준 정답 검사
  if (normalizeAnswer(question.standardAnswer) === normalizedUser) {
    return true;
  }

  // 2. 허용 정답 목록 검사
  for (const alt of question.acceptedAnswers) {
    if (normalizeAnswer(alt) === normalizedUser) {
      return true;
    }
  }

  // 3. 한글(영문) 형태인 경우 양쪽 다 개별 비교
  // 예: "임의 접근 통제 (DAC)" -> "임의 접근 통제", "DAC" 모두 정답 인정
  const allCandidates = [question.standardAnswer, ...question.acceptedAnswers];
  for (const cand of allCandidates) {
    // 괄호 분리 패턴: "임의 접근통제(DAC)" -> ["임의 접근통제", "DAC"]
    const match = cand.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (match) {
      const part1 = normalizeAnswer(match[1]);
      const part2 = normalizeAnswer(match[2]);
      if (normalizedUser === part1 || normalizedUser === part2) {
        return true;
      }
    }

    // 슬래시 분리: "IPSec / SSL / S-HTTP" -> 개별 항목
    if (cand.includes('/')) {
      const parts = cand.split('/').map((p) => normalizeAnswer(p));
      if (parts.includes(normalizedUser)) {
        return true;
      }
    }
  }

  return false;
}
