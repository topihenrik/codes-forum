import {
  Container, Box, Typography, Table, Paper, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';

// Component's table has fake data -> Implement backend fetching functionality.
function ProfilePage() {
  return (
    <Container sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0',
    }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Paper>
          <Paper sx={{
            backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '8px',
          }}
          >
            <Typography
              variant='h4'
              sx={{ textAlign: 'center' }}
            >
              Profile
            </Typography>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <img
                style={{ height: '128px', width: '128px', borderRadius: '8px' }}
                alt='avatar'
                src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
              />
              <Typography>@jartsa82</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography>
                Bio: Hello I am a typical User!
              </Typography>
              <Box>
                <Typography>
                  Posts: 13
                </Typography>
                <Typography>
                  Comments: 27
                </Typography>
                <Typography>
                  Account Age: 1337 days
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper>
          <Paper sx={{ backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}>
            <Typography
              variant='h5'
              sx={{ textAlign: 'center', padding: '16px' }}
            >
              Recent Posts
            </Typography>
          </Paper>
          <Box sx={{ padding: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Title
                  </TableCell>
                  <TableCell>
                    Date
                  </TableCell>
                  <TableCell>
                    Comments
                  </TableCell>
                  <TableCell>
                    Likes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    TEST: Hello Kitty
                  </TableCell>
                  <TableCell>
                    19/02/2023
                  </TableCell>
                  <TableCell>
                    4
                  </TableCell>
                  <TableCell>
                    13
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    TEST: Hello World
                  </TableCell>
                  <TableCell>
                    16/01/2023
                  </TableCell>
                  <TableCell>
                    2
                  </TableCell>
                  <TableCell>
                    25
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    TEST: Hello Wow
                  </TableCell>
                  <TableCell>
                    05/01/2023
                  </TableCell>
                  <TableCell>
                    14
                  </TableCell>
                  <TableCell>
                    103
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
        <Paper>
          <Paper sx={{ backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}>
            <Typography
              variant='h5'
              sx={{ textAlign: 'center', padding: '16px' }}
            >
              Recent Comments
            </Typography>
          </Paper>
          <Box sx={{ padding: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Post
                  </TableCell>
                  <TableCell>
                    Comment
                  </TableCell>
                  <TableCell>
                    Date
                  </TableCell>
                  <TableCell>
                    Likes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    TEST: Hello Kitty
                  </TableCell>
                  <TableCell>
                    Are you sure?
                  </TableCell>
                  <TableCell>
                    19/02/2023
                  </TableCell>
                  <TableCell>
                    2
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    TEST: Hello World
                  </TableCell>
                  <TableCell>
                    Amazing post!
                  </TableCell>
                  <TableCell>
                    05/02/2023
                  </TableCell>
                  <TableCell>
                    3
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    TEST: Hello Wow
                  </TableCell>
                  <TableCell>
                    Why did you do it?
                  </TableCell>
                  <TableCell>
                    08/01/2023
                  </TableCell>
                  <TableCell>
                    1
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProfilePage;
