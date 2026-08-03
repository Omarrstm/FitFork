export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="bg-line-a absolute top-1/4 left-1/2 w-[160%] h-24 bg-gradient-to-r from-transparent via-green-400/25 dark:via-green-500/15 to-transparent blur-2xl" />
      <div className="bg-line-b absolute top-2/3 left-1/2 w-[160%] h-28 bg-gradient-to-r from-transparent via-orange-400/25 dark:via-orange-500/15 to-transparent blur-2xl" />
      <div className="bg-line-c absolute top-1/2 left-1/2 w-[140%] h-16 bg-gradient-to-r from-transparent via-emerald-400/20 dark:via-emerald-500/10 to-transparent blur-2xl" />
    </div>
  );
}
