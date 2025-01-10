// Convert seconds to hours
export const secondsToHours = (seconds) => {
    return seconds / 3600;
  };
  
  // Format timestamp to local date string
  export const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  export const getFavorites = () => {
    return getFromLocalStorage('favoriteContests', []);
  };
  export const toggleFavorite = (contestId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.includes(contestId)
      ? favorites.filter(id => id !== contestId)
      : [...favorites, contestId];
    
    saveToLocalStorage('favoriteContests', updatedFavorites);
    return updatedFavorites;
  };
  
  // Filter contests based on search term, type, and phase
  export const filterContests = (contests, searchTerm, type, phase, showFavorites) => {
    const favorites = getFavorites();
    
    return contests.filter(contest => {
      const matchesSearch = searchTerm 
        ? contest.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesType = type 
        ? contest.type === type 
        : true;
      
      const matchesPhase = phase 
        ? contest.phase === phase 
        : true;
  
      const matchesFavorites = showFavorites 
        ? favorites.includes(contest.id)
        : true;
  
      return matchesSearch && matchesType && matchesPhase && matchesFavorites;
    });
  };
  
  // Sort contests by a given field
  export const sortContests = (contests, field, direction = 'asc') => {
    return [...contests].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  };
  
  // Get paginated contests
  export const getPaginatedContests = (contests, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return contests.slice(startIndex, endIndex);
  };
  
  // Local storage helpers
  export const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  export const getFromLocalStorage = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  };
  
  // Format contest duration for display
  export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let duration = '';
    if (hours > 0) {
      duration += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (duration) duration += ' ';
      duration += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return duration || '0 minutes';
  };