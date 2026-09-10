interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  fallback?: string;
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ src, alt, size = "md", fallback, className = "" }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ""}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)] flex items-center justify-center font-bold ${sizes[size]} ${className}`}>
      {fallback || "?"}
    </div>
  );
}
