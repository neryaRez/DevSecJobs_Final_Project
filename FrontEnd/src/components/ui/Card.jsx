export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`px-5 pt-5 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}
