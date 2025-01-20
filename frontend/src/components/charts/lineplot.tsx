'use client';
import * as d3 from "d3";
import { useRef, useEffect } from "react";

interface LinePlotProps {
  data: { year: number; citations: number }[]; // Array of year-citations data
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

export const LinePlot = ({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
}: LinePlotProps) => {
  const gx = useRef<SVGGElement | null>(null);
  const gy = useRef<SVGGElement | null>(null);

  // Extract years and citation values
  const years = data.map((d) => d.year);
  const citations = data.map((d) => d.citations);

  // Define scales
  const x = d3
    .scaleBand()
    .domain(years) // Use years for x-axis domain
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(citations)!]) // Set domain from 0 to max citations
    .range([height - marginBottom, marginTop])
    .nice(); // Round domain to "nice" values like 5, 10, etc.

  // Define line generator
  const line = d3
    .line<{ year: number; citations: number }>()
    .x((d) => x(d.year)! + x.bandwidth() / 2) // Center line points in x-band
    .y((d) => y(d.citations));

  // Set up x-axis
  useEffect(() => {
    if (gx.current) {
      d3.select(gx.current).call(d3.axisBottom(x).tickFormat((d) => `${d}`));
    }
  }, [gx, x]);

  // Set up y-axis
  useEffect(() => {
    if (gy.current) {
      d3.select(gy.current).call(
        d3.axisLeft(y).tickValues(
          d3.range(0, d3.max(citations)! + 5, 5) // Set y-axis ticks to increments of 5
        )
      );
    }
  }, [gy, y, citations]);

  return (
    <svg width={width} height={height}>
      {/* X-axis */}
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      {/* Y-axis */}
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      {/* Line path */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={line(data) || ""}
      />
      {/* Points */}
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle
            key={i}
            cx={x(d.year)! + x.bandwidth() / 2}
            cy={y(d.citations)}
            r="2.5"
          />
        ))}
      </g>
    </svg>
  );
};

