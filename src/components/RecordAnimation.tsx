import React from "react";
// import WaveSurfer from "wavesurfer.js";

export const RecordAnimation: React.FC<{ title: string | null }> = ({
  title,
}) => {
  const waveRef = React.useRef<HTMLDivElement>(null);

  // // use wavesurfer to draw the wave
  // React.useEffect(() => {
  //   if (!waveRef.current) return;

  //   const wavesurfer = WaveSurfer.create({
  //     container: waveRef.current,
  //     waveColor: "violet",
  //     progressColor: "purple",
  //     cursorColor: "transparent",
  //     barWidth: 2,
  //     barRadius: 3,
  //     barGap: undefined,
  //     responsive: true,
  //     height: 128,
  //   });

  //   wavesurfer.load("/audio/record.mp3");

  //   return () => {
  //     wavesurfer.destroy();
  //   };
  // }, []);

  return (
    <div className="pointer-events-none fixed top-0 left-0 flex h-full w-full flex-col items-center bg-red-200">
      <h4 className="mt-40">{title}</h4>
      <div ref={waveRef}></div>
    </div>
  );
};
