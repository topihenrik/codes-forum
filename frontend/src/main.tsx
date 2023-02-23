import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import cache from './cache';
import link from './link';
import theme from './theme';
import './index.css';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AccountPage from './components/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './components/ProfilePage';
import PostCreatePage from './components/PostCreatePage';
import PostPage from './components/PostPage';

const client = new ApolloClient(
  {
    cache,
    link,
  },
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route
            path='/'
            element={<HomePage />}
          />
          <Route
            path='/signup'
            element={<SignupPage />}
          />
          <Route
            path='/login'
            element={<LoginPage />}
          />
          <Route
            path='/account'
            element={(
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path='/profile/:id'
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path='/post/create'
            element={(
              <ProtectedRoute>
                <PostCreatePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path='/post/:id'
            element={<PostPage />}
          />
        </Routes>
        <Footer />
      </ThemeProvider>
    </Router>
  </ApolloProvider>,
);
