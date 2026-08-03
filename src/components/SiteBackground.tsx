export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#070b09]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a140d] via-[#0f1b13] to-[#1c1108]" />

      <div className="hero-glow-1 absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-green-500/25 rounded-full blur-[100px]" />
      <div className="hero-glow-2 absolute -bottom-1/3 -right-1/4 w-[85%] h-[85%] bg-orange-500/20 rounded-full blur-[110px]" />
      <div className="hero-glow-3 absolute top-1/3 left-1/2 w-[60%] h-[60%] bg-emerald-400/15 rounded-full blur-[100px]" />

      <div className="hero-grain absolute inset-0 opacity-[0.06]" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}
