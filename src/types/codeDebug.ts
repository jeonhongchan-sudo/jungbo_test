export type CodeLanguage = 'C' | 'JAVA' | 'PYTHON' | 'SQL';

export type CodeDifficulty = '중' | '상' | '최상';

export interface MemoryCell {
  address: string;    // e.g. "1000번지 (0x1000)", "1004번지", "2000번지 (Heap)"
  name: string;       // e.g. "arr[0]", "p", "*p", "x", "root.val"
  type?: string;      // e.g. "int (4B)", "int*", "String ref", "struct Node*"
  value: string;      // e.g. "15", "1000번지 (&arr[0])", "'K'", "NULL"
  previousValue?: string; // 직전 단계의 값 (e.g. "10")
  transitionTrail?: string[]; // 누적 변화 이력 (e.g. ["10", "20", "10"])
  changeNote?: string; // 변경 이유나 계산식 (e.g. "10 + 10 = 20")
  scope?: string;     // e.g. "Stack (main)", "Stack (recur-3)", "Heap", "Global/Static"
  isChanged?: boolean; // 이 단계에서 변경된 메모리인지 여부
}

export interface SqlTableState {
  tableName: string;
  columns: string[];
  rows: (string | number | null)[][];
  highlightRowIndices?: number[];
}

export interface DebugStep {
  stepNumber: number;
  title: string;
  lineHighlight?: number | number[]; // 하이라이트할 코드 라인 (1-indexed)
  description: string;
  memoryState: MemoryCell[];
  callStack?: string[];              // 재귀/함수 호출 스택 (예: ['main()', 'f(3)', 'f(2)'])
  consoleOutput?: string;            // 이 단계까지의 누적 표준 출력
  sqlTableState?: SqlTableState;     // SQL 단계별 중간 뷰 (FROM/WHERE/GROUP BY 필터 후)
}

export interface CodeDebugQuestion {
  id: string;
  language: CodeLanguage;
  difficulty: CodeDifficulty;
  title: string;
  topic: string;                     // e.g. "2차원 배열 포인터", "다형성과 오버라이딩", "리스트 슬라이싱"
  tags: string[];
  code: string;
  questionPrompt: string;            // e.g. "다음 C 프로그램의 실행 결과를 쓰시오."
  expectedAnswer: string;
  acceptedAnswers: string[];
  keyTakeaway: string;               // 핵심 함정 및 정처기 실기 합격 포인트
  steps: DebugStep[];
}

export interface CodeLabProgress {
  solvedQuestions: Record<string, {
    isCorrect: boolean;
    userAnswer: string;
    solvedAt: string;
  }>;
  bookmarkedIds: string[];
}
