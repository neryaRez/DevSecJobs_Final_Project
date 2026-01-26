export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-amber-100/70 bg-white shadow-sm hover:shadow-md hover:border-amber-200 transition ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-5 pt-5 border-t-4 border-amber-200/60 rounded-t-2xl ${className}`}>
      {children}
    </div>
  );
}


export function CardContent({ children, className = "" }) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}
