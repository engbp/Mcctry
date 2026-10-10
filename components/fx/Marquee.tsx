const DEFAULT_ITEMS = [
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Azure",
  "Docker",
  "Git",
  "Figma",
  "Node.js",
  "Cybersecurity",
  "Machine Learning",
  "Power BI",
];

type MarqueeProps = {
  items?: string[];
  className?: string;
  speed?: number;
};

export function Marquee({ items = DEFAULT_ITEMS, className = "", speed = 40 }: MarqueeProps) {
  const duration = Math.max(20, Math.round((items.length * 160) / speed));
  const track = (
    <div className="marquee-group" aria-hidden="false">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="marquee-item">
          {item}
          <span className="marquee-sep" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee${className ? ` ${className}` : ""}`} aria-label={`Technologies: ${items.join(", ")}`}>
      <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
        {track}
        <div className="marquee-group" aria-hidden="true">
          {items.map((item, i) => (
            <span key={`dup-${item}-${i}`} className="marquee-item">
              {item}
              <span className="marquee-sep" aria-hidden="true">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
