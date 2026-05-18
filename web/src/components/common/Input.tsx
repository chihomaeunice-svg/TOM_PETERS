import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  hint?: string;
}

export const Input: React.FC<Props> = ({
  label,
  error,
  leftIcon: Icon,
  hint,
  type = 'text',
  className = '',
  id,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && show ? 'text' : type;
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block label-caps text-tp-taupe mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center text-tp-taupe pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          type={effectiveType}
          {...rest}
          className={[
            'w-full bg-white border rounded-full px-4 py-3 text-sm text-tp-charcoal placeholder:text-tp-taupe/60',
            'focus:outline-none focus:ring-2 focus:ring-tp-gold/40 focus:border-tp-gold transition-all',
            Icon ? 'pl-10' : '',
            isPassword ? 'pr-11' : '',
            error ? 'border-tp-error' : 'border-tp-border',
            className,
          ].join(' ')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-tp-taupe hover:text-tp-charcoal"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-tp-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-tp-taupe">{hint}</p>
      ) : null}
    </div>
  );
};

export default Input;
