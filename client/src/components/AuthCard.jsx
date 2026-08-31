export default function AuthCard({ title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-card"><div className="brand">PRODESK <span>IT</span></div><h1>{title}</h1><p>{subtitle}</p>{children}</section></main>;
}
