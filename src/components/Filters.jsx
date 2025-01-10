import { LegacyStack, Select, TextField,BlockStack,Box } from '@shopify/polaris';

function Filters({ 
  searchTerm, 
  onSearchChange, 
  contestType, 
  onTypeChange, 
  phase, 
  onPhaseChange,
  pageSize,        // Add these new props
  onPageSizeChange 
}) {
 
  return (
    <div style={{ padding: '1rem 0' }}>
      <BlockStack gap="4">
        <Box>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
              <TextField
                label="Search contests"
                value={searchTerm}
                onChange={onSearchChange}
                autoComplete="off"
                placeholder="Search by contest name..."
                clearButton
                onClearButtonClick={() => onSearchChange('')}
              />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
              <Select
                label="Contest type"
                options={[
                  { label: 'All Types', value: '' },
                  { label: 'Codeforces (CF)', value: 'CF' },
                  { label: 'ICPC', value: 'ICPC' },
                ]}
                value={contestType}
                onChange={onTypeChange}
              />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
              <Select
                label="Status"
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Upcoming', value: 'BEFORE' },
                  { label: 'In Progress', value: 'CODING' },
                  { label: 'Finished', value: 'FINISHED' },
                ]}
                value={phase}
                onChange={onPhaseChange}
              />
            </div>
            <div style={{ flex: '1 1 150px', minWidth: '120px' }}>
              <Select
                label="Items per page"
                options={[
                  { label: '10', value: '10' },
                  { label: '15', value: '15' },
                  { label: '20', value: '20' },
                  { label: '25', value: '25' },
                ]}
                value={pageSize.toString()}
                onChange={(value) => onPageSizeChange(parseInt(value))}
              />
            </div>
          </div>
        </Box>
      </BlockStack>
    </div>
  );
}

export default Filters;