import { Container, Typography, Link } from '@mui/material';
import GitHubIcon from '../assets/github.svg';

function Footer() {
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
      <Typography sx={{ display: 'flex', alignItems: 'center' }}>
        Developed by
        <Link
          href="https://github.com/topihenrik"
          sx={{
            display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none',
          }}
        >
          <img className="icon" alt="GitHub Icon" src={GitHubIcon} />
          topihenrik
        </Link>
      </Typography>
    </Container>
  );
}

export default Footer;
