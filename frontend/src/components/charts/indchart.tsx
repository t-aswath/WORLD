'use client';

import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface PublicationGraphProps {
  data: { year: number; SCI: number; SCOPUS: number; ESCI: number }[]; // Data structure
  width?: number;
  height?: number;
}

export const PublicationGraph = ({
  data,
  width = 800,
  height = 500,
}: PublicationGraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const indices = ["SCI", "SCOPUS", "ESCI"];
    const years = data.map((d) => d.year);

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(indices)
      .range([0, graphWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.SCI, d.SCOPUS, d.ESCI))!])
      .range([graphHeight, 0]);

    const colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(years);

    // Chart group
    const chartGroup = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X-axis
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0));

    // Y-axis
    chartGroup.append("g").call(d3.axisLeft(yScale));

    // Line generator with smooth curves
    const lineGenerator = d3
      .line<{ index: string; value: number }>()
      .x((d) => xScale(d.index)!)
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom); // Use Catmull-Rom spline for smoothness

    // Draw lines and points
    data.forEach((yearData) => {
      const lineData = indices.map((index) => ({
        index,
        value: yearData[index as keyof typeof yearData],
      }));

      // Draw smooth line
      chartGroup
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", colorScale(yearData.year) as string)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

      // Draw points on the line
      chartGroup
        .selectAll(`.point-${yearData.year}`)
        .data(lineData)
        .join("circle")
        .attr("class", `point-${yearData.year}`)
        .attr("cx", (d) => xScale(d.index)!)
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 4)
        .attr("fill", colorScale(yearData.year) as string);
    });

    // Legend
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - 10})`);

    const legendSpacing = 75;
    const legend = legendGroup
      .selectAll(".legend")
      .data(years)
      .join("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${i * legendSpacing}, 0)`);

    legend
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d) as string);

    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 4)
      .attr("font-size", 12)
      .text((d) => d);
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};
