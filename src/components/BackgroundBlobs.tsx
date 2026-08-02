export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-24 w-96 h-96 bg-green-300/20 dark:bg-green-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-24 w-96 h-96 bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-600/5 rounded-full blur-3xl" />
    </div>
  );
}
