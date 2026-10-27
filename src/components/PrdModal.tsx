import React, { useState } from 'react';
import { X, Copy, Check, FileText, CheckCircle2, Shield, Sparkles, Layers, Database } from 'lucide-react';
import { PRD_MARKDOWN } from '../constants/prdDocument';

interface PrdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrdModal: React.FC<PrdModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PRD_MARKDOWN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-lg font-bold">제품 요구사항 정의서 (PRD Document)</h3>
              <p className="text-xs text-indigo-100">
                교생선생님 작별 온라인 롤링페이퍼 웹앱 기획 & 개발 명세서
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'PRD 복사 완료!' : 'PRD 마크다운 복사'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRD Highlights Bar */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <Database className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>백엔드: Google Sheets API</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>프론트: React 19 + Tailwind</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>인증: 로그인 무요구 (No-auth)</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-900 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>비용: 영구 무료 (0원)</span>
          </div>
        </div>

        {/* Markdown Document Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6 text-stone-800 leading-relaxed font-sans text-sm">
          <div className="prose prose-stone max-w-none">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-inner">
              <pre className="font-mono text-xs text-stone-700 whitespace-pre-wrap leading-relaxed select-text">
                {PRD_MARKDOWN}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            PRD 문서는 언제든지 상단 메뉴의 [📋 PRD] 버튼을 눌러 다시 열어보실 수 있습니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
