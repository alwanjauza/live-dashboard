"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  time: string;
  usage: number;
}

interface LiveChartProps {
  data: ChartDataPoint[];
}

export default function LiveChart({ data }: LiveChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='time' />
        <YAxis
          label={{ value: "Usage (%)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey='usage'
          stroke='#8884d8'
          activeDot={{ r: 8 }}
          name='CPU Usage'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
