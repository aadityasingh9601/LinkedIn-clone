import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ data }) {
  const maxValue = Math.max(...data?.map((d) => d.count));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          interval={data.length > 7 ? Math.floor(data.length / 7) : 0}
        />
        <YAxis
          domain={[0, Math.ceil(maxValue + maxValue * 0.25)]}
          allowDecimals={false}
          tickCount={6} //How many ticks do you want on the Y-axis.
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
