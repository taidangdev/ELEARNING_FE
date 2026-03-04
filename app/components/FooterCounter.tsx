"use client";

import { useEffect, useState } from "react";

/* ===== COUNTER SMOOTH ===== */
type CounterProps = {
  end: number;
  duration?: number;
};

function Counter({ end, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // tổng số lần nhảy số
    const totalSeconds = Math.floor(duration / 10);

    // mỗi lần tăng bao nhiêu
    const step = Math.ceil(end / totalSeconds);

    let current = 0;

    const timer = setInterval(() => {
      current += step;

      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 1000); // ✅ đúng 1 giây

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

/* ===== FOOTER ===== */

export default function FooterCounter() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[500px] h-[500px] bg-sky-500/20 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full bottom-0 right-0" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">

        {/* ===== TITLE ===== */}
        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Hơn <span className="text-sky-400">5.000+ học viên</span> đã thay đổi
          tương lai cùng EduCenter
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-14 text-lg">
          Học thật • Kỹ năng thật • Cơ hội nghề nghiệp thật.  
          Chúng tôi giúp bạn làm chủ công nghệ và phát triển sự nghiệp bền vững.
        </p>

        {/* ===== COUNTERS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          <Stat end={5240} label="Học viên đăng ký" suffix="+" />
          <Stat end={120} label="Khóa học" suffix="+" />
          <Stat end={49} label="Đánh giá trung bình" suffix="/5" />
          <Stat end={20} label="Quốc gia" suffix="+" />

        </div>
      </div>
    </section>
  );
}

/* ===== CARD ITEM ===== */

/* ===== CARD ITEM ===== */

type StatProps = {
  end: number;
  label: string;
  suffix?: string;
};

function Stat({ end, label, suffix }: StatProps) {
  return (
    <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-sky-400/50 transition-all duration-300 hover:scale-105">

      <p className="text-4xl md:text-5xl font-bold text-sky-400 mb-3">
        <Counter end={end} />
        {suffix}
      </p>

      <p className="text-gray-300 group-hover:text-white transition">
        {label}
      </p>

    </div>
  );
}