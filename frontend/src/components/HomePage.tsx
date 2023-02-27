import { useQuery } from '@apollo/client';
import {
  Container, Box, Typography, Link, Button, Paper, Avatar, Chip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import ContentLoader from 'react-content-loader';
import { DateTime } from 'luxon';
import { Link as RouterLink } from 'react-router-dom';
import { GET_POSTS } from '../graphql/queries';
import { type Post } from '../__generated__/graphql';
import '@fontsource/roboto-condensed';
import bgBlurSvg from '../assets/bg-blur-v2.svg';

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  return (
    <Paper sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', gap: '16px' }}>
        <Box>
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content',
          }}
          >
            <ArrowUpwardIcon />
            <Typography>
              {post.voteCount}
            </Typography>
            <ArrowDownwardIcon />
          </Box>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <Typography>
              {post.commentCount}
            </Typography>
            <QuestionAnswerOutlinedIcon />
          </Box>
        </Box>
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%',
        }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Avatar
                sx={{ height: '32px', width: '32px', borderRadius: '16px' }}
                alt='avatar'
                src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
              />
              <Link
                sx={{ color: 'inherit' }}
                component={RouterLink}
                to={`/profile/${post.author?._id}`}
              >
                <Typography>
                  @
                  {post.author?.username}
                </Typography>
              </Link>
            </Box>
            <Typography>
              {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATE_MED)}
            </Typography>
          </Box>
          <Link
            sx={{ color: 'inherit' }}
            component={RouterLink}
            to={`/post/${post._id}`}
          >
            <Typography>{post.title}</Typography>
          </Link>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Chip label='C++' />
            <Chip label='NoSQL' />
            <Chip label='OOP' />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function PostsList() {
  const result = useQuery(GET_POSTS);

  if (result.error) {
    return (
      <Box>
        <Typography>
          Errors
        </Typography>
      </Box>
    );
  }

  if (result.loading) {
    return (
      <Box>
        <ContentLoader
          style={{ width: '100%', height: '100%' }}
          viewBox='0 0 640 840'
          backgroundColor='#262626'
          foregroundColor='#2a2a2a'
        >
          <rect
            x='0'
            y='0'
            rx='5'
            ry='5'
            width='640'
            height='155'
          />
          <rect
            x='0'
            y='171'
            rx='5'
            ry='5'
            width='640'
            height='155'
          />
          <rect
            x='0'
            y='342'
            rx='5'
            ry='5'
            width='640'
            height='155'
          />
          <rect
            x='0'
            y='513'
            rx='5'
            ry='5'
            width='640'
            height='155'
          />
          <rect
            x='0'
            y='684'
            rx='5'
            ry='5'
            width='640'
            height='155'
          />
        </ContentLoader>
      </Box>
    );
  }

  if ((!(result?.data?.posts))) {
    return (
      <Box>
        <Typography>
          No posts
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}
    >
      {result.data.posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
        />
      ))}
    </Box>
  );
}

function HomePage() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px', width: 'clamp(300px, 85%, 640px)',
      }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundImage: `url(${bgBlurSvg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '256px', padding: '32px',
        }}
        >
          <Typography
            variant='h4'
            sx={{
              color: '#059c3f', fontWeight: '700', fontFamily: 'Roboto Condensed', textShadow: '1px 1px 1px black',
            }}
          >
            Having problems?
          </Typography>
          <Typography
            variant='h3'
            sx={{
              color: '#059c3f', fontWeight: '700', fontFamily: 'Roboto Condensed', textShadow: '1px 1px 1px black',
            }}
          >
            Just DebugIt!
          </Typography>
        </Box>
        <Link
          id='link-post-create'
          sx={{ color: 'inherit', textDecoration: 'none', width: 'fit-content' }}
          component={RouterLink}
          to='/post/create'
        >
          <Button variant='contained'>
            Ask Question
          </Button>
        </Link>
        <PostsList />
      </Box>
    </Container>
  );
}

export default HomePage;
