'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ContentEditable from 'react-contenteditable';
import { chapterVariants } from '@/lib/animations';
import { useFlowStore } from '@/stores/flowStore';
import type { BookChapterContent } from '@/lib/types';

interface BookChapterProps {
  chapter: BookChapterContent;
}

/** Convert plain-text content (newline-separated) to HTML paragraphs */
function contentToHtml(content: string): string {
  return content
    .split('\n')
    .filter((p) => p.trim() && !p.startsWith('# '))
    .map((p) => `<p>${p}</p>`)
    .join('');
}

/** Convert HTML paragraphs back to newline-separated plain text */
function htmlToContent(html: string): string {
  return html
    .replace(/<\/p><p>/g, '\n')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '');
}

export function BookChapter({ chapter }: BookChapterProps) {
  const updateBookChapterTitle = useFlowStore((s) => s.updateBookChapterTitle);
  const updateBookChapterContent = useFlowStore((s) => s.updateBookChapterContent);

  const [title, setTitle] = useState(chapter.title);
  const contentHtml = useMemo(() => contentToHtml(chapter.content), [chapter.content]);
  const [body, setBody] = useState(contentHtml);

  const handleTitleChange = useCallback(
    (evt: { target: { value: string } }) => {
      setTitle(evt.target.value);
      updateBookChapterTitle(chapter.id, evt.target.value);
    },
    [chapter.id, updateBookChapterTitle]
  );

  const handleContentChange = useCallback(
    (evt: { target: { value: string } }) => {
      setBody(evt.target.value);
      updateBookChapterContent(chapter.id, htmlToContent(evt.target.value));
    },
    [chapter.id, updateBookChapterContent]
  );

  return (
    <motion.article
      id={`book-chapter-${chapter.id}`}
      variants={chapterVariants}
      className="mb-10 pb-10 border-b border-border-light last:border-b-0"
    >
      {/* Chapter number badge */}
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Chapter {chapter.number}
        </span>
      </div>

      {/* Chapter title — editable */}
      <ContentEditable
        html={title}
        onChange={handleTitleChange}
        tagName="h2"
        className="text-[20px] font-bold leading-[28px] text-text-primary mb-5 px-1 -mx-1 outline-none"
      />

      {/* Chapter content — editable flowing paragraphs */}
      <ContentEditable
        html={body}
        onChange={handleContentChange}
        tagName="div"
        className="space-y-4 text-[15px] leading-[1.85] text-text-secondary px-1 -mx-1 outline-none [&_p]:mb-4"
      />
    </motion.article>
  );
}
