import { useState } from 'react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
  Container, Box, Typography, Link, Button, Paper, Avatar, Chip, Pagination,
} from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import ContentLoader from 'react-content-loader';
import { DateTime } from 'luxon';
import { Link as RouterLink } from 'react-router-dom';
import { GET_FEED_POSTS, GET_POSTS_COUNT } from '../graphql/queries';
import { Vote, type Post } from '../__generated__/graphql';
import '@fontsource/roboto-condensed';
import bgBlurSvg from '../assets/bg-blur-v2.svg';
import { VOTE_POST } from '../graphql/mutations';
import Voting from './Voting';
import { feedPostsPageVar } from '../cache';

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  const [votePost] = useMutation(VOTE_POST);

  const handleVoteSubmit = async (voteStatus: Vote) => {
    try {
      await votePost({ variables: { _id: post._id || '', voteStatus } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Paper sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', gap: '16px' }}>
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px',
        }}
        >
          <Voting
            voteCount={post.voteCount || 0}
            voteStatus={post.voteStatus || Vote.None}
            handleVoteSubmit={handleVoteSubmit}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QuestionAnswerOutlinedIcon />
            <Typography>
              {post.commentCount}
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%',
        }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Avatar
                  sx={{ height: '32px', width: '32px', borderRadius: '16px' }}
                  alt='avatar'
                  src={post.author?.avatar?.url || ''}
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
              <Typography
                sx={{ textAlign: 'end' }}
              >
                {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATE_MED)}
              </Typography>
            </Box>
            <Link
              sx={{ color: 'inherit' }}
              component={RouterLink}
              to={`/post/${post._id}`}
            >
              <Typography variant='h6'>
                {post.title}
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {post.tags?.map((tag) => (
              <Chip
                key={crypto.randomUUID()}
                label={tag}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function PostsList() {
  const feedPostsPage = useReactiveVar(feedPostsPageVar);
  const limit = 5;
  const [offset, setOffset] = useState((feedPostsPage - 1) * limit);
  const resultFeedPosts = useQuery(GET_FEED_POSTS, {
    variables: {
      offset,
      limit,
    },
    notifyOnNetworkStatusChange: true,
  });
  const resultPostCount = useQuery(GET_POSTS_COUNT);

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    try {
      feedPostsPageVar(value);
      const newOffset = (value - 1) * limit;
      await resultFeedPosts.fetchMore({ variables: { offset: newOffset, limit } });
      setOffset(newOffset);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (resultFeedPosts.error) {
    return (
      <Box>
        <Typography>
          Errors
        </Typography>
      </Box>
    );
  }

  if (resultFeedPosts.loading) {
    return (
      <Box>
        <ContentLoader
          style={{ width: '100%', height: '100%' }}
          viewBox='0 0 640 947'
          backgroundColor='#262626'
          foregroundColor='#2a2a2a'
        >
          <rect
            x='0'
            y='0'
            rx='5'
            ry='5'
            width='640'
            height='167'
          />
          <rect
            x='0'
            y='183'
            rx='5'
            ry='5'
            width='640'
            height='167'
          />
          <rect
            x='0'
            y='366'
            rx='5'
            ry='5'
            width='640'
            height='167'
          />
          <rect
            x='0'
            y='549'
            rx='5'
            ry='5'
            width='640'
            height='167'
          />
          <rect
            x='0'
            y='732'
            rx='5'
            ry='5'
            width='640'
            height='167'
          />
          <rect
            x='0'
            y='915'
            rx='5'
            ry='5'
            width='640'
            height='32'
          />
        </ContentLoader>
      </Box>
    );
  }

  if ((!(resultFeedPosts?.data?.feedPosts))) {
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
      {resultFeedPosts.data.feedPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
        />
      ))}
      <Pagination
        count={resultPostCount.data?.postsCount
          ? Math.ceil(resultPostCount.data.postsCount / limit)
          : 0}
        page={feedPostsPage}
        onChange={handlePageChange}
      />
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
