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

  const paginatedContests = getPaginatedContests(filteredContests, page, pageSize);

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
    formatTimestamp(contest.startTimeSeconds),
  ]);

  return (
    <Page title="Codeforces Contest Dashboard">
    <div style={{ 
      display: 'flex', 
      gap: '20px',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
      width:"1600px"
    }}>
      {/* List section */}
      <div style={{ 
        flex: window.innerWidth <= 768 ? '1' : '3',
        minWidth: 0
      }}>
        <Card sectioned>
          <Filters 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            contestType={contestType}
            onTypeChange={handleTypeChange}
            phase={phase}
            onPhaseChange={handlePhaseChange}
          />


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
      </div>

      {/* Graph section */}
      <div style={{ 
        flex: window.innerWidth <= 768 ? '1' : '2',
        minWidth: 0
      }}>
        <Card sectioned title="Contest Duration Analysis">
          <ContestGraph contests={paginatedContests} />
        </Card>
      </div>
    </div>
  </Page>
  );
}

export default ContestList;