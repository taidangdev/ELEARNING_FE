"use client";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function SafeImage({ src, alt, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      suppressHydrationWarning
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.src.includes("default-course.jpg")) {
          target.src = "/default-course.jpg";
        }
      }}
    />
  );
}