import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, Printer, QrCode as QrIcon, Share2, Sparkles, School } from 'lucide-react';
import { TeacherInfo } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherInfo: TeacherInfo;
  sheetUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  teacherInfo,
  sheetUrl
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKakao, setCopiedKakao] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'poster'>('qr');

  // Compute shareable URL
  // If sheetUrl is present, pass it in query params so anyone opening the QR code automatically gets connected!
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = typeof window !== 'undefined'
    ? sheetUrl
      ? `${window.location.origin}${window.location.pathname}?sheetUrl=${encodeURIComponent(sheetUrl)}`
      : window.location.href
    : '';

  useEffect(() => {
    if (isOpen && shareUrl) {
      // Allow DOM to render canvas first
      setTimeout(() => {
        if (canvasRef.current) {
          QRCode.toCanvas(canvasRef.current, shareUrl, {
            width: 240,
            margin: 2,
            color: {
              dark: '#1e293b',
              light: '#ffffff'
            }
          }).catch(err => console.error('Failed to generate QR code', err));
        }
      }, 50);
    }
  }, [isOpen, shareUrl, activeTab]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const kakaoMessage = `[교생선생님 롤링페이퍼 참여 안내 💌]\n우리 반 ${teacherInfo.name}께 감사와 작별의 롤링페이퍼를 작성해주세요!\n\n👇 아래 링크를 눌러 바로 예쁜 쪽지를 남겨주세요:\n${shareUrl}`;

  const handleCopyKakao = async () => {
    try {
      await navigator.clipboard.writeText(kakaoMessage);
      setCopiedKakao(true);
      setTimeout(() => setCopiedKakao(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${teacherInfo.name}_롤링페이퍼_QR코드.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <QrIcon className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-lg font-bold">학생 참여용 링크 & QR코드</h3>
              <p className="text-xs text-emerald-100">
                아이들이 폰이나 태블릿으로 바로 접속해 편지를 쓸 수 있어요
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

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📱 QR코드 & 링크 공유
          </button>
          <button
            onClick={() => setActiveTab('poster')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'poster'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🖨️ 교실 게시판 인쇄용 안내장
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'qr' ? (
            <div className="space-y-6">
              {/* QR Canvas Center */}
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl border border-emerald-100 text-center shadow-inner">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-stone-200 inline-block mb-3">
                  <canvas ref={canvasRef} className="rounded-lg" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  스마트폰 카메라로 비추면 바로 열려요!
                </div>
                <p className="text-xs text-stone-500 max-w-xs">
                  로그인이나 회원가입 없이 바로 포스트잇을 붙일 수 있습니다.
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={handleDownloadQR}
                    className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    QR 이미지 저장
                  </button>
                  <button
                    onClick={() => setActiveTab('poster')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    인쇄용 안내장 보기
                  </button>
                </div>
              </div>

              {/* Direct Link Copy */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  접속 링크 복사하기
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-xl text-stone-600 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      copiedLink
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '복사됨!' : '링크 복사'}</span>
                  </button>
                </div>
              </div>

              {/* Kakao / Classroom Invitation Text */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    카카오톡 / 학급 밴드 공유용 문구
                  </span>
                  <button
                    onClick={handleCopyKakao}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKakao ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKakao ? '안내문 복사됨' : '안내문 복사'}</span>
                  </button>
                </div>
                <div className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {kakaoMessage}
                </div>
              </div>
            </div>
          ) : (
            /* Printable Classroom Poster Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  교실 뒤편 게시판이나 칠판 옆에 붙여둘 수 있는 A4 안내장 미리보기입니다.
                </span>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  안내장 인쇄하기 (Print)
                </button>
              </div>

              {/* Printable Card Area */}
              <div className="p-6 bg-amber-50/60 border-2 border-dashed border-amber-300 rounded-3xl text-center space-y-4">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full text-xs font-bold">
                  <School className="w-3.5 h-3.5" />
                  {teacherInfo.gradeClass || teacherInfo.schoolName}
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-cute text-stone-900">
                    🌸 {teacherInfo.name}께 마음을 전해요 🌸
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    선생님과의 소중한 추억과 감사 인사를 롤링페이퍼에 남겨주세요!
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-200 inline-block">
                  <canvas ref={canvasRef} />
                </div>

                <div className="space-y-1 text-xs text-stone-700 max-w-sm mx-auto bg-white/70 p-3 rounded-xl border border-amber-200">
                  <p className="font-bold text-amber-900">📌 참여 방법</p>
                  <p>1. 스마트폰 기본 카메라로 위 QR코드를 비춰주세요.</p>
                  <p>2. 열리는 웹페이지에서 원하는 색상의 포스트잇을 고르고 편지를 써주세요.</p>
                  <p>3. [롤링페이퍼 붙이기] 버튼을 누르면 끝!</p>
                </div>

                <p className="text-[11px] text-stone-400">
                  URL: {shareUrl}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
