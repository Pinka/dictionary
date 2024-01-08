import React, { useState, useEffect, useRef } from "react";

const RecordAnimation: React.FC<{
  title: string;
}> = ({ title }) => {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const animationFrameId = useRef(0);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArr = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let t = 0;
    const tick = () => {
      if (analyser.current && dataArr.current) {
        // Only update the audio data every 6 frames
        if (t === 6) {
          t = 0;
          analyser.current.getByteTimeDomainData(dataArr.current);
          setAudioData(new Uint8Array(dataArr.current));
        }
        t = t + 1;
        animationFrameId.current = requestAnimationFrame(tick);
      }
    };

    const getAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      dataArr.current = new Uint8Array(analyser.current.frequencyBinCount);
      source.connect(analyser.current);
      tick();
    };

    getAudio().catch((error) => console.error("Error getting audio:", error));

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      if (audioContext.current) {
        audioContext.current
          .close()
          .catch((error) =>
            console.error("Error closing audio context:", error)
          )
          .finally(() => {
            audioContext.current = null;
            analyser.current = null;
            dataArr.current = null;
          });
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set the canvas dimensions to match its display size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Clear the canvas before each drawing
    context.clearRect(0, 0, width, height);

    // Set the stroke style and line width
    context.strokeStyle = "black";
    context.lineWidth = 1;

    // smooth out the waveform
    context.lineJoin = "round";
    context.lineCap = "round";

    context.beginPath();
    audioData.forEach((item, index) => {
      const x = width * (index / audioData.length);
      const y = (item / 255.0) * height;
      index === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
    });

    context.stroke();
  }, [audioData]); // Dependency on audioData ensures this runs every time audioData updates

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-10 h-full w-full flex-col items-center bg-red-200">
      <canvas
        className="absolute top-0 left-0 h-screen w-screen bg-transparent"
        ref={canvasRef}
      />
      <h4 className="mt-20 w-full text-center text-xl">{title}</h4>
    </div>
  );
};

export default RecordAnimation;
