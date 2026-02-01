interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorClasses = {
  blue: "bg-blue-50 border-blue-200",
  green: "bg-green-50 border-green-200",
  yellow: "bg-yellow-50 border-yellow-200",
  red: "bg-red-50 border-red-200",
  purple: "bg-purple-50 border-purple-200",
};

const iconBgClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
};

export function DashboardCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon = "📊",
  color = "blue",
}: DashboardCardProps) {
  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${iconBgClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
