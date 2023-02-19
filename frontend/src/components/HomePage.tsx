import { Container, Box } from '@mui/material';

function HomePage() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box>
        <h1>Home Page</h1>
      </Box>
    </Container>
  );
}

export default HomePage;
