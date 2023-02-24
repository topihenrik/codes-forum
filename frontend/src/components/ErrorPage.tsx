import { useReactiveVar } from '@apollo/client';
import { Box, Container, Typography } from '@mui/material';
import { errorVar } from '../cache';

function ErrorPage() {
  const error = useReactiveVar(errorVar);
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box>
        <Typography variant='h4'>
          Error:
          {' '}
          {error}
        </Typography>
      </Box>
    </Container>
  );
}

export default ErrorPage;
