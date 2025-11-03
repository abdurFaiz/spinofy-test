import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  onTimeUp,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = initialMinutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / (initialMinutes * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBackgroundColor = () => {
    const percentage = (timeLeft / (initialMinutes * 60)) * 100;
    if (percentage > 50) return 'bg-green-100';
    if (percentage > 20) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getBorderColor = () => {
    const percentage = (timeLeft / (initialMinutes * 60)) * 100;
    if (percentage > 50) return 'border-green-200';
    if (percentage > 20) return 'border-yellow-200';
    return 'border-red-200';
  };

  if (timeLeft <= 0) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-2xl ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <Clock className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-red-600">Waktu Pembayaran Habis</p>
            <p className="text-xs text-red-500 mt-1">Silakan buat pesanan baru</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${getBackgroundColor()} border ${getBorderColor()} rounded-2xl ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${getProgressPercentage()}, 100`}
                className={getTimerColor()}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className={`w-6 h-6 ${getTimerColor()}`} />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Sisa Waktu Pembayaran
          </p>
          <p className={`text-2xl font-bold ${getTimerColor()} mb-2`}>
            {formatTime(timeLeft)}
          </p>
          <p className="text-xs text-gray-600">
            Selesaikan pembayaran sebelum waktu habis
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft / (initialMinutes * 60) > 0.5
                ? 'bg-green-500'
                : timeLeft / (initialMinutes * 60) > 0.2
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{
              width: `${((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
