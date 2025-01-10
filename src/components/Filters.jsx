import { LegacyStack, Select, TextField } from '@shopify/polaris';

function Filters({ 
  searchTerm, 
  onSearchChange, 
  contestType, 
  onTypeChange, 
  phase, 
  onPhaseChange 
}) {
  const handleSearchChange = (value) => {
    onSearchChange(value);
  };

  const handleTypeChange = (value) => {
    onTypeChange(value);
  };

  const handlePhaseChange = (value) => {
    onPhaseChange(value);
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <LegacyStack vertical spacing="tight">
        <LegacyStack alignment="center" spacing="loose">
          <div style={{ flex: 2 }}>
            <TextField
              label="Search contests"
              value={searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
              placeholder="Search by contest name..."
              clearButton
              onClearButtonClick={() => handleSearchChange('')}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select
              label="Contest type"
              options={[
                { label: 'All Types', value: '' },
                { label: 'Codeforces (CF)', value: 'CF' },
                { label: 'ICPC', value: 'ICPC' },
              ]}
              value={contestType}
              onChange={handleTypeChange}
              selected={contestType}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select
              label="Status"
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Upcoming', value: 'BEFORE' },
                { label: 'In Progress', value: 'CODING' },
                { label: 'Finished', value: 'FINISHED' },
              ]}
              value={phase}
              onChange={handlePhaseChange}
              selected={phase}
            />
          </div>
        </LegacyStack>
      </LegacyStack>
    </div>
  );
}

export default Filters;