'use client';

import canvasSketch from 'canvas-sketch';
import Random from 'canvas-sketch-util/random';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeContext } from '../Layout/ThemeContext';
import styles from './index.module.css';

Random.setSeed(Random.getRandomSeed());

const settings = {
  pixelsPerInch: 300,
  suffix: Random.getSeed(),
  styleCanvas: false,
  scaleToView: true,
  dimensions: [4, 4],
  units: 'in',
  orientation: 'landscape',
};

function Generative() {
  const [loaded, setLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);
  const canvasRef = useRef(null);

  const baseSketch = useMemo(() => {
    const sliceCount = 20000;
    const slices = Array.from(new Array(sliceCount)).map((_, i, list) => {
      const t = i / Math.max(1, sliceCount - 1);

      const t2 = list.length <= 1 ? 0 : i / (list.length - 1);

      const noiseAngle = t2 * Math.PI * 2;
      const nx = Math.cos(noiseAngle);
      const ny = Math.sin(noiseAngle);

      const nf = 0.05 + Random.range(0, 0.5);
      const noise = Random.noise2D(nx * nf, ny * nf);
      const noise01 = noise * 0.75 + 0.5;

      // plot x/y coordinates along a circular path
      const r = 1.5;
      const angle = Math.PI * 2 * t;
      const x = 4 / 2 + Math.cos(angle) * r;
      const y = 4 / 2 + Math.sin(angle) * r;
      return {
        alpha: Math.abs(Random.range(0.5, 1) * (1 - noise01)),
        lineWidth: Random.range(0.005, 0.01) * 0.05,
        length: (Random.gaussian() * noise01) / 5,
        angle: Random.gaussian(0, 1),
        x,
        y,
      };
    });
    return slices;
  }, []);

  const sketch = useMemo(() => {
    const color =
      theme === 'dark' ? 'rgba(250, 250, 250, 0.9)' : 'rgba(0, 0, 0, 0.7)';
    const bg = theme === 'dark' ? '#1f2027' : '#e5e5e5';

    return ({ width, height }) => {
      return ({ context }) => {
        context.fillStyle = bg;
        context.fillRect(0, 0, width, height);

        context.beginPath();
        context.arc(2, 2, 1.5, 0, Math.PI * 2);
        context.fillStyle =
          theme === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0,0,0,0.05)';
        context.fill();

        for (const slice of baseSketch) {
          context.save();
          context.beginPath();
          context.translate(slice.x, slice.y);
          context.rotate(slice.angle);
          context.lineTo(slice.length / 2, 0);
          context.lineTo(-slice.length / 2, 0);
          context.lineWidth = slice.lineWidth;
          context.strokeStyle = color;
          context.globalAlpha = slice.alpha;
          context.stroke();
          context.restore();
        }
      };
    };
  }, [theme, baseSketch]);

  useEffect(() => {
    canvasSketch(
      sketch,
      {
        ...settings,
        canvas: canvasRef.current,
      },
      [canvasRef],
    ).then(() => {
      setLoaded(true);
    });
  }, [sketch]);

  return (
    <div
      className={
        loaded
          ? `${styles.canvasWrapper} ${styles.loaded}`
          : `${styles.canvasWrapper} ${styles.loading}`
      }
    >
      <canvas
        className='canvas'
        ref={canvasRef}
        style={{ maxWidth: '100%', height: '100%' }}
      />
    </div>
  );
}

export default Generative;
