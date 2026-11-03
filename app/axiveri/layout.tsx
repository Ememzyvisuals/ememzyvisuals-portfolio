// The Axiveri pages are the lab's own pages: they keep their orange and yellow look and the black buttons,
// not the indigo accent used across the rest of the portfolio.
export default function AxiveriLayout({ children }: { children: React.ReactNode }) {
  return <div className="tone-axiveri">{children}</div>;
}
