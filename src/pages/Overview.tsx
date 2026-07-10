import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import {
  stats,
  cpuData,
  networkData,
  costTrendData,
  serviceCostData,
  websiteResponseData,
} from '../data/dashboardData';

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-indigo-500 via-blue-500 to-violet-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold">
          AI-Powered Cloud & Website Monitoring Dashboard
        </h1>
        <p className="text-white/80 mt-3 max-w-3xl">
          Monitor cloud infrastructure, website performance, costs, alerts, and AI optimization recommendations in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="CPU Usage Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Network Usage">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={networkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="networkIn"
                stackId="1"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="networkOut"
                stackId="2"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="AWS Cost Trend">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="ec2" fill="#6366f1" name="EC2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rds" fill="#8b5cf6" name="RDS" radius={[4, 4, 0, 0]} />
              <Bar dataKey="s3" fill="#a78bfa" name="S3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Service-Wise Cost">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceCostData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceCostData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Website Response Time">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={websiteResponseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
