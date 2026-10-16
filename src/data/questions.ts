import { Question, ChapterCategory, ExamPresetMode } from '../types/quiz';
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
import { part11_code_variants } from './db/part11_code_variants';
import { part12_sql_queries } from './db/part12_sql_queries';
import { part13_calc_networking } from './db/part13_calc_networking';
import { part14_security_db_terms } from './db/part14_security_db_terms';
import { part15_sw_hw_emerging } from './db/part15_sw_hw_emerging';
import { part16_extra_terms } from './db/part16_extra_terms';
import { part17_design_coupling_cohesion } from './db/part17_design_coupling_cohesion';

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
  ...part10_advanced_exam,
  ...part11_code_variants,
  ...part12_sql_queries,
  ...part13_calc_networking,
  ...part14_security_db_terms,
  ...part15_sw_hw_emerging,
  ...part16_extra_terms,
  ...part17_design_coupling_cohesion
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
 * 디자인패턴 + 결합도 + 응집도 (디결응) 전용 문제 풀
 * GoF 디자인 패턴 23종, 생성/구조/행위 패턴, 결합도 6종, 응집도 7종, 모듈 독립성 원칙
 */
export function getDiGyeolEungPool(): Question[] {
  return ALL_QUESTIONS.filter((q) => {
    if (q.id.startsWith('dgc-')) return true;
    const combined = (
      q.question +
      ' ' +
      q.standardAnswer +
      ' ' +
      q.explanation +
      ' ' +
      (q.acceptedAnswers ? q.acceptedAnswers.join(' ') : '')
    ).toLowerCase();

    return (
      combined.includes('결합도') ||
      combined.includes('응집도') ||
      combined.includes('디자인 패턴') ||
      combined.includes('디자인패턴') ||
      combined.includes('gof') ||
      combined.includes('생성 패턴') ||
      combined.includes('구조 패턴') ||
      combined.includes('행위 패턴') ||
      combined.includes('coupling') ||
      combined.includes('cohesion') ||
      combined.includes('싱글톤') ||
      combined.includes('팩토리') ||
      combined.includes('빌더') ||
      combined.includes('프로토타입') ||
      combined.includes('어댑터') ||
      combined.includes('브리지') ||
      combined.includes('컴포지트') ||
      combined.includes('데코레이터') ||
      combined.includes('퍼싸드') ||
      combined.includes('퍼사드') ||
      combined.includes('플라이웨이트') ||
      combined.includes('프록시') ||
      combined.includes('옵서버') ||
      combined.includes('옵저버') ||
      combined.includes('스트래티지') ||
      combined.includes('템플릿 메소드') ||
      combined.includes('템플릿 메서드') ||
      combined.includes('커맨드') ||
      combined.includes('미디에이터') ||
      combined.includes('중재자') ||
      combined.includes('메멘토') ||
      combined.includes('이터레이터') ||
      combined.includes('반복자') ||
      combined.includes('비지터') ||
      combined.includes('방문자') ||
      combined.includes('인터프리터') ||
      combined.includes('책임 연쇄')
    );
  });
}

/**
 * 핵심 용어 (네트워크, SW, HW, 데이터베이스, 보안) 전용 문제 풀
 */
export function getTermsPool(): Question[] {
  return ALL_QUESTIONS.filter((q) => {
    // 순수 코드 실행 결과 추적 문제 제외
    if (q.questionType === 'CODE') return false;

    const targetChapters: ChapterCategory[] = [
      'CH1_요구사항확인',
      'CH2_데이터입출력',
      'CH3_통합구현',
      'CH4_서버프로그램',
      'CH5_인터페이스',
      'CH7_애플리케이션테스트',
      'CH8_SQL응용',
      'CH9_소프트웨어보안',
      'CH11_응용SW기초',
      'CH12_소프트웨어패키징'
    ];

    if (!targetChapters.includes(q.chapter)) return false;

    // 용어 기입형이나 괄호 빈칸 단답형 등
    if (q.questionType === 'TERM' || q.questionType === 'BLANK' || !q.questionType) {
      return true;
    }

    return false;
  });
}

/**
 * 조건에 맞는 10문제 무작위 추출
 * - 전체 / 디결응 / 용어 모드 완벽 지원
 * - 550개의 방대한 풀에서 중복 없이 골고루 10문제 선정
 */
export function generate10Questions(
  chapter: ChapterCategory = 'ALL',
  importanceOnlyA: boolean = false,
  presetMode: ExamPresetMode = 'ALL'
): Question[] {
  let pool: Question[];

  if (presetMode === 'DI_GYEOL_EUNG') {
    pool = getDiGyeolEungPool();
  } else if (presetMode === 'TERMS') {
    pool = getTermsPool();
    if (chapter !== 'ALL') {
      pool = pool.filter((q) => q.chapter === chapter);
    }
  } else {
    pool = [...ALL_QUESTIONS];
    if (chapter !== 'ALL') {
      pool = pool.filter((q) => q.chapter === chapter);
    }
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
