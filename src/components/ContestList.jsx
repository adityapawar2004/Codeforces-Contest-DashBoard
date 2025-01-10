import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Page, 
  Card, 
  DataTable, 
  Pagination, 
  Button,
  Icon,
  EmptyState  // Added for empty state
} from '@shopify/polaris';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';


import { 
  filterContests, 
  getPaginatedContests, 
  formatTimestamp,
  getFavorites,
  toggleFavorite 
} from '../utils/helpers';
import { fetchContests } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import ContestGraph from './ContestGraph';
import Filters from './Filters';


function ContestList() {
  const [contests, setContests] = useState([]);
  const [favorites, setFavorites] = useState(getFavorites());
  const [showFavorites, setShowFavorites] = useState(false);
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
      phase,
      showFavorites
    );
    setFilteredContests(filtered);
    setPage(1);
  }, [debouncedSearchTerm, contestType, phase, contests,showFavorites]);
  const handleFavoriteToggle = (contestId) => {
    const updatedFavorites = toggleFavorite(contestId);
    setFavorites(updatedFavorites);
  };

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
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Button
        icon={
          favorites.includes(contest.id) ? (
            <AiFillStar size={20} color="yellow" />
          ) : (
            <AiOutlineStar size={20} color="yellow" />
          )
        }
        onClick={(e) => {
          e.stopPropagation();
          handleFavoriteToggle(contest.id);
        }}
        plain
      />
      <span 
        onClick={() => navigate(`/contest/${contest.id}`)}
        style={{ cursor: 'pointer', color: '#2c6ecb' }}
      >
        {contest.name}
      </span>
    </div>,
    contest.type,
    contest.phase,
    formatTimestamp(contest.startTimeSeconds),
  ]

);
  return (
    <Page title="Codeforces Contest Dashboard">
     <div style={{ 
      display: 'flex', 
      gap: '20px',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
     width:"1800px"
      
    }}>
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
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              showFavorites={showFavorites}
              onFavoritesChange={() => setShowFavorites(!showFavorites)}
            />

            {showFavorites && filteredContests.length === 0 ? (
              <EmptyState
                heading="No favorite contests yet"
                image=""
              >
                <p>Click the star icon next to a contest to add it to your favorites.</p>
              </EmptyState>
            ) : (
              <div style={{ 
                maxHeight: pageSize > 10 ? '600px' : 'none',
                overflowY: pageSize > 10 ? 'auto' : 'visible',
                overflowX: 'auto'
              }}>
                <DataTable
                  columnContentTypes={['numeric', 'text', 'text', 'text', 'text']}
                  headings={['ID', 'Name', 'Type', 'Phase', 'Start Time']}
                  rows={rows}
                />
              </div>
            )}

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