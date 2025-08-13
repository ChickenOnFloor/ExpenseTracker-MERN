import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function SpendingChart({ data }) {
  return (
    <ChartContainer
      className="h-[300px] w-full"
      config={{
        value: { label: "Amount", color: "hsl(var(--chart-1))" },
      }}
    >
      <BarChart data={data}>
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="value" radius={6} fill="hsl(var(--chart-1))" />
      </BarChart>
    </ChartContainer>
  );
}
