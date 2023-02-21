import {
  Container, Box, Typography, Table, Paper, TableHead, TableRow, TableCell, TableBody, Avatar,
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

// Profile information section has fake data -> Implement backend fetching functionality.
// Component's table has fake data -> Implement backend fetching functionality.
function ProfilePage() {
  return (
    <Container sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0',
    }}
    >
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '16px', margin: { xs: '0 8px', sm: '0' }, width: { xs: 'auto', sm: 'clamp(320px, 55%, 576px)' },
      }}
      >
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
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <Box sx={{ display: 'flex', gap: '32px' }}>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              }}
              >
                <Avatar
                  sx={{ height: { xs: '80px', sm: '128px' }, width: { xs: '80px', sm: '128px' }, borderRadius: '8px' }}
                  alt='avatar'
                  src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
                />
                <Typography>@jartsa82</Typography>
              </Box>
              <Typography>
                Bio: Hello I am a typical User!
              </Typography>
            </Box>
          </Box>
          <Paper sx={{
            display: 'flex', justifyContent: 'space-between', backgroundColor: 'grey.900', borderTopLeftRadius: '0', borderTopRightRadius: '0', padding: '8px',
          }}
          >
            <Typography>
              Posts: 13
            </Typography>
            <Typography>
              Comments: 27
            </Typography>
            <Typography>
              Account Age: 1337 days
            </Typography>
          </Paper>
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
                    <ForumOutlinedIcon />
                  </TableCell>
                  <TableCell>
                    <ThumbUpOutlinedIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    TEST: Hello Kitty
                  </TableCell>
                  <TableCell>
                    19.02.2023
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
                    16.01.2023
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
                    05.01.2023
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
                    Comment
                  </TableCell>
                  <TableCell>
                    Date
                  </TableCell>
                  <TableCell>
                    <ThumbUpOutlinedIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Are you sure?
                  </TableCell>
                  <TableCell>
                    19.02.2023
                  </TableCell>
                  <TableCell>
                    2
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Amazing post!
                  </TableCell>
                  <TableCell>
                    05.02.2023
                  </TableCell>
                  <TableCell>
                    3
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Why did you do it?
                  </TableCell>
                  <TableCell>
                    08.01.2023
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
