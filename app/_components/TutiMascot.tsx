export function TutiMascot({ size = 36 }: { size?: number }) {
  const eyeSize = size * 0.15;
  const beakSize = size * 0.12;
  return (
    <div
      className="relative flex-shrink-0 rounded-full flex items-center justify-center gradient-teal-cyan"
      style={{ width: size, height: size }}
    >
      <div className="flex gap-[3px] -mt-[2px]">
        <div
          className="bg-white rounded-full"
          style={{ width: eyeSize, height: eyeSize }}
        />
        <div
          className="bg-white rounded-full"
          style={{ width: eyeSize, height: eyeSize }}
        />
      </div>
      <div
        className="absolute bg-accent-yellow rounded-full"
        style={{
          width: beakSize,
          height: beakSize * 0.6,
          bottom: size * 0.22,
          borderRadius: "50% 50% 50% 50% / 0% 0% 100% 100%",
        }}
      />
      <div
        className="absolute bg-accent-green rounded-full"
        style={{
          width: size * 0.1,
          height: size * 0.18,
          top: -size * 0.06,
          left: size * 0.38,
          transform: "rotate(-10deg)",
          borderRadius: "50% 50% 50% 50%",
        }}
      />
    </div>
  );
}
