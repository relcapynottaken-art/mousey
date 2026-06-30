import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function MouseyLogo({ className = "", ...props }: IconProps) {
  // Abstract "cursor + capture frame" mark for Mousey.
  return (
    <svg viewBox="0 0 32 32" className={className} {...props} aria-hidden="true">
      <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#mg)" />
      <path
        d="M11 9.5l9.5 5.2-4 1.4 2.4 4.2-1.9 1.1-2.4-4.2-3 3z"
        fill="#fff"
      />
      <defs>
        <linearGradient id="mg" x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Chrome({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 8.8h8.4M7.2 6.5l3.9 6.7M12.8 18.5l-3.9-6.7" />
    </svg>
  );
}

export function Layers({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
      <path d="M4 12l8 4.5L20 12M4 16.5L12 21l8-4.5" />
    </svg>
  );
}

export function TypeIcon({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 6.5V5h16v1.5M9 19h6M12 5v14" />
    </svg>
  );
}

export function Palette({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 3a9 9 0 100 18c1.7 0 2.2-1.3 1.4-2.3-.8-1-.3-2.2 1-2.2H18a3 3 0 003-3c0-4.6-4-7.5-9-7.5z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="14.5" cy="7.5" r="1" />
    </svg>
  );
}

export function Grid({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
    </svg>
  );
}

export function Sparkles({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" />
      <path d="M18.5 14.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" />
    </svg>
  );
}

export function Camera({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 8.5h3l1.3-2h7.4L17 8.5h3a0 0 0 010 0v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z" />
      <circle cx="12" cy="12.5" r="3" />
    </svg>
  );
}

export function Code({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
    </svg>
  );
}

export function History({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v3.7H7.7" />
      <path d="M12 8v4l3 1.6" />
    </svg>
  );
}

export function Ruler({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <rect x="3.5" y="8" width="17" height="8" rx="1.5" transform="rotate(0 12 12)" />
      <path d="M7 8v2.5M10 8v3.5M13 8v2.5M16 8v3.5" />
    </svg>
  );
}

export function Cursor({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M6 4l13 7-5.5 1.6L16 18l-2.3 1.2-2.5-5.4L6 17z" />
    </svg>
  );
}

export function Bolt({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" />
    </svg>
  );
}

export function Check({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function ArrowRight({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Discord({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M19.27 5.33A16.6 16.6 0 0015.05 4l-.2.4a13.6 13.6 0 014 2 13.7 13.7 0 00-12.7 0 13.6 13.6 0 014-2L9.95 4A16.6 16.6 0 005.73 5.33C2.98 9.4 2.23 13.37 2.6 17.28a16.7 16.7 0 005.1 2.6l.4-.62a10.9 10.9 0 01-1.72-.83l.43-.32a11.9 11.9 0 0010.38 0l.43.32a10.9 10.9 0 01-1.73.83l.4.62a16.7 16.7 0 005.1-2.6c.45-4.53-.77-8.46-3.13-11.95zM9.3 14.8c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2 1.8.9 1.79 2c0 1.1-.8 2-1.79 2zm5.4 0c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2 1.8.9 1.78 2c0 1.1-.79 2-1.78 2z" />
    </svg>
  );
}

export function Github({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  );
}

export function XSocial({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M17.5 3h3.2l-7 8 8.2 10.9h-6.4l-5-6.5-5.7 6.5H1.6l7.5-8.6L1 3h6.6l4.5 6 5.4-6zm-1.1 16.9h1.8L7.7 4.8H5.8l10.6 15.1z" />
    </svg>
  );
}
