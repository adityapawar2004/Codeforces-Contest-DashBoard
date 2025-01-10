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
      <div style={{ 
        width: '100%', 
        height: '400px',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart  data={data}
          margin={{
            top: 10,
            right: 30,
            left: 50,
            bottom: 150
          }}>
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