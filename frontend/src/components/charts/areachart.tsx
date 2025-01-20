'use client';
import * as d3 from "d3";
import { useRef, useEffect } from "react";

interface AreaChartProps {
  data: { year: string; category: string; value: number }[]; // Data structure
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

export const AreaChart = ({
  data,
  width = 900,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 50,
}: AreaChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Group data by category
    const categories = Array.from(new Set(data.map((d) => d.category)));
    const years = Array.from(new Set(data.map((d) => d.year)));

    const colorScale = d3
      .scaleOrdinal()
      .domain(categories)
      .range(["#69b3a2", "#404080", "#e41a1c", "#377eb8"]); // Custom colors for lines

    // Scales
    const x = d3
      .scalePoint()
      .domain(years)
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!]) // Max value for y-axis
      .nice()
      .range([height - marginBottom, marginTop]);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .attr("font-size", 12);

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("font-size", 12);

    // Line generator
    const line = d3
      .line<{ year: string; value: number }>()
      .x((d) => x(d.year)!)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Area generator
    const area = d3
      .area<{ year: string; value: number }>()
      .x((d) => x(d.year)!)
      .y0(y(0))
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Create groups for each category
    const groupedData = categories.map((category) => ({
      category,
      values: data
        .filter((d) => d.category === category)
        .map(({ year, value }) => ({ year, value })),
    }));

    groupedData.forEach(({ category, values }) => {
      // Draw area
      svg
        .append("path")
        .datum(values)
        .attr("fill", colorScale(category) as string)
        .attr("opacity", 0.3)
        .attr("d", area);

      // Draw line
      svg
        .append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", colorScale(category) as string)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add points
      svg
        .selectAll(`.dot-${category}`)
        .data(values)
        .join("circle")
        .attr("cx", (d) => x(d.year)!)
        .attr("cy", (d) => y(d.value))
        .attr("r", 4)
        .attr("fill", colorScale(category) as string);
    });

// Add legend
// Add legend
const legend = svg
  .append("g")
  .attr(
    "transform",
    `translate(${marginLeft}, ${height - marginBottom + 40})` // Position below the graph
  );

categories.forEach((category, i) => {
  const legendGroup = legend
    .append("g")
    .attr("transform", `translate(${i * 120}, 0)`); // Adjust spacing between legend items

  legendGroup
    .append("circle")
    .attr("r", 5)
    .attr("fill", colorScale(category) as string);

  legendGroup
    .append("text")
    .attr("x", 10)
    .text(category)
    .attr("font-size", 12)
    .attr("alignment-baseline", "middle");
});


  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

