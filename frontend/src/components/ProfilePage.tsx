import { useEffect } from 'react';
import {
  Container, Box, Typography, Table, Paper, TableHead, TableRow, TableCell, TableBody, Avatar, Link,
} from '@mui/material';
import ContentLoader from 'react-content-loader';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { convertFromRaw } from 'draft-js';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../graphql/queries';
import { type Post, type Comment } from '../__generated__/graphql';
import { errorVar } from '../cache';

interface IPostRowProps {
  post: Post
}

function PostRow({ post }: IPostRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Link
          sx={{ color: 'inherit' }}
          component={RouterLink}
          to={`/post/${post._id}`}
        >
          {post.title}
        </Link>
      </TableCell>
      <TableCell>
        {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATE_SHORT)}
      </TableCell>
      <TableCell>
        {post.commentCount}
      </TableCell>
      <TableCell>
        {post.voteCount}
      </TableCell>
    </TableRow>
  );
}

interface ICommentRowProps {
  comment: Comment
}

function CommentRow({ comment }: ICommentRowProps) {
  const plainTextBody = convertFromRaw(JSON.parse(comment.body || '')).getPlainText();
  return (
    <TableRow>
      <TableCell>
        <Link
          sx={{ color: 'inherit' }}
          component={RouterLink}
          to={`/post/${comment.post?._id}`}
        >
          {plainTextBody}
        </Link>
      </TableCell>
      <TableCell>
        {DateTime.fromJSDate(new Date(comment.createdAt)).toLocaleString(DateTime.DATE_SHORT)}
      </TableCell>
      <TableCell>
        {comment.voteCount}
      </TableCell>
    </TableRow>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const userid = useParams().id || '';
  const result = useQuery(GET_PROFILE, {
    variables: {
      _id: userid,
    },
  });

  useEffect(() => {
    if (!result.loading) {
      // Loading is complete
      if (!(result?.data?.profile?.user)) {
        // User was not found -> Post 404
        errorVar('User not found');
        navigate('/error', { replace: true });
        // return;
      }
    }
  }, [result, navigate]);

  if (result.loading) {
    return (
      <Container sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0',
      }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: '16px', margin: { xs: '0 8px', sm: '0' }, width: 'clamp(300px, 70%, 576px)',
        }}
        >
          <ContentLoader
            viewBox='0 0 576 1072'
            backgroundColor='#262626'
            foregroundColor='#2a2a2a'
          >
            <rect
              x='0'
              y='0'
              rx='5'
              ry='5'
              width='576'
              height='310'
            />
            <rect
              x='0'
              y='326'
              rx='5'
              ry='5'
              width='576'
              height='365'
            />
            <rect
              x='0'
              y='707'
              rx='5'
              ry='5'
              width='576'
              height='365'
            />
          </ContentLoader>
        </Box>
      </Container>
    );
  }

  if (!(result.data?.profile)) return null;

  return (
    <Container sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0',
    }}
    >
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '16px', margin: { xs: '0 8px', sm: '0' }, width: 'clamp(300px, 70%, 576px)',
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
                <Typography>
                  @
                  {result.data.profile.user?.username}
                </Typography>
              </Box>
              <Typography>
                Bio:
                {' '}
                { ((!result.data.profile.user?.bio) || result.data.profile.user?.bio === '') ? (
                  'Add a bio in the account page ✍️'
                ) : (
                  result.data.profile.user?.bio
                )}
              </Typography>
            </Box>
          </Box>
          <Paper sx={{
            display: 'flex', justifyContent: 'space-between', backgroundColor: 'grey.900', borderTopLeftRadius: '0', borderTopRightRadius: '0', padding: '8px 16px',
          }}
          >
            <Typography>
              Posts:
              {' '}
              {result.data.profile.postCount}
            </Typography>
            <Typography>
              Comments:
              {' '}
              {result.data.profile.commentCount}
            </Typography>
            <Typography>
              Account Age:
              {' '}
              {Math.floor(-1 * DateTime.fromJSDate(new Date(result.data.profile.user?.createdAt)).diffNow('days').days)}
              {' days'}
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
            {result.data.profile.recentPosts?.length !== 0
              ? (
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
                    {result.data.profile.recentPosts?.map(
                      (post) => (
                        <PostRow
                          key={post?._id}
                          post={post as Post}
                        />
                      ),
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography
                  sx={{ textAlign: 'center' }}
                >
                  ❓ No questions asked yet.
                </Typography>
              )}
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
            {result.data.profile.recentPosts?.length !== 0
              ? (
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
                    {result.data.profile.recentComments?.map(
                      (comment) => (
                        <CommentRow
                          key={comment?._id}
                          comment={comment as Comment}
                        />
                      ),
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography
                  sx={{ textAlign: 'center' }}
                >
                  ❗ No answers given yet.
                </Typography>
              )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProfilePage;
