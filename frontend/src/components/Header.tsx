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
import { useReactiveVar } from '@apollo/client';
import { tokenVar } from '../cache';

function Header() {
  const [drawer, setDrawer] = useState(false);
  const token = useReactiveVar(tokenVar);

  const handleLogout = () => {
    localStorage.clear();
    tokenVar(null);
  };

  return (
    <Paper sx={{
      width: '100%', padding: '8px 16px', boxSizing: 'border-box', position: 'sticky', top: '0px',
    }}
    >
      <Container
        sx={{ display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box' }}
      >
        {/* Desktop */}
        <Link
          sx={{ color: 'inherit', textDecoration: 'none' }}
          component={RouterLink}
          to='/'
        >
          <Typography variant='h4'>&lt;codes/&gt;</Typography>
        </Link>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '16px', alignItems: 'center' }}>
          {token
            ? (
              <>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/profile/test'
                >
                  <Button>
                    <Typography variant='button'>Profile</Typography>
                  </Button>
                </Link>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/account'
                >
                  <Button>
                    <Typography variant='button'>Account</Typography>
                  </Button>
                </Link>
                <Button
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
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/login'
                >
                  <Button variant='outlined'>
                    <Typography variant='button'>Login</Typography>
                  </Button>
                </Link>
                <Link
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
          {token
            ? (
              <List>
                <Link
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                  component={RouterLink}
                  to='/profile'
                >
                  <ListItem>
                    <ListItemButton onClick={() => { setDrawer(false); }}>
                      <ListItemIcon><LoginIcon /></ListItemIcon>
                      <Typography variant='button'>Profile</Typography>
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
