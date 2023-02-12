import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import { tokenVar } from './graphql/cache';

// Apollo Client configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        token: {
          read() {
            return tokenVar();
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: import.meta.env.VITE_NODE_ENV === 'production' ? '/graphql' : 'http://localhost:4000/graphql',
  cache,
});

// MUI Style configuration
const theme = createTheme({
  typography: {
    fontSize: 16,
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          height: '32px',
          width: '32px',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </Router>
  </ApolloProvider>,
);
