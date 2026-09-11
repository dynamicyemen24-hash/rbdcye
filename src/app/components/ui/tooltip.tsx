import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, memo, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = memo(function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number>();

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleLeave = () => {
    timeoutRef.current = window.setTimeout(() => setShow(false), 200);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onFocus={handleEnter} onBlur={handleLeave}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute ${positions[position]} z-50 whitespace-nowrap rounded-lg bg-[var(--foreground)] px-3 py-1.5 text-xs text-[var(--background)] shadow-lg`}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export interface TooltipContentProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  hidden?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const TooltipTrigger = memo(function TooltipTrigger({ children, ...props }: React.ComponentPropsWithoutRef<'button'> & { asChild?: boolean }) {
  if (props.asChild) {
    return <span {...props}>{children}</span>;
  }
  return <button {...props}>{children}</button>;
});

export const TooltipProvider = memo(function TooltipProvider({ children, delayDuration = 0 }: { children: React.ReactNode; delayDuration?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number>();

  const showEffect = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setShow(true), delayDuration);
  };

  const hideEffect = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setShow(false), delayDuration);
  };

  return (
    <div
      onMouseEnter={showEffect}
      onMouseLeave={hideEffect}
      onFocus={showEffect}
      onBlur={hideEffect}
    >
      {children}
    </div>
  );
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TooltipContent = memo(function TooltipContent({ side = 'top', align = 'center', hidden, children, ...props }: TooltipContentProps) {
  return (
    <div
      style={{
        // Positioning controlled by Tooltip
      }}
      {...props}
    >
      {children}
    </div>
  );
});