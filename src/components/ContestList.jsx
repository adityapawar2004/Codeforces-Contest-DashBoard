import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Page,
    Card,
    DataTable,
    Pagination,
    Select,
    TextField,

    LegacyStack,
  } from '@shopify/polaris';
import { fetchContests } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import ContestGraph from './ContestGraph';
import Filters from './Filters';
import { 
    filterContests, 
    getPaginatedContests, 
    formatTimestamp 
  } from '../utils/helpers';

function ContestList() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contestType, setContestType] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [favorites, setFavorites] = useState(new Set());
  
  const debouncedSearchTerm = useDebounce(searchTerm);
  const navigate = useNavigate();
  const [phase, setPhase] = useState('');
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (value) => {
    setContestType(value);
  };

  const handlePhaseChange = (value) => {
    setPhase(value);
  };
  // Update the filtering logic
  useEffect(() => {
    const filtered = filterContests(
      contests, 
      debouncedSearchTerm, 
      contestType, 
      phase
    );
    setFilteredContests(filtered);
    setPage(1);
  }, [debouncedSearchTerm, contestType, phase, contests]);
  useEffect(() => {
    const loadContests = async () => {
      const data = await fetchContests();
      setContests(data);
      setFilteredContests(data);
    };
    loadContests();
  }, []);

  useEffect(() => {
    let filtered = contests;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(contest => 
        contest.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (contestType) {
      filtered = filtered.filter(contest => contest.type === contestType);
    }

    setFilteredContests(filtered);
    setPage(1);
  }, [debouncedSearchTerm, contestType, contests]);

  const paginatedContests = filteredContests.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const rows = paginatedContests.map(contest => [
    contest.id,
    <span 
      key={contest.id}
      onClick={() => navigate(`/contest/${contest.id}`)}
      style={{ cursor: 'pointer', color: '#2c6ecb' }}
    >
      {contest.name}
    </span>,
    contest.type,
    contest.phase,
    new Date(contest.startTimeSeconds * 1000).toLocaleString(),
  ]);

  return (
    <Page title="Codeforces Contest Dashboard">
      <Card sectioned>
      <Filters 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          contestType={contestType}
          onTypeChange={handleTypeChange}
          phase={phase}
          onPhaseChange={handlePhaseChange}
        />
      <LegacyStack vertical spacing="tight">
          <LegacyStack distribution="fillEvenly">
            <TextField
              label="Search contests"
              value={searchTerm}
              onChange={setSearchTerm}
              autoComplete="off"
              placeholder="Search by contest name..."
            />
            <Select
              label="Contest type"
              options={[
                { label: 'All', value: '' },
                { label: 'CF', value: 'CF' },
                { label: 'ICPC', value: 'ICPC' },
              ]}
              value={contestType}
              onChange={setContestType}
            />
          </LegacyStack>
        </LegacyStack>
        <div style={{ marginBottom: '1rem' }}>
          <Filters>
            <TextField
              label="Search contests"
              value={searchTerm}
              onChange={setSearchTerm}
              autoComplete="off"
            />
            <Select
              label="Contest type"
              options={[
                { label: 'All', value: '' },
                { label: 'CF', value: 'CF' },
                { label: 'ICPC', value: 'ICPC' },
              ]}
              value={contestType}
              onChange={setContestType}
            />
          </Filters>
        </div>

        <DataTable
          columnContentTypes={['numeric', 'text', 'text', 'text', 'text']}
          headings={['ID', 'Name', 'Type', 'Phase', 'Start Time']}
          rows={rows}
        />

        <div style={{ marginTop: '1rem' }}>
          <Pagination
            hasPrevious={page > 1}
            onPrevious={() => setPage(p => p - 1)}
            hasNext={page * pageSize < filteredContests.length}
            onNext={() => setPage(p => p + 1)}
          />
        </div>
      </Card>

      <Card sectioned title="Contest Duration Analysis">
        <ContestGraph contests={filteredContests} />
      </Card>
    </Page>
  );
}

export default ContestList;