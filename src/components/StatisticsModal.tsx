import React, { useState } from 'react';
import { ChapterCategory, WrongNoteItem, QuestionType } from '../types/quiz';
import {
  X,
  BarChart3,
  Flame,
  AlertTriangle,
  Award,
  BookOpen,
  Code2,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: WrongNoteItem[];
  onStartChapterQuiz: (chapter: ChapterCategory) => void;
  onStartWrongNotesQuiz: () => void;
}

const CHAPTER_INFO: Record<
  ChapterCategory,
  { number: number; name: string; shortName: string }
> = {
  ALL: { number: 0, name: '전체 과목', shortName: '전체' },
  CH1_요구사항확인: { number: 1, name: '1장 요구사항 확인', shortName: '요구사항' },
  CH2_데이터입출력: { number: 2, name: '2장 데이터 입·출력', shortName: '데이터입출력' },
  CH3_통합구현: { number: 3, name: '3장 통합 구현', shortName: '통합구현' },
  CH4_서버프로그램: { number: 4, name: '4장 서버 프로그램 구현', shortName: '서버프로그램' },
  CH5_인터페이스: { number: 5, name: '5장 인터페이스 구현', shortName: '인터페이스' },
  CH6_화면설계: { number: 6, name: '6장 화면 설계', shortName: '화면설계' },
  CH7_애플리케이션테스트: { number: 7, name: '7장 애플리케이션 테스트 관리', shortName: '테스트관리' },
  CH8_SQL응용: { number: 8, name: '8장 SQL 응용', shortName: 'SQL응용' },
  CH9_소프트웨어보안: { number: 9, name: '9장 소프트웨어 개발 보안 구축', shortName: 'SW보안' },
  CH10_프로그래밍언어: { number: 10, name: '10장 프로그래밍 언어 활용', shortName: '프로그래밍' },
  CH11_응용SW기초: { number: 11, name: '11장 응용 SW 기초 기술 활용', shortName: 'SW기초(NW/OS)' },
  CH12_소프트웨어패키징: { number: 12, name: '12장 제품 소프트웨어 패키징', shortName: 'SW패키징' }
};

const ORDERED_CHAPTERS: ChapterCategory[] = [
  'CH1_요구사항확인',
  'CH2_데이터입출력',
  'CH3_통합구현',
  'CH4_서버프로그램',
  'CH5_인터페이스',
  'CH6_화면설계',
  'CH7_애플리케이션테스트',
  'CH8_SQL응용',
  'CH9_소프트웨어보안',
  'CH10_프로그래밍언어',
  'CH11_응용SW기초',
  'CH12_소프트웨어패키징'
];

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onStartChapterQuiz,
  onStartWrongNotesQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'CHAPTER' | 'TYPE' | 'TOP_WRONG' | 'PRESCRIPTION'>('CHAPTER');

  if (!isOpen) return null;

  const totalWrongQuestions = savedNotes.length;
  const totalWrongCount = savedNotes.reduce((acc, cur) => acc + (cur.wrongCount || 1), 0);

  // 1. 단원별 통계 집계
  const chapterStats: Record<string, { count: number; totalOccurrences: number }> = {};
  ORDERED_CHAPTERS.forEach((ch) => {
    chapterStats[ch] = { count: 0, totalOccurrences: 0 };
  });

  savedNotes.forEach((note) => {
    const ch = note.question.chapter;
    if (!chapterStats[ch]) {
      chapterStats[ch] = { count: 0, totalOccurrences: 0 };
    }
    chapterStats[ch].count += 1;
    chapterStats[ch].totalOccurrences += note.wrongCount || 1;
  });

  // 정렬된 단원 통계 (오답 많은 순)
  const sortedChapters = [...ORDERED_CHAPTERS].sort(
    (a, b) => (chapterStats[b]?.count || 0) - (chapterStats[a]?.count || 0)
  );

  const worstChapter = sortedChapters[0];
  const worstChapterCount = chapterStats[worstChapter]?.count || 0;

  // 2. 문제 유형별 통계 집계
  // CODE, SQL, TERM, BLANK, CALC, SELECT, OTHER
  const typeMap: Record<
    string,
    { label: string; icon: string; count: number; occurrences: number; desc: string }
  > = {
    CODE: {
      label: '프로그래밍 코드 실행 결과',
      icon: '💻',
      count: 0,
      occurrences: 0,
      desc: 'C언어, Java, Python 문법 및 실행 결과 트레이싱'
    },
    SQL: {
      label: 'SQL 쿼리 작성 및 결과',
      icon: '🗄️',
      count: 0,
      occurrences: 0,
      desc: 'SELECT, JOIN, 집계함수, 서브쿼리, DDL/DML'
    },
    TERM: {
      label: '단답형 핵심 용어',
      icon: '🔤',
      count: 0,
      occurrences: 0,
      desc: '네트워크, 보안, 소프트웨어공학, HW 표준 용어'
    },
    BLANK: {
      label: '괄호 및 빈칸 채우기',
      icon: '📝',
      count: 0,
      occurrences: 0,
      desc: '개념 정의 및 설계 원칙 괄호 완성형'
    },
    CALC: {
      label: '계산식 / 서브네팅 / 스케줄링',
      icon: '🧮',
      count: 0,
      occurrences: 0,
      desc: 'IP 서브넷 마스크, HRN, FCFS, 가용성 계산 등'
    },
    OTHER: {
      label: '기타 / 서술형 / 선택형',
      icon: '📋',
      count: 0,
      occurrences: 0,
      desc: '다이어그램 및 복합 서술형'
    }
  };

  savedNotes.forEach((note) => {
    const q = note.question;
    let t = q.questionType as string;

    if (!t) {
      if (q.chapter === 'CH8_SQL응용' || q.question.includes('SELECT') || q.question.includes('SQL')) {
        t = 'SQL';
      } else if (q.codeSnippet) {
        t = 'CODE';
      } else {
        t = 'TERM';
      }
    } else if (q.chapter === 'CH8_SQL응용') {
      t = 'SQL';
    }

    const key = typeMap[t] ? t : 'OTHER';
    typeMap[key].count += 1;
    typeMap[key].occurrences += note.wrongCount || 1;
  });

  const sortedTypes = Object.entries(typeMap).sort((a, b) => b[1].count - a[1].count);
  const worstType = sortedTypes[0];

  // 3. 중요도별 오답 집계 (A vs B vs C)
  const importanceStats: Record<string, number> = { A: 0, B: 0, C: 0 };
  savedNotes.forEach((n) => {
    const imp = n.question.importance || 'B';
    importanceStats[imp] = (importanceStats[imp] || 0) + 1;
  });

  // 4. 반복 오답 문항 TOP 5
  const topWrongQuestions = [...savedNotes]
    .sort((a, b) => (b.wrongCount || 1) - (a.wrongCount || 1))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg sm:text-xl text-slate-900">
                  오답 분석 및 취약 단원 통계
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  누적 {totalWrongQuestions}문항
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                오답 데이터를 바탕으로 가장 취약한 단원과 문제 유형을 시각화 그래프로 분석합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Cards (Summary) */}
        <div className="p-4 sm:p-6 bg-slate-50/40 border-b border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> 총 오답 문항 수
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{totalWrongQuestions}</span>
              <span className="text-xs font-bold text-slate-400">문제</span>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> 총 오답 발생 횟수
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-600">{totalWrongCount}</span>
              <span className="text-xs font-bold text-slate-400">회</span>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 최다 오답 단원
            </span>
            <div className="mt-2 truncate font-bold text-sm sm:text-base text-slate-900" title={CHAPTER_INFO[worstChapter]?.name}>
              {worstChapterCount > 0 ? CHAPTER_INFO[worstChapter]?.shortName : '없음'}
              {worstChapterCount > 0 && (
                <span className="text-xs font-semibold text-rose-600 ml-1">({worstChapterCount}개)</span>
              )}
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-purple-500" /> 최다 오답 유형
            </span>
            <div className="mt-2 truncate font-bold text-sm sm:text-base text-slate-900">
              {worstType[1].count > 0 ? (
                <>
                  <span>{worstType[1].icon} </span>
                  <span>{worstType[1].label.split(' ')[0]}</span>
                  <span className="text-xs font-semibold text-purple-600 ml-1">({worstType[1].count}개)</span>
                </>
              ) : (
                '없음'
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('CHAPTER')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'CHAPTER'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 단원별 오답 통계 (1~12장)
          </button>
          <button
            onClick={() => setActiveTab('TYPE')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'TYPE'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🧩 문제 유형별 분석
          </button>
          <button
            onClick={() => setActiveTab('TOP_WRONG')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'TOP_WRONG'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔥 최다 오답 문항 TOP 5
          </button>
          <button
            onClick={() => setActiveTab('PRESCRIPTION')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'PRESCRIPTION'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💡 합격 진단 및 학습 처방
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/30">
          {totalWrongQuestions === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-emerald-400" />
              <h4 className="font-bold text-base text-slate-800">
                현재 누적된 오답이 없습니다! 🎉
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                10문제를 풀고 채점을 진행하면 틀린 문제가 오답노트에 기록되며, 이곳에 단원별·유형별 통계 그래프가 자동으로 분석됩니다.
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: 단원별 통계 막대 그래프 */}
              {activeTab === 'CHAPTER' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">
                      총 12개 전 단원의 오답 발생 분포도 (막대 그래프)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      * 막대 클릭 시 해당 단원 10문제를 바로 집중 출제할 수 있습니다.
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {ORDERED_CHAPTERS.map((ch) => {
                      const stat = chapterStats[ch] || { count: 0, totalOccurrences: 0 };
                      const info = CHAPTER_INFO[ch];
                      const percent =
                        totalWrongQuestions > 0
                          ? Math.round((stat.count / totalWrongQuestions) * 100)
                          : 0;

                      // 막대 색상 계산
                      let barColor = 'bg-slate-200';
                      let badgeColor = 'bg-slate-100 text-slate-600';
                      if (stat.count >= 4) {
                        barColor = 'bg-linear-to-r from-rose-500 to-rose-600';
                        badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
                      } else if (stat.count >= 2) {
                        barColor = 'bg-linear-to-r from-amber-500 to-amber-600';
                        badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                      } else if (stat.count === 1) {
                        barColor = 'bg-linear-to-r from-indigo-500 to-indigo-600';
                        badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                      }

                      return (
                        <div
                          key={ch}
                          className="bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all shadow-2xs group"
                        >
                          <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 text-right font-bold text-slate-400">
                                {info.number}장
                              </span>
                              <span className="font-bold text-slate-800 truncate">
                                {info.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                {stat.count}문항 ({stat.totalOccurrences}회 오답) · {percent}%
                              </span>
                              <button
                                onClick={() => {
                                  onStartChapterQuiz(ch);
                                  onClose();
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                이 단원 풀기 <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Graphical Bar */}
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${percent > 0 ? Math.max(percent, 4) : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: 문제 유형별 분석 막대 그래프 */}
              {activeTab === 'TYPE' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">
                      문제 유형별(코드 실행, SQL, 단답 용어, 괄호형, 계산) 오답 통계
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {sortedTypes.map(([typeKey, item]) => {
                      const percent =
                        totalWrongQuestions > 0
                          ? Math.round((item.count / totalWrongQuestions) * 100)
                          : 0;

                      return (
                        <div
                          key={typeKey}
                          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl p-2 rounded-xl bg-slate-100">
                                {item.icon}
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-slate-900">
                                  {item.label}
                                </h5>
                                <p className="text-[11px] text-slate-500">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                              {item.count}개 ({percent}%)
                            </span>
                          </div>

                          {/* Graph Bar */}
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                              <span>비중</span>
                              <span>{item.occurrences}회 오답 발생</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                                style={{ width: `${percent > 0 ? Math.max(percent, 5) : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Importance Breakdown Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mt-4">
                    <h5 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-500" />
                      기출 중요도별 오답 분포 (A등급 / B등급 / C등급)
                    </h5>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                        <span className="text-xs font-bold text-rose-700">A등급 (기출 최빈출)</span>
                        <div className="text-xl font-black text-rose-900 mt-1">
                          {importanceStats.A || 0}문제
                        </div>
                        <span className="text-[10px] text-rose-600 font-medium">반드시 완벽 숙지 필요</span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-xs font-bold text-amber-700">B등급 (빈출)</span>
                        <div className="text-xl font-black text-amber-900 mt-1">
                          {importanceStats.B || 0}문제
                        </div>
                        <span className="text-[10px] text-amber-600 font-medium">안정적 합격선 확보</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">C등급 (신규/기타)</span>
                        <div className="text-xl font-black text-slate-900 mt-1">
                          {importanceStats.C || 0}문제
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">고득점 노리기</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 최다 오답 문항 TOP 5 */}
              {activeTab === 'TOP_WRONG' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 mb-1">
                    반복해서 틀린 오답 횟수가 가장 높은 핵심 5문항입니다. 확실히 암기하여 약점을 제거하세요.
                  </div>

                  {topWrongQuestions.map((item, idx) => (
                    <div
                      key={item.questionId}
                      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {item.question.chapterTitle}
                          </span>
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                            {item.question.importance}등급
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          <Flame className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                          누적 오답 {item.wrongCount}회
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                        {item.question.question}
                      </p>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex flex-wrap items-center gap-2">
                        <span className="font-bold text-indigo-700">모범 정답:</span>
                        <strong className="text-slate-900">{item.question.standardAnswer}</strong>
                        {item.lastWrongAnswer && (
                          <span className="text-rose-500 text-[11px] ml-auto">
                            (최근 작성한 오답: <span className="line-through">{item.lastWrongAnswer}</span>)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: 합격 진단 및 학습 처방 */}
              {activeTab === 'PRESCRIPTION' && (
                <div className="space-y-4">
                  <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-5 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      약점 극복 & 실기 합격 진단 처방전
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      현재 회원님의 가장 취약한 영역은{' '}
                      <strong className="text-rose-600 font-bold underline">
                        {CHAPTER_INFO[worstChapter]?.name}
                      </strong>
                      이며, 유형 중에서는{' '}
                      <strong className="text-indigo-700 font-bold underline">
                        {worstType[1].label}
                      </strong>
                      에서 오답이 집중되고 있습니다.
                    </p>

                    <div className="bg-white/80 p-3.5 rounded-xl text-xs space-y-1.5 border border-indigo-100/60">
                      <div className="font-bold text-slate-800">📌 추천 집중 학습 로드맵:</div>
                      <ul className="list-disc pl-4 text-slate-600 space-y-1">
                        <li>
                          <strong>오답노트 10문제 집중 풀기</strong>: 오답노트에서 문제를 풀어 정답을 맞히면 오답노트에서 <strong>자동으로 삭제(마스터)</strong>되므로 모르는 것만 압축할 수 있습니다.
                        </li>
                        <li>
                          <strong>취약 단원({CHAPTER_INFO[worstChapter]?.shortName}) 집중 풀기</strong>: 단원 선택 필터에서 해당 단원을 선택하고 10문제씩 반복 풀이하세요.
                        </li>
                        {importanceStats.A > 0 && (
                          <li>
                            <strong>A등급 최빈출 필터 활용</strong>: 실기 합격 기준선(60점)을 넘기 위해 최빈출 A등급 오답 {importanceStats.A}개를 먼저 완벽히 공략하세요.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => {
                        onStartChapterQuiz(worstChapter);
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      최약점 단원 ({CHAPTER_INFO[worstChapter]?.shortName}) 10문제 풀기
                    </button>

                    <button
                      onClick={() => {
                        onStartWrongNotesQuiz();
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Flame className="w-4 h-4" />
                      오답노트 10문제 집중 풀기 (맞히면 삭제)
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            총 누적 오답: <strong>{totalWrongQuestions}문항</strong> (정답 맞힐 시 오답노트에서 자동 제거)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
