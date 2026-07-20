type ComparisonRow = {
  feature: string;
  left: string | boolean;
  right: string | boolean;
};

type ComparisonTableProps = {
  title: string;
  leftLabel: string;
  rightLabel: string;
  rows: ComparisonRow[];
};

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/15 text-success mx-auto">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-error/10 text-error mx-auto">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

/** جدول مقارنة عام — يُستخدم لمقارنة نوعين من الخدمات أو الخامات */
export default function ComparisonTable({ title, leftLabel, rightLabel, rows }: ComparisonTableProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">{title}</h3>
      <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
        <table className="w-full text-right border-collapse min-w-[520px]">
          <thead>
            <tr className="bg-coffee-espresso text-white">
              <th scope="col" className="p-4 font-semibold text-sm">المعيار</th>
              <th scope="col" className="p-4 font-semibold text-sm text-center">{leftLabel}</th>
              <th scope="col" className="p-4 font-semibold text-sm text-center">{rightLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.feature} className={idx % 2 === 0 ? 'bg-paper' : 'bg-muted/40'}>
                <th scope="row" className="p-4 text-sm font-medium text-foreground text-right">{row.feature}</th>
                <td className="p-4 text-center">
                  <Cell value={row.left} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={row.right} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
