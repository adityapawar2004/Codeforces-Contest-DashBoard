import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function ContestGraph({ contests }) {
  const data = contests.map(contest => ({
    name: contest.name.length > 20 
      ? contest.name.substring(0, 20) + '...'
      : contest.name,
    duration: contest.durationSeconds / 3600,
  }));

  return (
    <div style={{ 
      width: '100%', 
      height: '400px',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Duration (hours)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip />
          <Bar 
            dataKey="duration" 
            fill="#2c6ecb"
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ContestGraph;