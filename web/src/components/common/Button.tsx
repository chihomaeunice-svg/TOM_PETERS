import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'gold' | 'ghost' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-tp-charcoal text-tp-cream hover:bg-black',
  gold: 'bg-gradient-to-r from-tp-gold to-tp-gold-dark text-white hover:shadow-luxe',
  ghost: 'bg-transparent text-tp-charcoal border border-tp-charcoal hover:bg-tp-charcoal hover:text-tp-cream',
  secondary: 'bg-tp-silk text-tp-charcoal hover:bg-tp-beige border border-tp-border',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
};

export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  className = '',
  disabled,
  children,
  ...rest
}) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={[
      'inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ')}
  >
    {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
    <span>{children}</span>
    {!loading && rightIcon}
  </button>
);

export default Button;
