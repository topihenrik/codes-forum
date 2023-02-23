import { useQuery } from '@apollo/client';
import DOMPurify from 'dompurify';
import {
  Container, Box, Typography, Paper,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DateTime } from 'luxon';
import ContentLoader from 'react-content-loader';
import draftToHtml from 'draftjs-to-html';
import { useParams } from 'react-router-dom';
import { GET_POST } from '../graphql/queries';
import { type Post } from '../__generated__/graphql';

interface FullPostProps {
  post: Post
}

function FullPost({ post }: FullPostProps) {
  const cleanBody = post.body ? DOMPurify.sanitize(draftToHtml(JSON.parse(post.body))) : '';

  return (
    <Paper>
      <Paper sx={{
        backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8px',
      }}
      >
        <Typography variant='h4'>{post.title}</Typography>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Typography>
            Asked
            {' '}
            {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATE_MED)}
          </Typography>
          {post.createdAt !== post.updatedAt && (
          <Typography>
            Modified
            {' '}
            {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATE_MED)}
          </Typography>
          )}
        </Box>
      </Paper>
      <Box sx={{
        display: 'flex', gap: '16px', padding: '16px', boxSizing: 'border-box',
      }}
      >
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
        <Box
          dangerouslySetInnerHTML={{ __html: cleanBody }}
        />
      </Box>
    </Paper>
  );
}

function PostPage() {
  const postId = useParams().id || '';
  const result = useQuery(GET_POST, {
    variables: {
      _id: postId,
    },
  });

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '32px', margin: { xs: '0 8px', sm: '0' }, width: 'clamp(300px, 70%, 576px)',
      }}
      >
        {result.loading || (!(result?.data?.post)) ? (
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
          <FullPost post={result.data.post} />
        )}
      </Box>
    </Container>
  );
}

export default PostPage;
