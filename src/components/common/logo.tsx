import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/gemini_generated.png"
      alt="Swachh Soochak Logo"
      width={32}
      height={32}
      className="h-8 w-8"
    />
  );
}
