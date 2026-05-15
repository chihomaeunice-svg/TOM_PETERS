import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  accent?: 'gold' | 'sage' | 'rose' | 'taupe';
}

const accentMap = {
  gold: 'bg-tp-gold/15 text-tp-gold-dark',
  sage: 'bg-tp-sage/20 text-tp-sage',
  rose: 'bg-tp-rose/20 text-tp-rose',
  taupe: 'bg-tp-taupe/15 text-tp-taupe',
};

export const StatCard: React.FC<Props> = ({ icon: Icon, label, value, trend, accent = 'gold' }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-lg ${accentMap[accent]}`}>
        <Icon size={20} />
      </div>
      {typeof trend === 'number' && (
        <div className={`inline-flex items-center gap-1 text-xs label-caps ${trend >= 0 ? 'text-tp-success' : 'text-tp-error'}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
    <p className="mt-4 text-2xl font-display text-tp-charcoal">{value}</p>
    <p className="mt-1 label-caps text-tp-taupe">{label}</p>
  </div>
);

export default StatCard;
