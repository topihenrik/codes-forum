import { Container, Box, Typography } from '@mui/material';

function HomePage() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box>
        <Typography variant='h3'>Home Page</Typography>
      </Box>
    </Container>
  );
}

export default HomePage;
