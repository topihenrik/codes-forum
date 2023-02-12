import { useReactiveVar } from '@apollo/client';
import { Container, Box } from '@mui/material';
import { tokenVar } from '../graphql/cache';

function HomePage() {
  const token = useReactiveVar(tokenVar);

  console.log(token);
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box>
        <h1>Home Page</h1>
      </Box>
    </Container>
  );
}

export default HomePage;
