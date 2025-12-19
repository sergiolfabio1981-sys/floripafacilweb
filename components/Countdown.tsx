import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-2 text-xs font-bold text-white uppercase tracking-widest mt-2">
      <div className="bg-red-600 rounded p-1 w-8 text-center">
        <span>{pad(timeLeft.days)}</span>
        <div className="text-[0.5rem] font-normal">D</div>
      </div>
      <div className="bg-red-600 rounded p-1 w-8 text-center">
        <span>{pad(timeLeft.hours)}</span>
        <div className="text-[0.5rem] font-normal">H</div>
      </div>
      <div className="bg-red-600 rounded p-1 w-8 text-center">
        <span>{pad(timeLeft.minutes)}</span>
        <div className="text-[0.5rem] font-normal">M</div>
      </div>
      <div className="bg-red-600 rounded p-1 w-8 text-center">
        <span>{pad(timeLeft.seconds)}</span>
        <div className="text-[0.5rem] font-normal">S</div>
      </div>
    </div>
  );
};

export default Countdown;
