export default function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-white/8 py-8">
      <div className="mx-auto max-w-6xl px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-mist-500 font-mono">
        <span>{text}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
