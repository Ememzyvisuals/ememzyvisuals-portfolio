import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page grid min-h-[70vh] place-items-center pt-24 text-center">
      <div>
        <p className="font-display text-[clamp(5rem,20vw,12rem)] font-extrabold leading-none">404</p>
        <p className="mt-4 text-lg text-fg/75">This page took the last bus and never came back.</p>
        <Link href="/" className="btn-solid mt-8">Back home</Link>
      </div>
    </div>
  );
}
