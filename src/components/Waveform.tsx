import { useEffect, useRef } from 'react';

interface WaveformProps {
  getTimeDomainData: () => Uint8Array;
  width?: number;
  height?: number;
  color?: string;
  isPlaying?: boolean;
}

export function Waveform({
  getTimeDomainData,
  width = 400,
  height = 100,
  color = '#10b981',
  isPlaying = false,
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dataArray = getTimeDomainData();
      const bufferLength = dataArray.length;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = isPlaying ? color : color + '60';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getTimeDomainData, width, height, color, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded bg-black/30"
    />
  );
}
