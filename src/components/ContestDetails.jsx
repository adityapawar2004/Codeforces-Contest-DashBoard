import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page, Card, Button } from '@shopify/polaris';
import { fetchContests } from '../services/api';

function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const loadContest = async () => {
      const contests = await fetchContests();
      const found = contests.find(c => c.id === parseInt(id));
      setContest(found);
    };
    loadContest();
  }, [id]);

  if (!contest) {
    return <Page title="Loading..." />;
  }

  return (
    <Page
      title={contest.name}
      breadcrumbs={[{ content: 'Contests', onAction: () => navigate('/') }]}
    >
      <Card sectioned>
        <p><strong>ID:</strong> {contest.id}</p>
        <p><strong>Type:</strong> {contest.type}</p>
        <p><strong>Phase:</strong> {contest.phase}</p>
        <p><strong>Start Time:</strong> {new Date(contest.startTimeSeconds * 1000).toLocaleString()}</p>
        <p><strong>Duration:</strong> {contest.durationSeconds / 3600} hours</p>
      </Card>
    </Page>
  );
}

export default ContestDetails;