import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle, X, HelpCircle, Laptop } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // If already running in standalone mode (already installed as PWA on device)
  if (isInstalled) {
    return (
      <div
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold"
        title="기기에 독립형 PWA 앱으로 설치되어 실행 중입니다"
      >
        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        <span>앱 설치 완료</span>
      </div>
    );
  }

  // Handle click on install button
  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        // If dismissed or didn't proceed, show guide
        setShowGuideModal(true);
      }
    } else {
      // Guide modal for iOS or browsers where prompt event hasn't directly fired
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        title="기기(PC/모바일/태블릿)에 실제 독립형 앱(PWA)으로 설치합니다"
      >
        <Download className="w-3.5 h-3.5" />
        <span>기기에 앱 설치</span>
      </button>

      {/* Installation Guide Modal (for iOS or fallback instructions) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  기기(PWA)에 실제 앱으로 설치하기
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <p className="leading-relaxed text-slate-600">
                PWA(Progressive Web App) 기술로 기기 홈 화면이나 데스크톱 앱 목록에 독립형 앱으로 설치되어 <strong>오프라인 상태에서도 100% 정상 작동</strong>합니다.
              </p>

              {isIOS ? (
                /* iOS Safari Guide */
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span>아이폰 / 아이패드 (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 text-xs leading-relaxed">
                    <li>사파리 하단 툴바의 <strong>[공유]</strong> 버튼 (네모 위 화살표) 탭</li>
                    <li>메뉴 목록에서 <strong>[홈 화면에 추가]</strong> 선택</li>
                    <li>우측 상단 <strong>[추가]</strong>를 탭하면 앱스토어 앱처럼 독립 실행됩니다.</li>
                  </ol>
                </div>
              ) : (
                /* Chrome / Android / PC Guide */
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-indigo-600" />
                    <span>Chrome / Edge / 안드로이드</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 text-xs leading-relaxed">
                    <li>
                      주소창 우측의 <strong>[앱 설치]</strong> 아이콘(컴퓨터 모니터에 화살표 모양)을 클릭하거나,
                    </li>
                    <li>
                      브라우저 우측 상단 메뉴(점 3개) ➔ <strong>[앱으로 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong>를 선택하세요.
                    </li>
                    <li>
                      단순 웹 바로가기가 아닌 브라우저 주소창이 없는 <strong>독립된 실제 앱 창</strong>으로 설치됩니다.
                    </li>
                  </ol>
                </div>
              )}

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  설치 후에는 인터넷 연결이 끊겨도(비행기 탑승 모드 등) 단답형 10제 문제와 프로그래밍·SQL 인터랙티브 디버거를 모두 오프라인에서 로컬로 사용하실 수 있습니다.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};
