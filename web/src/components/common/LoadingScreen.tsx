export const LoadingScreen: React.FC<{ label?: string }> = ({ label }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-tp-cream">
    <h1 className="text-3xl md:text-4xl font-display tracking-[0.5em] text-tp-charcoal animate-pulse-soft">
      TOMPETERS
    </h1>
    {label && (
      <p className="mt-4 label-caps text-tp-taupe">{label}</p>
    )}
  </div>
);

export default LoadingScreen;
