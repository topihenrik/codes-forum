import {
  Container, Typography, Link, Paper,
} from '@mui/material';
import GitHubIcon from '../assets/github.svg';

function Footer() {
  return (
    <Paper sx={{ width: '100%', padding: '8px 16px', boxSizing: 'border-box' }}>
      <Container sx={{ display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
          Developed by
          <Link
            href='https://github.com/topihenrik'
            sx={{
              display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none',
            }}
          >
            <img
              className='icon github-icon'
              alt='GitHub Icon'
              src={GitHubIcon}
            />
            topihenrik
          </Link>
        </Typography>
      </Container>
    </Paper>
  );
}

export default Footer;
