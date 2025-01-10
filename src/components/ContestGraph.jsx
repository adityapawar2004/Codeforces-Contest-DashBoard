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
    const data = contests
      .slice(0, 20) // Show only first 20 contests for better visibility
      .map(contest => ({
        name: contest.name.substring(0, 20) + '...',
        duration: contest.durationSeconds / 3600, // Convert to hours
      }));
  
    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" />
            <YAxis label={{ value: 'Duration (hours)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="duration" fill="#2c6ecb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export default ContestGraph;