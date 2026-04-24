'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImportGoogleDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (urls: string[]) => void;
}

export default function ImportGoogleDocModal({ isOpen, onClose, onNext }: ImportGoogleDocModalProps) {
  const [urlValue, setUrlValue] = useState('');
  const [addedUrls, setAddedUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUrlValue('');
      setAddedUrls([]);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleAddUrl = () => {
    const trimmed = urlValue.trim();
    if (trimmed && !addedUrls.includes(trimmed)) {
      setAddedUrls((prev) => [...prev, trimmed]);
      setUrlValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const fileCount = addedUrls.length;
  const canProceed = fileCount > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className="flex w-full flex-col overflow-hidden bg-white"
              style={{
                maxWidth: 527,
                borderRadius: 12,
                boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex w-full shrink-0 items-center justify-between"
                style={{
                  padding: 12,
                  borderBottom: '1px solid #E0E5EB',
                  borderRadius: '12px 12px 0 0',
                }}
              >
                <div className="flex items-center" style={{ gap: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/icon-gdoc.png"
                    alt=""
                    className="shrink-0"
                    style={{ width: 18, height: 18, objectFit: 'contain' }}
                  />
                  <span
                    className="shrink-0 whitespace-nowrap font-normal"
                    style={{ fontSize: 14, lineHeight: '20px', color: '#52637A' }}
                  >
                    Import from Google Doc
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="flex shrink-0 cursor-pointer items-center justify-center overflow-hidden"
                  style={{ width: 14, height: 14 }}
                  aria-label="Close"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/icon-xmark.svg"
                    alt=""
                    style={{ width: 14, height: 14 }}
                  />
                </button>
              </div>

              {/* ── Content ── */}
              <div
                className="flex w-full shrink-0 flex-col items-center overflow-hidden bg-white"
                style={{ paddingTop: 12, gap: 16 }}
              >
                {/* URL import area — 503px centered */}
                <div className="flex shrink-0 flex-col items-start" style={{ width: 503 }}>
                  <div className="flex w-full flex-col items-start" style={{ gap: 4 }}>
                    <p
                      className="shrink-0 whitespace-nowrap font-normal"
                      style={{ fontSize: 14, lineHeight: '18px', color: '#15191F' }}
                    >
                      Import from URL
                    </p>
                    <div
                      className="flex w-full items-center"
                      style={{
                        border: '1px solid #E0E5EB',
                        borderRadius: 4,
                        padding: 12,
                        gap: 12,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/icon-link-chain.svg"
                        alt=""
                        className="shrink-0 overflow-hidden"
                        style={{ width: 16, height: 16 }}
                      />
                      <input
                        type="url"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Insert here Google Doc URL"
                        className="min-w-0 flex-1 bg-transparent font-normal focus:outline-none"
                        style={{
                          fontSize: 14,
                          lineHeight: '22px',
                          color: '#15191F',
                        }}
                      />
                      <button
                        className="shrink-0 cursor-pointer font-semibold whitespace-nowrap transition-colors"
                        style={{
                          fontSize: 16,
                          lineHeight: '20px',
                          color: urlValue.trim() ? '#006EFE' : '#CCE2FF',
                        }}
                        onClick={handleAddUrl}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added URLs list */}
                <AnimatePresence>
                  {addedUrls.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex w-full flex-col px-3"
                      style={{ gap: 8 }}
                    >
                      {addedUrls.map((url, index) => (
                        <motion.div
                          key={url}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex w-full items-center"
                          style={{
                            backgroundColor: '#F6F7F9',
                            borderRadius: 8,
                            padding: '10px 16px',
                            gap: 8,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/icon-gdoc.png"
                            alt=""
                            className="shrink-0"
                            style={{ width: 18, height: 18, objectFit: 'contain' }}
                          />
                          <p
                            className="min-w-0 flex-1 truncate font-normal"
                            style={{ fontSize: 14, lineHeight: '20px', color: '#15191F' }}
                          >
                            {url}
                          </p>
                          <button
                            onClick={() => setAddedUrls((prev) => prev.filter((_, i) => i !== index))}
                            className="shrink-0 cursor-pointer overflow-hidden"
                            style={{ width: 14, height: 14 }}
                            aria-label="Remove URL"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/assets/icon-xmark.svg"
                              alt=""
                              style={{ width: 14, height: 14 }}
                            />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div
                  className="flex w-full shrink-0 flex-col items-center"
                  style={{ gap: 10 }}
                >
                  {/* Separator line */}
                  <div
                    className="w-full shrink-0"
                    style={{ height: 1, backgroundColor: '#E0E5EB' }}
                  />

                  {/* Footer content — 499px centered */}
                  <div
                    className="flex shrink-0 items-center justify-between"
                    style={{ width: 499, paddingBottom: 12 }}
                  >
                    <span
                      className="shrink-0 whitespace-nowrap font-normal"
                      style={{ fontSize: 14, lineHeight: '18px', color: '#667C98' }}
                    >
                      {fileCount} {fileCount === 1 ? 'file' : 'files'}
                    </span>
                    <button
                      onClick={() => {
                        if (!canProceed || isProcessing) return;
                        setIsProcessing(true);
                        setTimeout(() => {
                          onNext(addedUrls);
                        }, 800);
                      }}
                      disabled={!canProceed || isProcessing}
                      className="flex shrink-0 items-center justify-center font-semibold whitespace-nowrap text-white transition-all duration-200"
                      style={{
                        fontSize: 14,
                        lineHeight: '18px',
                        height: 38,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 14,
                        paddingBottom: 14,
                        borderRadius: 8,
                        backgroundColor: canProceed ? '#006EFE' : '#CCE2FF',
                        cursor: canProceed && !isProcessing ? 'pointer' : 'not-allowed',
                        gap: 6,
                      }}
                    >
                      {isProcessing && (
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      )}
                      {isProcessing ? 'Importing...' : 'Next'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
