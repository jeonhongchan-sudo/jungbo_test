export type ChapterCategory =
  | 'ALL'
  | 'CH1_요구사항확인'
  | 'CH2_데이터입출력'
  | 'CH3_통합구현'
  | 'CH4_서버프로그램'
  | 'CH5_인터페이스'
  | 'CH6_화면설계'
  | 'CH7_애플리케이션테스트'
  | 'CH8_SQL응용'
  | 'CH9_소프트웨어보안'
  | 'CH10_프로그래밍언어'
  | 'CH11_응용SW기초'
  | 'CH12_소프트웨어패키징';

export type ImportanceRating = 'A' | 'B' | 'C';

export type QuestionType =
  | 'TERM'       // 용어 기입형
  | 'BLANK'      // 괄호/빈칸 채우기
  | 'CODE'       // 프로그래밍 실행 결과형
  | 'CALC'       // 계산식/수치형
  | 'SELECT';    // 보기 선택형

export interface Question {
  id: string;
  chapter: ChapterCategory;
  chapterTitle: string;
  topicNumber?: string;
  importance: ImportanceRating;
  questionType?: QuestionType;
  frequency?: string;
  question: string;
  codeSnippet?: string;
  choices?: string[]; // 보기(선택형일 경우)
  standardAnswer: string;
  acceptedAnswers: string[];
  explanation: string;
  keyPoints?: string[];
}

export interface WrongNoteItem {
  questionId: string;
  question: Question;
  wrongCount: number;
  lastWrongAnswer: string;
  lastTestedAt: string;
  isBookmarked: boolean;
}

export interface WrongNotesExportData {
  version: string;
  exportedAt: string;
  totalNotes: number;
  notes: WrongNoteItem[];
}
