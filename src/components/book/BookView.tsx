'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ContentEditable from 'react-contenteditable';
import { staggerContainer } from '@/lib/animations';
import { useFlowStore } from '@/stores/flowStore';
import { BookHeader } from './BookHeader';
import { BookChapter } from './BookChapter';
import { ManuscriptSkeleton } from './ManuscriptSkeleton';

const ZOOM_OPTIONS = [50, 75, 100, 125, 150];
type ZoomMode = 'level' | 'fit-page' | 'fit-width';

export function BookView() {
  const book = useFlowStore((s) => s.generatedBook);
  const isImporting = useFlowStore((s) => s.isImporting);
  const updateBookTitle = useFlowStore((s) => s.updateBookTitle);
  const updateBookSubtitle = useFlowStore((s) => s.updateBookSubtitle);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [zoomMode, setZoomMode] = useState<ZoomMode>('fit-width');
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState(book?.title ?? '');
  const [bookSubtitle, setBookSubtitle] = useState(book?.subtitle ?? '');
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const zoomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [showToolbarTitle, setShowToolbarTitle] = useState(false);

  // Estimate page count from content (~250 words per page)
  const pageCount = book?.chapters.reduce((total, ch) => {
    const text = ch.content.replace(/<[^>]*>/g, '').trim();
    if (!text) return total;
    const wordCount = text.split(/\s+/).length;
    return total + Math.max(1, Math.ceil(wordCount / 250));
  }, 0) ?? 0;

  const handleTitleChange = useCallback(
    (evt: { target: { value: string } }) => {
      setBookTitle(evt.target.value);
      updateBookTitle(evt.target.value);
    },
    [updateBookTitle]
  );

  const handleSubtitleChange = useCallback(
    (evt: { target: { value: string } }) => {
      setBookSubtitle(evt.target.value);
      updateBookSubtitle(evt.target.value);
    },
    [updateBookSubtitle]
  );

  // Close zoom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (zoomRef.current && !zoomRef.current.contains(e.target as Node)) {
        setShowZoomDropdown(false);
      }
    }
    if (showZoomDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showZoomDropdown]);

  // Show toolbar on scroll up, hide on scroll down + track active chapter
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !book) return;

    function handleScroll() {
      const currentY = container!.scrollTop;
      if (currentY < lastScrollY.current) {
        setToolbarVisible(true);
      } else if (currentY > lastScrollY.current && currentY > 60) {
        setToolbarVisible(false);
      }
      lastScrollY.current = currentY;

      // Detect which chapter is currently in view
      const containerRect = container!.getBoundingClientRect();
      const threshold = containerRect.top + containerRect.height * 0.3;
      let visibleChapterId: string | null = null;
      for (const ch of book!.chapters) {
        const el = document.getElementById(`book-chapter-${ch.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            visibleChapterId = ch.id;
          }
        }
      }
      if (visibleChapterId) {
        setActiveChapterId(visibleChapterId);
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [book]);

  // Show title in toolbar when the original title scrolls out of view
  useEffect(() => {
    const titleEl = titleRef.current;
    const root = scrollRef.current;
    if (!titleEl || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowToolbarTitle(!entry.isIntersecting),
      { root, threshold: 0 }
    );
    observer.observe(titleEl);
    return () => observer.disconnect();
  }, [book]);

  /** Smooth-scroll to a chapter and mark it as active */
  const scrollToChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    const el = document.getElementById(`book-chapter-${chapterId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isImporting) return <ManuscriptSkeleton />;
  if (!book) return null;

  return (
    <div className="h-full flex overflow-hidden relative bg-white">
      {/* TOC — vertically centered on left side */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex items-center"
        onMouseEnter={() => setShowToc(true)}
        onMouseLeave={() => setShowToc(false)}
      >
        {/* Icon area — pl-4 (16px) + icon 32px + pr-3 (12px) = 60px to popup */}
        <div className="pl-4 pr-3">
          <button className="cursor-pointer" title="Table of contents">
            <svg width="32" height="50" viewBox="0 0 32 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              {(() => {
                const LINE_COUNT = 7;
                const lineYPositions = [0, 8, 16, 24, 32, 40, 48];
                const activeIndex = activeChapterId
                  ? book.chapters.findIndex((ch) => ch.id === activeChapterId)
                  : -1;
                // Map chapter index (0..n-1) to line index (0..6)
                const activeLineIndex =
                  activeIndex >= 0
                    ? Math.round((activeIndex / (book.chapters.length - 1)) * (LINE_COUNT - 1))
                    : 0; // default: first line active when no chapter selected

                return lineYPositions.map((y, i) => {
                  const isActiveLine = i === activeLineIndex;
                  return (
                    <motion.rect
                      key={i}
                      y={y}
                      height={2}
                      rx={1}
                      animate={{
                        width: isActiveLine ? 32 : 16,
                        fill: isActiveLine ? '#52637A' : '#C2CBD6',
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  );
                });
              })()}
            </svg>
          </button>
        </div>

        {/* TOC popup — appears on hover */}
        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="bg-white flex flex-col"
              style={{
                width: 259,
                padding: 16,
                gap: 12,
                borderRadius: 12,
                boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              {book.chapters.map((ch) => {
                const isActive = activeChapterId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => scrollToChapter(ch.id)}
                    className="text-left font-sans text-[14px] font-semibold leading-[18px] cursor-pointer transition-colors hover:text-[#29323D]"
                    style={{ color: isActive ? '#29323D' : '#8596AD' }}
                  >
                    {ch.number}: {ch.title}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto">
        {/* Mainbar + Toolbar — both sticky at top */}
        <div className="sticky top-0 z-20 bg-white">
          {/* Mainbar — slides up when scrolling down, reveals on scroll up */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ marginTop: toolbarVisible ? 0 : -56 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <BookHeader />
            </motion.div>
          </div>

          {/* Toolbar — always visible */}
          <div>
          {/* Info row: metadata */}
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-border-light relative">
            {/* Center: Manuscript title — appears when scrolled past original */}
            <AnimatePresence>
              {showToolbarTitle && bookTitle && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-semibold text-text-primary truncate max-w-[40%] pointer-events-none"
                  style={{ fontFamily: 'var(--font-nunito-sans)' }}
                  dangerouslySetInnerHTML={{ __html: bookTitle.replace(/<[^>]*>/g, '') }}
                />
              )}
            </AnimatePresence>

            {/* Left: metadata */}
            <div className="flex items-center gap-0 text-[13px] text-text-tertiary">
              <span className="text-text-tertiary">Last edited: now</span>
              <div className="w-px h-4 bg-[#E0E5EB] mx-3" />
              {/* Pages icon from Figma */}
              {pageCount > 0 && (
                <>
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="16" viewBox="11 9.5 10.5 13.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.1102 20.6701V14.4479H17.388C16.7439 14.4479 16.2214 13.9253 16.2214 13.2813V10.559H13.1102C12.68 10.559 12.3325 10.9066 12.3325 11.3368V20.6701C12.3325 21.1003 12.68 21.4479 13.1102 21.4479H19.3325C19.7627 21.4479 20.1102 21.1003 20.1102 20.6701ZM20.0981 13.6701C20.0811 13.6021 20.047 13.5389 19.996 13.4903L17.179 10.6733C17.128 10.6222 17.0672 10.5882 16.9991 10.5712V13.2813C16.9991 13.4951 17.1741 13.6701 17.388 13.6701H20.0981ZM11.5547 11.3368C11.5547 10.4788 12.2523 9.78125 13.1102 9.78125H16.9043C17.213 9.78125 17.5095 9.90521 17.7283 10.124L20.5453 12.9385C20.7641 13.1573 20.888 13.4538 20.888 13.7625V20.6701C20.888 21.5281 20.1905 22.2257 19.3325 22.2257H13.1102C12.2523 22.2257 11.5547 21.5281 11.5547 20.6701V11.3368Z" fill="#8596AD"/>
                    </svg>
                    {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                  </span>
                  <div className="w-px h-4 bg-[#E0E5EB] mx-3" />
                </>
              )}
              {/* Saved cloud icon from Figma */}
              <span className="flex items-center gap-1 text-[#29A341]">
                <svg width="22" height="16" viewBox="1 5 25.5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.3205 8.98969C15.3213 7.56945 13.6752 6.64688 11.8109 6.64688C8.84797 6.64688 6.43242 8.98203 6.30227 11.9105C6.2793 12.4082 5.95773 12.8446 5.48688 13.013C3.81781 13.6026 2.62344 15.1913 2.62344 17.0594C2.62344 19.429 4.54133 21.3469 6.91094 21.3469H20.9984C23.0273 21.3469 24.6734 19.7008 24.6734 17.6719C24.6734 16.2631 23.881 15.0381 22.7134 14.4218C22.2005 14.15 21.9478 13.5605 22.1086 13.0016C22.1852 12.7374 22.2234 12.4541 22.2234 12.1594C22.2234 10.4673 20.853 9.09688 19.1609 9.09688C18.6901 9.09688 18.246 9.20406 17.8479 9.39164C17.3081 9.64812 16.665 9.47969 16.3205 8.98969ZM11.8109 5.42188C14.0887 5.42188 16.1023 6.55117 17.3234 8.28531C17.8785 8.02117 18.5025 7.87188 19.1609 7.87188C21.5305 7.87188 23.4484 9.78977 23.4484 12.1594C23.4484 12.569 23.391 12.9633 23.2838 13.3384C24.838 14.1577 25.8984 15.7923 25.8984 17.6719C25.8984 20.3784 23.7049 22.5719 20.9984 22.5719H6.91094C3.86758 22.5719 1.39844 20.1027 1.39844 17.0594C1.39844 14.6553 2.93734 12.6149 5.08109 11.857C5.23805 8.27766 8.18953 5.42188 11.8109 5.42188ZM17.756 13.2045L12.856 18.1045C12.6187 18.3418 12.2282 18.3418 11.9909 18.1045L9.54086 15.6545C9.30352 15.4171 9.30352 15.0266 9.54086 14.7893C9.7782 14.552 10.1687 14.552 10.406 14.7893L12.4234 16.8067L16.8909 12.3393C17.1282 12.102 17.5187 12.102 17.756 12.3393C17.9934 12.5766 17.9934 12.9671 17.756 13.2045Z" fill="#29A341"/>
                </svg>
                Saved
              </span>
            </div>

            {/* Right: Tool buttons */}
            <div className="flex items-center gap-1">
              {/* Undo */}
              <button
                className="w-10 h-[38px] rounded-md flex items-center justify-center hover:bg-surface transition-colors cursor-pointer"
                title="Undo"
              >
                <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.9643 17.1429C13.7089 17.1429 13.5 16.9339 13.5 16.6786V12.9643C13.5 12.7089 13.7089 12.5 13.9643 12.5C14.2196 12.5 14.4286 12.7089 14.4286 12.9643V15.6513C15.5661 13.7623 17.635 12.5 20 12.5C23.5895 12.5 26.5 15.4105 26.5 19C26.5 22.5895 23.5895 25.5 20 25.5C17.6815 25.5 15.6473 24.2871 14.4953 22.4589C14.3067 22.1571 14.5359 21.7857 14.8929 21.7857C15.067 21.7857 15.2237 21.8786 15.3194 22.0237C16.3118 23.5558 18.0384 24.5714 20 24.5714C23.0759 24.5714 25.5714 22.0759 25.5714 19C25.5714 15.9241 23.0759 13.4286 20 13.4286C17.9368 13.4286 16.1377 14.5487 15.1743 16.2143H17.6786C17.9339 16.2143 18.1429 16.4232 18.1429 16.6786C18.1429 16.9339 17.9339 17.1429 17.6786 17.1429H13.9643Z" fill="#3D4A5C"/>
                </svg>
              </button>

              {/* Redo */}
              <button
                className="w-10 h-[38px] rounded-md flex items-center justify-center hover:bg-surface transition-colors cursor-pointer"
                title="Redo"
              >
                <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.0357 17.1429C26.2911 17.1429 26.5 16.9339 26.5 16.6786V12.9643C26.5 12.7089 26.2911 12.5 26.0357 12.5C25.7804 12.5 25.5714 12.7089 25.5714 12.9643V15.6513C24.4339 13.7623 22.365 12.5 20 12.5C16.4105 12.5 13.5 15.4105 13.5 19C13.5 22.5895 16.4105 25.5 20 25.5C22.3185 25.5 24.3527 24.2871 25.5047 22.4589C25.6933 22.1571 25.4641 21.7857 25.1071 21.7857C24.933 21.7857 24.7763 21.8786 24.6806 22.0237C23.6882 23.5558 21.9616 24.5714 20 24.5714C16.9241 24.5714 14.4286 22.0759 14.4286 19C14.4286 15.9241 16.9241 13.4286 20 13.4286C22.0632 13.4286 23.8623 14.5487 24.8257 16.2143H22.3214C22.0661 16.2143 21.8571 16.4232 21.8571 16.6786C21.8571 16.9339 22.0661 17.1429 22.3214 17.1429H26.0357Z" fill="#8596AD"/>
                </svg>
              </button>

              {/* Divider */}
              <div className="w-px h-4 bg-[#E0E5EB] mx-1" />

              {/* Zoom dropdown */}
              <div className="relative" ref={zoomRef}>
                <button
                  onClick={() => setShowZoomDropdown(!showZoomDropdown)}
                  className="flex items-center gap-1.5 h-[38px] px-2 rounded-md hover:bg-surface transition-colors cursor-pointer"
                  title="Zoom"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33333 2.66667C8.57101 2.66667 9.75798 3.15833 10.6332 4.03351C11.5083 4.90868 12 6.09566 12 7.33333C12 8.49333 11.5733 9.56 10.876 10.3813L11.1547 10.66H11.8333L15.1667 14L14 15.1667L10.66 11.8333V11.1547L10.3813 10.876C9.56 11.5733 8.49333 12 7.33333 12C6.09566 12 4.90868 11.5083 4.03351 10.6332C3.15833 9.75798 2.66667 8.57101 2.66667 7.33333C2.66667 6.09566 3.15833 4.90868 4.03351 4.03351C4.90868 3.15833 6.09566 2.66667 7.33333 2.66667ZM7.33333 4C5.49333 4 4 5.49333 4 7.33333C4 9.17333 5.49333 10.6667 7.33333 10.6667C9.17333 10.6667 10.6667 9.17333 10.6667 7.33333C10.6667 5.49333 9.17333 4 7.33333 4Z" fill="#3D4A5C"/>
                  </svg>
                  <span className="text-sm font-medium text-[#3D4A5C] min-w-[32px] text-center whitespace-nowrap">
                    {zoomMode === 'fit-width' ? 'Fit width' : zoomMode === 'fit-page' ? 'Fit page' : `${zoomLevel}%`}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.338 5.672C5.152 5.858 4.847 5.858 4.662 5.672L0.917 1.927C0.731 1.742 0.731 1.437 0.917 1.251C1.102 1.066 1.407 1.066 1.593 1.251L5 4.658L8.407 1.251C8.592 1.066 8.897 1.066 9.083 1.251C9.268 1.437 9.268 1.742 9.083 1.927L5.338 5.672Z" fill="#8596AD"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {showZoomDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 bg-white z-50"
                      style={{
                        borderRadius: 12,
                        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
                        minWidth: 160,
                        padding: '8px 0',
                      }}
                    >
                      {/* Percentage options */}
                      {ZOOM_OPTIONS.map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setZoomLevel(level);
                            setZoomMode('level');
                            setShowZoomDropdown(false);
                          }}
                          className="w-full flex items-center cursor-pointer transition-colors hover:bg-[#F6F7F9]"
                          style={{
                            padding: '10px 20px',
                            fontFamily: 'var(--font-nunito-sans)',
                            fontSize: 14,
                            fontWeight: zoomMode === 'level' && zoomLevel === level ? 600 : 400,
                            lineHeight: '20px',
                            color: zoomMode === 'level' && zoomLevel === level ? '#006EFE' : '#3D4A5C',
                          }}
                        >
                          {level}%
                        </button>
                      ))}

                      {/* Divider */}
                      <div style={{ borderTop: '1px solid #E0E5EB', margin: '8px 16px' }} />

                      {/* Fit page */}
                      <button
                        onClick={() => {
                          setZoomMode('fit-page');
                          setShowZoomDropdown(false);
                        }}
                        className="w-full flex items-center cursor-pointer transition-colors hover:bg-[#F6F7F9]"
                        style={{
                          padding: '10px 20px',
                          fontFamily: 'var(--font-nunito-sans)',
                          fontSize: 14,
                          fontWeight: zoomMode === 'fit-page' ? 600 : 400,
                          lineHeight: '20px',
                          color: zoomMode === 'fit-page' ? '#006EFE' : '#3D4A5C',
                        }}
                      >
                        Fit page
                      </button>

                      {/* Fit width */}
                      <button
                        onClick={() => {
                          setZoomMode('fit-width');
                          setShowZoomDropdown(false);
                        }}
                        className="w-full flex items-center cursor-pointer transition-colors hover:bg-[#F6F7F9]"
                        style={{
                          padding: '10px 20px',
                          fontFamily: 'var(--font-nunito-sans)',
                          fontSize: 14,
                          fontWeight: zoomMode === 'fit-width' ? 600 : 400,
                          lineHeight: '20px',
                          color: zoomMode === 'fit-width' ? '#006EFE' : '#3D4A5C',
                        }}
                      >
                        Fit width
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-[#E0E5EB] mx-1" />

              {/* Three dots menu */}
              <button
                className="w-6 h-[38px] rounded-md flex items-center justify-center hover:bg-surface transition-colors cursor-pointer"
                title="More options"
              >
                <svg width="24" height="38" viewBox="0 0 24 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7791 23.447C11.4844 23.447 11.2018 23.5641 10.9934 23.7725C10.785 23.9809 10.668 24.2635 10.668 24.5582C10.668 24.8528 10.785 25.1355 10.9934 25.3438C11.2018 25.5522 11.4844 25.6693 11.7791 25.6693C12.0738 25.6693 12.3564 25.5522 12.5648 25.3438C12.7731 25.1355 12.8902 24.8528 12.8902 24.5582C12.8902 24.2635 12.7731 23.9809 12.5648 23.7725C12.3564 23.5641 12.0738 23.447 11.7791 23.447ZM11.7791 17.8915C11.4844 17.8915 11.2018 18.0086 10.9934 18.2169C10.785 18.4253 10.668 18.7079 10.668 19.0026C10.668 19.2973 10.785 19.5799 10.9934 19.7883C11.2018 19.9967 11.4844 20.1137 11.7791 20.1137C12.0738 20.1137 12.3564 19.9967 12.5648 19.7883C12.7731 19.5799 12.8902 19.2973 12.8902 19.0026C12.8902 18.7079 12.7731 18.4253 12.5648 18.2169C12.3564 18.0086 12.0738 17.8915 11.7791 17.8915ZM12.8902 13.447C12.8902 13.1524 12.7731 12.8697 12.5648 12.6614C12.3564 12.453 12.0738 12.3359 11.7791 12.3359C11.4844 12.3359 11.2018 12.453 10.9934 12.6614C10.785 12.8697 10.668 13.1524 10.668 13.447C10.668 13.7417 10.785 14.0243 10.9934 14.2327C11.2018 14.4411 11.4844 14.5582 11.7791 14.5582C12.0738 14.5582 12.3564 14.4411 12.5648 14.2327C12.7731 14.0243 12.8902 13.7417 12.8902 13.447Z" fill="#001633"/>
                </svg>
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Book content */}
        <motion.div
          className="bg-white"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 20,
            delay: 0.1,
          }}
        >
          {/* Centered book content — zoom applied here */}
          <div
            className="mx-auto px-8 transition-all duration-200"
            style={{
              maxWidth: zoomMode === 'fit-page' ? 580 : zoomMode === 'fit-width' ? '48rem' : '48rem',
              zoom: zoomMode === 'level' ? zoomLevel / 100 : 1,
            }}
          >
            {/* Book title page */}
            <motion.div
              ref={titleRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-10 pb-8 border-b border-[#E0E5EB] mb-8"
            >
              <ContentEditable
                html={bookTitle}
                onChange={handleTitleChange}
                tagName="h1"
                className="text-[28px] font-bold leading-[36px] text-text-primary mb-2 px-1 -mx-1 outline-none"
              />
              <ContentEditable
                html={bookSubtitle}
                onChange={handleSubtitleChange}
                tagName="p"
                className="text-[15px] leading-[22px] text-text-muted px-1 -mx-1 outline-none"
              />
            </motion.div>

            {/* Chapters */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {book.chapters.map((chapter) => (
                <BookChapter key={chapter.id} chapter={chapter} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
