'use client';

import ScrollVelocity from './ScrollVelocity';

export default function About() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ScrollVelocity
        texts={['a child of music •', 'a child of music •']}
        velocity={50}
        className="text-gray-900 uppercase"
      />
    </div>
  );
}