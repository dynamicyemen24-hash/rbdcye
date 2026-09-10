import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const RohamaaHeart: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path d="M12 21.35c0 0-3-2-5-5" strokeWidth={1.5} />
    <path d="M12 21.35c0 0 3-2 5-5" strokeWidth={1.5} />
    <path d="M7 14c-1.5-1-2.5-2.5-2.5-4" strokeWidth={1.5} />
    <path d="M17 14c1.5-1 2.5-2.5 2.5-4" strokeWidth={1.5} />
  </svg>
);

export const CommunityIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="9" r="2.5" />
    <circle cx="7.5" cy="11" r="2" />
    <circle cx="16.5" cy="11" r="2" />
    <path d="M12 12.5c-2 0-3.5 1-4 2.5" />
    <path d="M12 12.5c2 0 3.5 1 4 2.5" />
    <path d="M6 14.5c0 1.5.8 2.8 2 3.5" />
    <path d="M18 14.5c0 1.5-.8 2.8-2 3.5" />
  </svg>
);

export const TrustShield: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <path d="M12 2l8 3.5v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11v-5L12 2z" />
    <polyline points="9 12 11 14 15 10" />
    <circle cx="12" cy="12" r="6" strokeWidth={0.5} strokeDasharray="2 2" />
  </svg>
);

export const ImpactArrow: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
    <line x1="12" y1="4" x2="14.5" y2="2.5" strokeWidth={1.2} />
    <line x1="12" y1="4" x2="9.5" y2="2.5" strokeWidth={1.2} />
    <line x1="12" y1="4" x2="12" y2="1.5" strokeWidth={1.2} />
  </svg>
);

export const YemenMap: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <path d="M4 7c1-2 3-3 5-3h2c1 0 2.5.5 3 1.5.5-1 2-1.5 3-1.5h2c1.5 0 3 1 3 2.5v8c0 2-1.5 3.5-3.5 3.5-1.5 0-3-.5-4-2l-1-1.5-1 1.5c-1 1.5-2.5 2-4 2C5.5 19 4 17.5 4 15.5V7z" />
    <path d="M8 10h8" strokeWidth={1} />
    <path d="M9 13h6" strokeWidth={1} />
  </svg>
);

export const IslamicStar: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <polygon points="12 1 14.5 8.5 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9.5 8.5" />
    <circle cx="12" cy="12" r="3.5" strokeWidth={0.8} strokeDasharray="1.5 1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const BadgeIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <circle cx="12" cy="9" r="7" />
    <path d="M8.5 15.5L7 22l5-2 5 2-1.5-6.5" />
    <path d="M15 6a3.5 3.5 0 00-3.5-3A3.5 3.5 0 008 6" strokeWidth={0} fill="none" />
    <path d="M12 3.5c.3 0 .6.1.8.3a3.5 3.5 0 01-1.6 6.2 3.5 3.5 0 01-1.6-6.2c.2-.2.5-.3.8-.3z" fill="currentColor" stroke="none" opacity={0.15} />
    <path d="M15 5c1.5.5 2.5 1.5 3 3" strokeWidth={1.2} />
    <path d="M15 5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L14 7l1.5-.5z" strokeWidth={0} fill="currentColor" />
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" strokeWidth={1.2} />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" strokeWidth={1.2} />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" strokeWidth={1.2} />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" strokeWidth={1.2} />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" strokeWidth={1.2} />
  </svg>
);
