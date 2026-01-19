import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/wtfiction_logo.png"
        alt="WTFiction"
        width={160}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </div>
  );
}
