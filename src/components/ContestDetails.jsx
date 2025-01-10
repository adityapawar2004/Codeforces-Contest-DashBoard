import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Layout,
  TextContainer,
  Text,
  Badge,
  Spinner,
  BlockStack,
  InlineGrid
} from '@shopify/polaris';
// ... rest of the file remains the same, but replace Stack with BlockStack
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
    return (
      <div style={{display:"flex",width:"100vw"}}>
      <Page>
        <Card sectioned>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner size="large" />
            <p>Loading contest details...</p>
          </div>
        </Card>
      </Page>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (phase) => {
    const statusMap = {
      BEFORE: { color: 'warning', label: 'Upcoming' },
      CODING: { color: 'success', label: 'In Progress' },
      FINISHED: { color: 'info', label: 'Completed' },
    };
    const status = statusMap[phase] || { color: 'default', label: phase };
    return <Badge status={status.color}>{status.label}</Badge>;
  };

  return (
    <div style={{display:"flex",width:"100vw"}}>
    <Page
      title={contest.name}
      titleMetadata={getStatusBadge(contest.phase)}
      breadcrumbs={[{ content: 'Contests', onAction: () => navigate('/') }]}
     
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="4" align="center">
            <Layout>
              <Layout.Section oneThird></Layout.Section>
              <Layout.Section oneThird>
                <Card sectioned title="Contest Information">
                  <BlockStack gap="4">
                    <TextContainer>
                      <InlineGrid columns="2">
                        <Text variant="bodyMd">Contest ID</Text>
                        <Text variant="bodyMd" fontWeight="bold">{contest.id}</Text>
                      </InlineGrid>
                      <InlineGrid columns="2">
                        <Text variant="bodyMd">Type</Text>
                        <Text variant="bodyMd" fontWeight="bold">{contest.type}</Text>
                      </InlineGrid>
                      <InlineGrid columns="2">
                        <Text variant="bodyMd">Duration</Text>
                        <Text variant="bodyMd" fontWeight="bold">
                          {formatDuration(contest.durationSeconds)}
                        </Text>
                      </InlineGrid>
                    </TextContainer>
                  </BlockStack>
                </Card>

                <div style={{ marginTop: '1rem' }}>
                  <Card sectioned title="Schedule">
                    <BlockStack gap="4">
                      <TextContainer>
                        <InlineGrid columns="2">
                          <Text variant="bodyMd">Start Time</Text>
                          <Text variant="bodyMd" fontWeight="bold">
                            {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                          </Text>
                        </InlineGrid>
                        <InlineGrid columns="2">
                          <Text variant="bodyMd">End Time</Text>
                          <Text variant="bodyMd" fontWeight="bold">
                            {new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toLocaleString()}
                          </Text>
                        </InlineGrid>
                      </TextContainer>
                    </BlockStack>
                  </Card>
                </div>
              </Layout.Section>
              <Layout.Section oneThird></Layout.Section>
            </Layout>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
    </div>
  );
}

export default ContestDetails;