import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import ContestList from './components/ContestList';
import ContestDetails from './components/ContestDetails';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<ContestList />} />
          <Route path="/contest/:id" element={<ContestDetails />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;