'use client';

export default function Logo() {
  return (
    <div className="flex items-center gap-[5px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/symbol.svg" alt="" className="h-[22px] w-[27px]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/wordmark.svg" alt="Designrr" className="h-[24px] w-[89px]" />
    </div>
  );
}
