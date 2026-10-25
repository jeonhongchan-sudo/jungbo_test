import React, { useState, useEffect } from 'react';
import { CodeDebugQuestion, DebugStep } from '../types/codeDebug';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FastForward,
  Cpu,
  Layers,
  Terminal,
  Database,
  Lightbulb,
  Sparkles,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

interface CodeDebuggerViewerProps {
  question: CodeDebugQuestion;
  initFullscreen?: boolean;
  onToggleFullscreen?: (fs: boolean) => void;
}

export const CodeDebuggerViewer: React.FC<CodeDebuggerViewerProps> = ({
  question,
  initFullscreen = false,
  onToggleFullscreen
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(initFullscreen);
  const [mobileTab, setMobileTab] = useState<'SPLIT' | 'CODE' | 'MEMORY'>('SPLIT');

  const steps = question.steps && question.steps.length > 0 ? question.steps : [
    {
      stepNumber: 1,
      title: '코드 분석 및 실행',
      description: question.keyTakeaway,
      memoryState: [],
      consoleOutput: question.expectedAnswer
    }
  ];

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (onToggleFullscreen) onToggleFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);

  // Toggle fullscreen helper
  const handleToggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (onToggleFullscreen) onToggleFullscreen(next);
  };

  // Reset step index when question changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [question.id]);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length]);

  const currentStep: DebugStep = steps[currentStepIdx] || steps[0];

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleFirst = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleLast = () => {
    setIsPlaying(false);
    setCurrentStepIdx(steps.length - 1);
  };

  // Code lines split
  const codeLines = question.code.split('\n');

  // Check if a line is highlighted
  const isLineHighlighted = (lineIndex: number) => {
    const lineNum = lineIndex + 1;
    if (!currentStep.lineHighlight) return false;
    if (Array.isArray(currentStep.lineHighlight)) {
      return currentStep.lineHighlight.includes(lineNum);
    }
    return currentStep.lineHighlight === lineNum;
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto p-2 sm:p-4 md:p-6 shadow-2xl animate-in fade-in duration-150"
          : "bg-slate-900 text-slate-100 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden mt-4"
      }
    >
      {/* Fullscreen Special Banner */}
      {isFullscreen && (
        <div className="bg-indigo-950/80 border border-indigo-800/80 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 font-extrabold text-white text-xs tracking-wide">
              {question.language}
            </span>
            <span className="font-extrabold text-sm text-white truncate">
              {question.title}
            </span>
            <span className="hidden md:inline text-xs text-indigo-300 font-medium">
              - {question.topic} (난이도 {question.difficulty})
            </span>
          </div>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
            title="전체화면 종료 (ESC)"
          >
            <X className="w-4 h-4" />
            <span>전체화면 종료 (ESC)</span>
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono font-bold text-slate-300 ml-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>인터랙티브 단계별 디버거 (가상 메모리 추적기)</span>
          </span>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Step Navigation Controller */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
            <button
              onClick={handleFirst}
              disabled={currentStepIdx === 0}
              title="첫 단계로 이동"
              className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>이전</span>
            </button>

            <div className="px-2.5 py-0.5 text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 rounded-md border border-indigo-800/60">
              Step {currentStepIdx + 1} / {steps.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStepIdx === steps.length - 1}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition-colors cursor-pointer"
            >
              <span>다음</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleLast}
              disabled={currentStepIdx === steps.length - 1}
              title="마지막 단계로 이동"
              className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? '일시정지' : '자동 재생'}
              className={`p-1 rounded-lg transition-colors cursor-pointer ml-1 ${
                isPlaying ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={handleToggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isFullscreen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
            }`}
            title={isFullscreen ? '창 모드로 축소 (ESC)' : '전체화면 모드로 확대 (모바일/태블릿 최적화)'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>창 모드로 축소</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>전체화면 모드</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet View Tab Toggle (Small Screens) */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 px-2 py-1.5 border-b border-slate-800 text-xs">
        <button
          onClick={() => setMobileTab('SPLIT')}
          className={`flex-1 py-1 rounded-lg font-bold text-center transition-colors cursor-pointer ${
            mobileTab === 'SPLIT'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          상하 분할 보기
        </button>
        <button
          onClick={() => setMobileTab('CODE')}
          className={`flex-1 py-1 rounded-lg font-bold text-center transition-colors cursor-pointer ${
            mobileTab === 'CODE'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          코드만 보기
        </button>
        <button
          onClick={() => setMobileTab('MEMORY')}
          className={`flex-1 py-1 rounded-lg font-bold text-center transition-colors cursor-pointer ${
            mobileTab === 'MEMORY'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          가상 메모리·결과
        </button>
      </div>

      {/* Step Description Header */}
      <div className="bg-slate-850 px-4 py-3 border-b border-slate-800/80 flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
          {currentStepIdx + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
            <span>{currentStep.title}</span>
            {currentStep.lineHighlight && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                Line {Array.isArray(currentStep.lineHighlight) ? currentStep.lineHighlight.join(', ') : currentStep.lineHighlight}
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Code Viewer (Left) & Memory + Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] flex-1">
        {/* Code View with Line Highlight */}
        <div
          className={`lg:col-span-6 bg-slate-950 p-3 font-mono text-xs overflow-x-auto border-b lg:border-b-0 lg:border-r border-slate-800 select-text ${
            mobileTab === 'MEMORY' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="text-[11px] text-slate-500 font-semibold mb-2 flex items-center justify-between pb-1.5 border-b border-slate-800/60">
            <span>소스 코드 ({question.language})</span>
            <span className="text-[10px] text-indigo-400">● 현재 실행 라인 강조</span>
          </div>
          <div className="space-y-0.5">
            {codeLines.map((line, idx) => {
              const highlighted = isLineHighlighted(idx);
              return (
                <div
                  key={idx}
                  className={`flex items-start rounded-sm py-0.5 px-1 transition-colors ${
                    highlighted
                      ? 'bg-indigo-900/40 text-amber-200 border-l-2 border-amber-400 font-bold'
                      : 'text-slate-300 hover:bg-slate-900/50'
                  }`}
                >
                  <span
                    className={`inline-block w-7 text-right pr-2.5 select-none text-[11px] ${
                      highlighted ? 'text-amber-400 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">{line}</span>
                  {highlighted && (
                    <span className="text-amber-400 text-[10px] px-1 select-none font-sans font-normal">
                      ◀ 실행중
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Virtual Memory & Execution State */}
        <div
          className={`lg:col-span-6 bg-slate-900/95 p-3 flex flex-col justify-between space-y-3 ${
            mobileTab === 'CODE' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Virtual Memory Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>가상 메모리 맵 (Virtual Memory State)</span>
              </h5>
              <span className="text-[10px] text-slate-400">
                임의 지정 번지 (1000번, 2000번지 등)
              </span>
            </div>

            {currentStep.memoryState && currentStep.memoryState.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-1.5 px-2.5">메모리 주소</th>
                      <th className="py-1.5 px-2">식별자/변수명</th>
                      <th className="py-1.5 px-2">데이터 값</th>
                      <th className="py-1.5 px-2">영역</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    {currentStep.memoryState.map((cell, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          cell.isChanged
                            ? 'bg-amber-500/15 text-amber-200 font-bold'
                            : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-1.5 px-2.5 text-indigo-300 font-semibold flex items-center gap-1">
                          {cell.address}
                          {cell.isChanged && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </td>
                        <td className="py-1.5 px-2 font-bold text-slate-100">
                          {cell.name}
                        </td>
                        <td className="py-1.5 px-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] ${
                              cell.isChanged
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-200'
                            }`}
                          >
                            {cell.value}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-[10px] text-slate-500">
                          {cell.scope || 'Stack'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60 text-xs text-slate-400 text-center">
                이 단계는 연산자 우선순위 평가 또는 흐름 제어 단계로, 새로운 메모리 할당/변경이 없습니다.
              </div>
            )}
          </div>

          {/* Call Stack / Recursion Visualizer (If recursive or multiple stack frames) */}
          {currentStep.callStack && currentStep.callStack.length > 0 && (
            <div className="space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-indigo-900/40">
              <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>호출 스택 (Call Stack / 함수 프레임)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {currentStep.callStack.map((frame, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded-md font-mono flex items-center gap-1 ${
                      idx === currentStep.callStack!.length - 1
                        ? 'bg-indigo-600 text-white font-bold border border-indigo-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span>{frame}</span>
                    {idx === currentStep.callStack!.length - 1 && (
                      <span className="text-[9px] bg-indigo-950 px-1 rounded text-indigo-200">
                        TOP
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SQL Step Table View (If question is SQL) */}
          {currentStep.sqlTableState && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentStep.sqlTableState.tableName}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentStep.sqlTableState.rows.length}개 행 조회됨
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      {currentStep.sqlTableState.columns.map((col, idx) => (
                        <th key={idx} className="py-1 px-2">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    {currentStep.sqlTableState.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="py-1 px-2 text-slate-300">
                            {val === null ? (
                              <span className="text-rose-400 font-bold text-[10px] bg-rose-950/40 px-1 rounded">
                                NULL
                              </span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Console Output Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>표준 출력 (stdout / 누적 출력 결과)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                EOF
              </span>
            </div>
            <div className="bg-black/80 rounded-xl p-2.5 font-mono text-xs text-emerald-400 border border-slate-800 min-h-[44px] flex items-center">
              {currentStep.consoleOutput ? (
                <span className="whitespace-pre">{currentStep.consoleOutput}</span>
              ) : (
                <span className="text-slate-600 italic">아직 출력된 내용이 없습니다.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Key Takeaway Callout */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-start gap-2.5 text-xs text-indigo-300">
        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold mr-1">실기 합격 핵심 포인트:</strong>
          <span className="text-slate-300 leading-relaxed">{question.keyTakeaway}</span>
        </div>
      </div>
    </div>
  );
};
