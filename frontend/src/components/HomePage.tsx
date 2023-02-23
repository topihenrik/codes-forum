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
              0
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
              <Typography>
                @
                {post.author?.username}
              </Typography>
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

function HomePage() {
  const result = useQuery(GET_POSTS);
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px', width: 'clamp(300px, 70%, 640px)',
      }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundImage: 'url(https://res.cloudinary.com/dqcnxy51g/image/upload/v1677187718/codes-forum/static/green-gradient_hr2aht.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '256px', padding: '32px',
        }}
        >
          <Typography
            variant='h3'
            sx={{ color: 'black', fontWeight: '700', fontFamily: 'Roboto Condensed' }}
          >
            Any problem can be solved with
            {' '}
            <span style={{ textDecoration: 'underline', textEmphasisColor: 'white' }}>
              DebugIt!
            </span>
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
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}
        >
          { result.loading || (!(result?.data?.posts)) ? (
            <ContentLoader
              style={{ height: '285px', width: '256px' }}
              viewBox='0 0 256 290'
              backgroundColor='#262626'
              foregroundColor='#2a2a2a'
            >
              <rect
                x='0'
                y='0'
                rx='5'
                ry='5'
                width='256'
                height='256'
              />
              <rect
                x='28'
                y='260'
                rx='5'
                ry='5'
                width='200'
                height='30'
              />
            </ContentLoader>
          ) : (
            result.data.posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
              />
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
