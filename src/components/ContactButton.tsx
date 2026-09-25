import { useEffect, useRef, useState } from "react";

const EMAIL = "vikdopke@gmail.com";
const WHATSAPP_DISPLAY = "+55 41 99500-6333";
const WHATSAPP_URL = "https://wa.me/5541995006333";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on Escape or a click outside the widget
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable; the mailto link still works.
    }
  };

  const rowClass =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#222841] dark:text-[#c8cfe8] hover:bg-[#f1f4fa] dark:hover:bg-[#1a1f2e] transition-colors";

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          id="contact-panel"
          role="dialog"
          aria-label="Contact Viktor"
          className="w-[280px] rounded-xl bg-white dark:bg-[#131722] border border-[#e4e8f0] dark:border-[#1a1f2e] shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-2"
        >
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] dark:text-[#3d4560]">
            Get in touch
          </p>

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <span className="text-[#00a223]"><WhatsAppIcon /></span>
            <span className="flex flex-col">
              <span className="text-[13px] font-medium">WhatsApp</span>
              <span className="text-[12px] text-[#737373] dark:text-[#6b7591]">{WHATSAPP_DISPLAY}</span>
            </span>
          </a>

          <div className="flex items-center">
            <a href={`mailto:${EMAIL}`} className={`${rowClass} flex-1 min-w-0`}>
              <span className="text-[#222841] dark:text-[#c8cfe8]"><MailIcon /></span>
              <span className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium">Email</span>
                <span className="text-[12px] text-[#737373] dark:text-[#6b7591] truncate">{EMAIL}</span>
              </span>
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="shrink-0 px-2.5 py-1.5 mr-1 rounded-md text-[11px] font-medium text-[#737373] dark:text-[#6b7591] hover:text-[#222841] dark:hover:text-[#c8cfe8] hover:bg-[#f1f4fa] dark:hover:bg-[#1a1f2e] transition-colors"
              aria-label="Copy email address"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-panel"
        className="flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-[#222841] dark:bg-[#c8cfe8] text-white dark:text-[#0d1017] text-[13px] font-medium shadow-[0_8px_24px_rgba(34,40,65,0.25)] hover:bg-[#00a223] dark:hover:bg-[#00a223] dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a223] focus-visible:ring-offset-2"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <ChatIcon />
        )}
        {open ? "Close" : "Contact me"}
      </button>
    </div>
  );
}
