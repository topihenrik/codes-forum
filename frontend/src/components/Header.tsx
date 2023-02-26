import { useState } from 'react';
import {
  Box, Button, Container,
  Drawer, IconButton, List,
  ListItem, ListItemButton, ListItemIcon,
  Typography, Link, Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import InputIcon from '@mui/icons-material/Input';
import MenuIcon from '@mui/icons-material/Menu';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { decodedTokenVar } from '../cache';

function Header() {
  const [drawer, setDrawer] = useState(false);
  const decodedToken = useReactiveVar(decodedTokenVar);
  const client = useApolloClient();

  const handleLogout = () => {
    decodedTokenVar(null);
    localStorage.clear();
    client.clearStore();
  };

  return (
    <Paper sx={{
      width: '100%', boxSizing: 'border-box', position: 'sticky', top: '0', zIndex: '10',
    }}
    >
      <Container
        sx={{
          display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box', padding: '8px',
        }}
      >
        {/* Desktop */}
        <Link
          sx={{ color: 'inherit', textDecoration: 'none' }}
          component={RouterLink}
          to='/'
        >
          <Typography variant='h4'>DebugIt()</Typography>
        </Link>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '16px', alignItems: 'center' }}>
          {decodedToken
            ? (
              <>
                <Link
                  id='link-profile-desktop'
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to={`/profile/${decodedToken._id}`}
                >
                  <Button>
                    <Typography variant='button'>Profile</Typography>
                  </Button>
                </Link>
                <Link
                  id='link-account-desktop'
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/account'
                >
                  <Button>
                    <Typography variant='button'>Account</Typography>
                  </Button>
                </Link>
                <Button
                  id='link-logout-desktop'
                  variant='outlined'
                  onClick={handleLogout}
                >
                  <Typography variant='button'>Logout</Typography>
                </Button>
              </>
            )
            : (
              <>
                <Link
                  id='link-login-desktop'
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/login'
                >
                  <Button variant='outlined'>
                    <Typography variant='button'>Login</Typography>
                  </Button>
                </Link>
                <Link
                  id='link-signup-desktop'
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/signup'
                >
                  <Button variant='contained'>
                    <Typography variant='button'>Signup</Typography>
                  </Button>
                </Link>
              </>
            )}
        </Box>
        {/* Mobile */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={() => { setDrawer(true); }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          anchor='top'
          open={drawer}
          onClose={() => { setDrawer(false); }}
        >
          {decodedToken
            ? (
              <List>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to={`/profile/${decodedToken._id}`}
                >
                  <ListItem>
                    <ListItemButton onClick={() => { setDrawer(false); }}>
                      <ListItemIcon><LoginIcon /></ListItemIcon>
                      <Typography variant='button'>Profile</Typography>
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/account'
                >
                  <ListItem>
                    <ListItemButton onClick={() => { setDrawer(false); }}>
                      <ListItemIcon><LoginIcon /></ListItemIcon>
                      <Typography variant='button'>Account</Typography>
                    </ListItemButton>
                  </ListItem>
                </Link>
                <ListItem>
                  <ListItemButton onClick={() => { handleLogout(); setDrawer(false); }}>
                    <ListItemIcon><InputIcon /></ListItemIcon>
                    <Typography variant='button'>Logout</Typography>
                  </ListItemButton>
                </ListItem>
              </List>
            )
            : (
              <List>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/login'
                >
                  <ListItem>
                    <ListItemButton onClick={() => { setDrawer(false); }}>
                      <ListItemIcon><LoginIcon /></ListItemIcon>
                      <Typography variant='button'>Login</Typography>
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/signup'
                >
                  <ListItem>
                    <ListItemButton onClick={() => { setDrawer(false); }}>
                      <ListItemIcon><InputIcon /></ListItemIcon>
                      <Typography variant='button'>Signup</Typography>
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
            )}
        </Drawer>
      </Container>
    </Paper>
  );
}

export default Header;
