import { useEffect, useMemo, useRef, useState } from "react";

const ringValues = [25, 50, 75, 100];

const polarPoint = (angle, radius) => ({
  x: Math.cos(angle - Math.PI / 2) * radius,
  y: Math.sin(angle - Math.PI / 2) * radius,
});

const buildClosedPath = (points) =>
  `${points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ")} Z`;

export function DimensionChart({ dimensions }) {
  const [activeDimension, setActiveDimension] = useState(dimensions[0]);
  const chartRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const duration = 1200;
    let frameId = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimProgress(eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isInView]);

  const chartData = useMemo(() => {
    const scale = (value) => 56 + (value / 100) * 98;
    const step = (Math.PI * 2) / dimensions.length;
    const points = dimensions.map((dimension, index) => ({
      ...dimension,
      angle: index * step,
      radius: scale(dimension.sampleScore),
      outerRadius: scale(100),
    }));

    return {
      axisPoints: points.map((point) => ({
        ...point,
        endpoint: polarPoint(point.angle, point.outerRadius),
      })),
      rawPoints: points.map((point) => ({
        angle: point.angle,
        targetRadius: point.radius,
      })),
      ringPaths: ringValues.map(
        (ring) => buildClosedPath(points.map((point) => polarPoint(point.angle, scale(ring)))),
      ),
    };
  }, [dimensions]);

  const animatedPolygonPath = useMemo(() => {
    const points = chartData.rawPoints.map((point) => polarPoint(point.angle, point.targetRadius * animProgress));
    return buildClosedPath(points);
  }, [chartData.rawPoints, animProgress]);

  const animatedDataPoints = useMemo(
    () =>
      chartData.rawPoints.map((point) => polarPoint(point.angle, point.targetRadius * animProgress)),
    [chartData.rawPoints, animProgress],
  );

  const ringOpacity = Math.min(animProgress / 0.45, 1) * 0.16;
  const axisOpacity = Math.min(animProgress / 0.65, 1);
  const pointOpacity = Math.max(0, (animProgress - 0.6) / 0.4);

  return (
    <div ref={chartRef} className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
      <div className="mx-auto w-full max-w-[30rem] border border-sapi-bronze bg-sapi-navy p-3 sm:max-w-[33rem]">
        <div className="aspect-square bg-black">
          <svg
            aria-labelledby="dimension-chart-title"
            className="h-full w-full"
            role="img"
            viewBox="0 0 420 420"
          >
            <title id="dimension-chart-title">Five dimensions of the Sovereign AI Power Index</title>
            <g transform="translate(210 210)">
              {chartData.ringPaths.map((path, index) => (
                <path
                  key={`${ringValues[index]}-ring`}
                  d={path}
                  fill="none"
                  stroke="white"
                  strokeOpacity={ringOpacity}
                  strokeWidth="1"
                />
              ))}
              {chartData.axisPoints.map((point) => (
                <line
                  key={`${point.key}-axis`}
                  stroke={point.key === activeDimension.key ? "#C9963A" : "white"}
                  strokeOpacity={(point.key === activeDimension.key ? 1 : 0.18) * axisOpacity}
                  strokeWidth={point.key === activeDimension.key ? 1.3 : 1}
                  x1="0"
                  x2={point.endpoint.x}
                  y1="0"
                  y2={point.endpoint.y}
                />
              ))}
              <path d={animatedPolygonPath} fill="none" stroke="white" strokeOpacity={0.72} strokeWidth="1.2" />
              {chartData.axisPoints.map((point, index) => (
                <circle
                  key={`${point.key}-point`}
                  cx={animatedDataPoints[index]?.x ?? 0}
                  cy={animatedDataPoints[index]?.y ?? 0}
                  fill="white"
                  opacity={pointOpacity}
                  r={point.key === activeDimension.key ? 4 : 3}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="order-2 grid gap-3 lg:order-1 lg:gap-4">
          {dimensions.map((dimension) => {
            const isActive = activeDimension.key === dimension.key;

            return (
              <button
                key={dimension.key}
                aria-label={`Select dimension: ${dimension.label}`}
                aria-pressed={isActive}
                className={`group min-h-11 border-b border-sapi-bronze px-4 py-5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? "border-white bg-sapi-navy text-sapi-parchment"
                    : "text-sapi-muted hover:bg-sapi-navy hover:text-sapi-parchment"
                }`}
                onClick={() => setActiveDimension(dimension)}
                onFocus={() => setActiveDimension(dimension)}
                onMouseEnter={() => setActiveDimension(dimension)}
                type="button"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`font-sans text-[13px] tracking-[0.22em] uppercase ${dimension.proprietary ? "text-sapi-gold" : ""}`}>
                    {dimension.label}
                  </span>
                  {dimension.proprietary ? (
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-sapi-gold">
                      Proprietary
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 font-sans max-w-xl text-base leading-7 text-sapi-muted group-hover:text-sapi-muted">
                  {dimension.shortDescription}
                </p>
              </button>
            );
          })}
        </div>

        <div className="order-1 border-l border-sapi-gold pl-6 lg:order-2">
          <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Active Dimension</p>
          <h3 className={`font-serif mt-4 text-3xl sm:text-4xl ${activeDimension.proprietary ? "text-sapi-gold" : "text-sapi-parchment"}`}>
            {activeDimension.label}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-8 text-sapi-muted">
            {activeDimension.description}
          </p>
          <p className="font-sans mt-6 text-sm uppercase tracking-[0.22em] text-sapi-muted">
            Sample score: {activeDimension.sampleScore}
          </p>
        </div>
      </div>
    </div>
  );
}
