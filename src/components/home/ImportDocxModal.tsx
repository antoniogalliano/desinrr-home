'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImportDocxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (files: File[]) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'done';
}

export default function ImportDocxModal({ isOpen, onClose, onNext }: ImportDocxModalProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [urlValue, setUrlValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRefs = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUploadingFiles([]);
      setUrlValue('');
      setIsDragOver(false);
      setIsProcessing(false);
      intervalRefs.current.forEach((interval) => clearInterval(interval));
      intervalRefs.current.clear();
    }
  }, [isOpen]);

  const simulateUpload = useCallback((file: File) => {
    const key = `${file.name}-${Date.now()}`;
    setUploadingFiles((prev) => [...prev, { file, progress: 0, status: 'uploading' }]);

    const interval = setInterval(() => {
      setUploadingFiles((prev) =>
        prev.map((f) => {
          if (f.file === file && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 15 + 5, 100);
            if (newProgress >= 100) {
              clearInterval(intervalRefs.current.get(key)!);
              intervalRefs.current.delete(key);
              return { ...f, progress: 100, status: 'done' as const };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 300);

    intervalRefs.current.set(key, interval);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const accepted = Array.from(files).filter((f) =>
        /\.(doc|docx|rtf)$/i.test(f.name)
      );
      accepted.forEach(simulateUpload);
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const completedFiles = uploadingFiles.filter((f) => f.status === 'done');
  const fileCount = uploadingFiles.length;
  const canProceed = completedFiles.length > 0;

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
              className="flex w-full flex-col items-center overflow-hidden bg-white"
              style={{
                maxWidth: 527,
                gap: 8,
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
                    src="/assets/docx-icon-small.svg"
                    alt=""
                    className="shrink-0 overflow-hidden"
                    style={{ width: 20, height: 20 }}
                  />
                  <span
                    className="shrink-0 whitespace-nowrap font-normal"
                    style={{ fontSize: 14, lineHeight: '20px', color: '#52637A' }}
                  >
                    Import from DOCX
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="flex shrink-0 cursor-pointer items-center justify-center overflow-hidden"
                  style={{ width: 24, height: 24 }}
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

              {/* ── Drop zone wrapper — 499px centered ── */}
              <div className="flex shrink-0 flex-col" style={{ width: 499, gap: 12 }}>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleBrowse}
                  className="flex w-full cursor-pointer flex-col items-center transition-colors"
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    gap: 12,
                    borderRadius: 12,
                    border: `1px dashed ${isDragOver ? '#006EFE' : '#E0E5EB'}`,
                    backgroundColor: isDragOver ? '#F0F4FF' : '#FFFFFF',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".doc,.docx,.rtf"
                    className="hidden"
                    onChange={handleFileInput}
                    multiple
                  />

                  {/* Word icon (56px) with overlaid upload badge — matches Figma's
                     two-layer approach: clipped 56×56 doc + badge circle on top */}
                  <div className="relative inline-grid shrink-0" style={{ width: 56, height: 56 }}>
                    {/* Document icon — use the small SVG scaled up to 56px */}
                    <div className="overflow-hidden" style={{ gridArea: '1/1', width: 56, height: 56 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/docx-icon-small.svg"
                        alt=""
                        style={{ width: 56, height: 56 }}
                      />
                    </div>
                    {/* Upload badge — gray circle with upload arrow */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        gridArea: '1/1',
                        alignSelf: 'end',
                        justifySelf: 'end',
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                        backgroundColor: '#E0E5EB',
                        padding: 4,
                        boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/icon-uploads.svg"
                        alt=""
                        style={{ width: 12, height: 12 }}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex shrink-0 flex-col items-center text-center" style={{ gap: 4 }}>
                    <p style={{ fontSize: 16, lineHeight: '20px', color: '#15191F' }}>
                      <span>Drag and drop your file or </span>
                      <span
                        className="font-semibold"
                        style={{ color: '#006EFE', lineHeight: '26px' }}
                      >
                        browse
                      </span>
                    </p>
                    <p style={{ fontSize: 12, lineHeight: '16px', color: '#8596AD' }}>
                      Word.doc
                    </p>
                  </div>
                </div>

                {/* Uploaded files list */}
                <AnimatePresence>
                  {uploadingFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col"
                      style={{ gap: 12 }}
                    >
                      {uploadingFiles.map((item, index) => (
                        <motion.div
                          key={`${item.file.name}-${index}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex w-full flex-col"
                          style={{
                            backgroundColor: '#F6F7F9',
                            borderRadius: 8,
                            padding: 16,
                            gap: 12,
                          }}
                        >
                          {/* Top row: icon + file info + close */}
                          <div className="flex items-center" style={{ gap: 8 }}>
                            {/* White icon box */}
                            <div
                              className="shrink-0 overflow-hidden"
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 4,
                                padding: 11,
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/assets/docx-icon-small.svg"
                                alt=""
                                style={{ width: 24, height: 24 }}
                              />
                            </div>
                            {/* File info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex min-w-0 flex-col items-start">
                                  <p
                                    className="truncate font-normal"
                                    style={{ fontSize: 16, lineHeight: '20px', color: '#15191F' }}
                                  >
                                    {item.file.name}
                                  </p>
                                  <p
                                    className="font-normal"
                                    style={{ fontSize: 12, lineHeight: '16px', color: '#52637A' }}
                                  >
                                    {formatFileSize(item.file.size)}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                  }}
                                  className="shrink-0 cursor-pointer overflow-hidden"
                                  style={{ width: 18, height: 18 }}
                                  aria-label="Remove file"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src="/assets/icon-xmark.svg"
                                    alt=""
                                    style={{ width: 18, height: 18 }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Progress bar — only shown while uploading */}
                          {item.status === 'uploading' && (
                            <div className="flex w-full items-center" style={{ gap: 8 }}>
                              <div className="relative flex-1" style={{ height: 4 }}>
                                {/* Track */}
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    backgroundColor: '#E0E5EB',
                                    borderRadius: 2,
                                  }}
                                />
                                {/* Fill */}
                                <motion.div
                                  className="absolute top-0 left-0"
                                  style={{
                                    height: 4,
                                    backgroundColor: '#006EFE',
                                    borderRadius: 2,
                                  }}
                                  initial={{ width: '0%' }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <span
                                className="shrink-0 whitespace-nowrap font-normal tabular-nums"
                                style={{
                                  fontSize: 14,
                                  lineHeight: '22px',
                                  color: '#52637A',
                                }}
                              >
                                {Math.round(item.progress)}%
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Bottom section — URL + Footer ── */}
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
                      Or import from URL
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
                        src="/assets/icon-link.svg"
                        alt=""
                        className="shrink-0 overflow-hidden"
                        style={{ width: 16, height: 16 }}
                      />
                      <input
                        type="url"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        placeholder="Insert URL here"
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
                        onClick={() => {
                          if (urlValue.trim()) {
                            // TODO: handle URL import
                            setUrlValue('');
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer — 527px full width */}
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
                        // Brief processing delay for visual feedback
                        setTimeout(() => {
                          onNext(completedFiles.map((f) => f.file));
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}
