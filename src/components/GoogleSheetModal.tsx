import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, FileSpreadsheet, Code2, Sparkles } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../constants/googleAppsScriptCode';
import { SheetService } from '../services/sheetService';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  webAppUrl: string;
  onSaveUrl: (url: string) => void;
  onRefreshNotes: () => Promise<void>;
  onResetDemo: () => void;
  isDemoMode: boolean;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  webAppUrl,
  onSaveUrl,
  onRefreshNotes,
  onResetDemo,
  isDemoMode
}) => {
  const [inputUrl, setInputUrl] = useState(webAppUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'code'>('guide');

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleTestConnection = async () => {
    if (!inputUrl.trim()) {
      setTestResult({
        success: false,
        message: '구글 앱스 스크립트 웹 앱 URL을 먼저 입력해주세요.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await SheetService.testConnection(inputUrl.trim());
    setTesting(false);
    setTestResult(result);

    if (result.success) {
      onSaveUrl(inputUrl.trim());
      await onRefreshNotes();
    }
  };

  const handleSaveOnly = () => {
    onSaveUrl(inputUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-lg font-bold">구글 시트 백엔드 연동 & Code.gs</h3>
              <p className="text-xs text-emerald-100">
                구글 스프레드시트를 무료 실시간 데이터베이스로 연결합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">현재 상태:</span>
            {isDemoMode || !webAppUrl ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                체험용 데모 모드 (로컬 저장)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                구글 시트 실시간 연동 중
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDemo}
              className="text-stone-600 hover:text-stone-900 text-xs underline cursor-pointer"
            >
              체험 데이터로 리셋
            </button>
            <button
              onClick={() => onRefreshNotes()}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              시트 새로고침
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📖 3분 연동 가이드
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            💻 Code.gs 소스코드 복사
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {activeTab === 'guide' ? (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {/* Step 1 to 4 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  새 구글 스프레드시트 만들기
                </h4>
                <p className="text-stone-600 text-xs">
                  구글 드라이브(또는 docs.google.com/spreadsheets)에서 새 스프레드시트를 생성하고 제목을{' '}
                  <strong className="text-stone-800">'교생선생님 롤링페이퍼'</strong>로 정합니다.
                </p>
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
                >
                  새 구글 시트 바로 열기 (sheets.new)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  Apps Script 열고 Code.gs 붙여넣기
                </h4>
                <p className="text-stone-600 text-xs">
                  구글 시트 상단 메뉴에서 <strong>[확장 프로그램] &gt; [Apps Script]</strong>를 클릭합니다.
                  기존의 \`myFunction()\` 내용을 모두 지우고, 아래의 <strong>[Code.gs 소스코드]</strong> 전체를 복사하여 붙여넣은 뒤 <strong>[저장(Ctrl+S)]</strong>을 누릅니다.
                </p>
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Code.gs 보러 가기 & 원클릭 복사
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  웹 앱으로 배포하기 (가장 중요 ⭐)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600 pl-1">
                  <li>Apps Script 우측 상단 파란색 <strong>[배포] &gt; [새 배포]</strong> 클릭</li>
                  <li>왼쪽 톱니바퀴 아이콘에서 <strong>[웹 앱 (Web App)]</strong> 선택</li>
                  <li>
                    <strong>다음 사용자 권한으로 실행:</strong> [나 (사용자 구글 이메일)] 유지
                  </li>
                  <li>
                    <strong className="text-rose-600">액세스 권한이 있는 사용자:</strong> 반드시{' '}
                    <strong className="text-rose-600">[모든 사용자 (Anyone)]</strong> 선택! (학생들이 구글 로그인 없이 작성하기 위해 필수입니다)
                  </li>
                  <li>[배포] 클릭 후 승인(고급 &gt; 안전하지 않음으로 이동) 완료</li>
                  <li>배포 완료 창에 표시되는 <strong>'웹 앱 URL'</strong>을 복사합니다.</li>
                </ol>
              </div>

              {/* URL Input Form */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  배포된 웹 앱 URL 붙여넣기 및 연동 완료
                </h4>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Google Apps Script 웹 앱 URL (https://script.google.com/macros/s/.../exec)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testing}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      {testing ? (
                        <>연동 테스트 중...</>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          연동 & 동기화
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      testResult.success
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">{testResult.success ? '연동 성공!' : '연동 실패'}</p>
                      <p>{testResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Code.gs Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">
                    Apps Script 소스코드 (Code.gs)
                  </h4>
                  <p className="text-xs text-stone-500">
                    아래 코드를 복사하여 Google Apps Script 에디터에 붙여넣으세요.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    copiedCode
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? '코드 복사됨!' : 'Code.gs 전체 복사'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto max-h-[400px] leading-relaxed border border-stone-700">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            * 구글 시트 연동 전에도 데모 모드로 자유롭게 테스트하실 수 있습니다.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-xl text-xs font-medium cursor-pointer"
            >
              닫기
            </button>
            <button
              onClick={handleSaveOnly}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
