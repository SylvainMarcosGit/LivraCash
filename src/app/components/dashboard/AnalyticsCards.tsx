import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Activity, Percent } from "lucide-react";
import { dashboardService, AnalyticsData } from "@/app/services/dashboardService";

export default function AnalyticsCards() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await dashboardService.getAnalytics();
        setData(analytics);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="size-4 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Revenu Total",
      value: data ? `${new Intl.NumberFormat("fr-FR").format(data.total_revenue)} XOF` : "-",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Commissions Totales",
      value: data ? `${new Intl.NumberFormat("fr-FR").format(data.total_commissions)} XOF` : "-",
      change: "+8.2%",
      trend: "up",
      icon: Percent,
    },
    {
      title: "Transactions Totales",
      value: data ? data.total_transactions.toString() : "-",
      change: "+23.1%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Taux de Succès",
      value: data ? `${data.success_rate}%` : "-",
      change: "+2.4%",
      trend: "up",
      icon: Activity,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="size-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <TrendIcon
                  className={`size-4 mr-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                />
                <span
                  className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-gray-600 ml-1">par rapport au mois dernier</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
