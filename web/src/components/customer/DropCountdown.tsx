import { useEffect, useState } from 'react';

interface Props {
  target: Date;
  dark?: boolean;
}

const calc = (target: Date) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs, done: diff === 0 };
};

export const DropCountdown: React.FC<Props> = ({ target, dark }) => {
  const [t, setT] = useState(() => calc(target));

  useEffect(() => {
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return (
      <span className="inline-flex items-center gap-2 bg-tp-success/15 text-tp-success label-caps px-3 py-1.5 rounded-full">
        <span className="h-2 w-2 rounded-full bg-tp-success animate-pulse" />
        Live Now
      </span>
    );
  }

  const cell = (val: number, label: string) => (
    <div className={`flex flex-col items-center px-3 py-2 rounded-lg ${dark ? 'bg-white/10 text-tp-cream' : 'bg-tp-silk text-tp-charcoal'}`}>
      <span className="text-xl font-display tabular-nums">{val.toString().padStart(2, '0')}</span>
      <span className={`label-caps ${dark ? 'text-tp-cream/60' : 'text-tp-taupe'}`}>{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {cell(t.days, 'Days')}
      {cell(t.hours, 'Hrs')}
      {cell(t.mins, 'Min')}
      {cell(t.secs, 'Sec')}
    </div>
  );
};

export default DropCountdown;
