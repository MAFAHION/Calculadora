import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col items-center gap-0", className)}>
    <div className="flex items-baseline gap-1">
      <span className="font-serif text-4xl italic font-bold text-white">MA</span>
      <span className="font-sans text-xs tracking-[0.3em] font-light text-cyber-cyan uppercase">Fashion LLC</span>
    </div>
  </div>
);

export const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("glass-card p-6", className)} {...props}>
    {children}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props} />
));

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) => (
  <button className={cn(variant === 'primary' ? 'primary' : 'secondary', className)} {...props}>
    {children}
  </button>
);
