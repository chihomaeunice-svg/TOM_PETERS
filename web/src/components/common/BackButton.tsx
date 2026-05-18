import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Props {
  label?: string;
  to?: string;
}

export default function BackButton({ label = 'Back', to }: Props) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-tp-taupe hover:text-tp-gold transition-colors mb-8 group"
    >
      <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </button>
  );
}
