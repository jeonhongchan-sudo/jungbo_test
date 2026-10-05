import { Question, ChapterCategory } from '../types/quiz';
import { part1_requirements } from './db/part1_requirements';
import { part2_database } from './db/part2_database';
import { part3_architecture_design } from './db/part3_architecture_design';
import { part4_interface_ui } from './db/part4_interface_ui';
import { part5_testing } from './db/part5_testing';
import { part6_sql } from './db/part6_sql';
import { part7_security } from './db/part7_security';
import { part8_network_os } from './db/part8_network_os';
import { part9_programming_packaging } from './db/part9_programming_packaging';
import { part10_advanced_exam } from './db/part10_advanced_exam';

export const ALL_QUESTIONS: Question[] = [
  ...part1_requirements,
  ...part2_database,
  ...part3_architecture_design,
  ...part4_interface_ui,
  ...part5_testing,
  ...part6_sql,
  ...part7_security,
  ...part8_network_os,
  ...part9_programming_packaging,
  ...part10_advanced_exam
];

/**
 * 배열 셔플 (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 조건에 맞는 10문제 무작위 추출
 * - 300개 이상의 방대한 풀에서 중복 없이 골고루 10문제 선정
 */
export function generate10Questions(
  chapter: ChapterCategory = 'ALL',
  importanceOnlyA: boolean = false
): Question[] {
  let pool = [...ALL_QUESTIONS];

  if (chapter !== 'ALL') {
    pool = pool.filter((q) => q.chapter === chapter);
  }

  if (importanceOnlyA) {
    const aPool = pool.filter((q) => q.importance === 'A');
    if (aPool.length >= 10) {
      pool = aPool;
    }
  }

  // 풀이 10개보다 적은 경우 전체 풀에서 보충
  if (pool.length < 10) {
    const remaining = ALL_QUESTIONS.filter((q) => !pool.some((p) => p.id === q.id));
    const shuffledRemaining = shuffleArray(remaining);
    pool = [...pool, ...shuffledRemaining.slice(0, 10 - pool.length)];
  }

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, 10);
}
