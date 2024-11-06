'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Company {
  id: string;
  name: string;
  ethicsRating: number | null;
  priceRating: number | null;
  qualityServiceRating: number | null;
  products: {
    productId: string;
    status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'UNKNOWN';
    product: {
      name: string;
    } | null;
  }[];
}

const CompanyDataVisualization: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/trpc/company.getAll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: {}, // No input parameters for getAll
            type: 'query',
          }),
        });

        const json = await response.json();

        if (json.error) {
          throw new Error(json.error.message);
        }

        const data: Company[] = json.result.data;
        renderVisualization(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchData();
  }, []);

  const renderVisualization = (data: Company[]) => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 5])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', width - margin.left - margin.right)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .text('Rating');

    svg.append('g')
      .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal<string>()
      .domain(['ethicsRating', 'priceRating', 'qualityServiceRating'])
      .range(['#4CAF50', '#2196F3', '#FFC107']);

    const ratings = ['ethicsRating', 'priceRating', 'qualityServiceRating'] as const;

    ratings.forEach((rating, i) => {
      svg.selectAll(`.bar-${rating}`)
        .data(data)
        .enter()
        .append('rect')
        .attr('class', `bar-${rating}`)
        .attr('y', d => (y(d.name) as number) + (i * y.bandwidth() / ratings.length))
        .attr('height', y.bandwidth() / ratings.length)
        .attr('x', 0)
        .attr('width', d => x(d[rating] ?? 0))
        .attr('fill', color(rating));
    });

    // Legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(ratings)
      .enter().append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
      .attr('x', width - margin.right - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => color(d));

    legend.append('text')
      .attr('x', width - margin.right - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d.replace(/([A-Z])/g, ' $1').trim());
  };

  return <div ref={containerRef} className="h-[600px] w-full" />;
};

export default CompanyDataVisualization;
