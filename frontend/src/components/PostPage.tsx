import { Fragment, useEffect, useState } from 'react';
import {
  ServerError, useMutation, useQuery, useReactiveVar,
} from '@apollo/client';
import {
  Container, Box, Typography, Paper, Link, Button, Divider, Avatar,
} from '@mui/material';
import DOMPurify from 'dompurify';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DateTime } from 'luxon';
import { convertToRaw, EditorState } from 'draft-js';
import ContentLoader from 'react-content-loader';
import draftToHtml from 'draftjs-to-html';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { GET_COMMENTS, GET_POST } from '../graphql/queries';
import { type Comment } from '../__generated__/graphql';
import { tokenVar, errorVar } from '../cache';
import DraftEditor from './DraftEditor';
import { decodeToken, IDecodedToken } from '../utils';
import { CREATE_COMMENT } from '../graphql/mutations';
import Notification from './Notification';

function FullPost() {
  const navigate = useNavigate();
  const postId = useParams().id || '';
  const result = useQuery(GET_POST, {
    variables: {
      _id: postId,
    },
  });

  // Loading is complete and a post was not found -> Post 404
  if (!result.loading && (!(result?.data?.post))) {
    errorVar('Post not found');
    navigate('/error', { replace: true });
  }

  if (result.error || (!(result?.data?.post))) {
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
      <ContentLoader
        viewBox='0 0 576 512'
        backgroundColor='#262626'
        foregroundColor='#2a2a2a'
      >
        <rect
          x='16'
          y='16'
          rx='5'
          ry='5'
          width='544'
          height='80'
        />
        <rect
          x='16'
          y='128'
          rx='5'
          ry='5'
          width='544'
          height='368'
        />
      </ContentLoader>
    );
  }

  const { post } = result.data;
  const cleanBody = post.body ? DOMPurify.sanitize(draftToHtml(JSON.parse((post.body)))) : '';

  return (
    <>
      <Paper sx={{
        backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: { xs: '8px', sm: '16px' }, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8px',
      }}
      >
        <Typography variant='h4'>{post.title}</Typography>
      </Paper>
      <Box sx={{
        display: 'flex', gap: { xs: '4px', sm: '8px' }, padding: { xs: '8px', sm: '16px' }, boxSizing: 'border-box',
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
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%',
        }}
        >
          <Box
            dangerouslySetInnerHTML={{ __html: cleanBody }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem' }}>
              Asked
              {' '}
              {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATE_MED)}
            </Typography>
            {post.createdAt !== post.updatedAt && (
            <Typography sx={{ fontSize: '0.9rem' }}>
              Modified
              {' '}
              {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATE_MED)}
            </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar
                sx={{ height: '24px', width: '24px', borderRadius: '16px' }}
                alt='avatar'
                src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
              />
              <Typography>
                @
                {post.author?.username}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

interface IFullCommentProps {
  comment: Comment
}

function FullComment({ comment }: IFullCommentProps) {
  const cleanBody = comment.body ? DOMPurify.sanitize(draftToHtml(JSON.parse(comment.body))) : '';
  return (
    <Box sx={{ display: 'flex', gap: { xs: '4px', sm: '8px' }, padding: '8px 0' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'fit-content',
      }}
      >
        <ArrowUpwardIcon />
        <Typography>
          {comment.voteCount}
        </Typography>
        <ArrowDownwardIcon />
      </Box>
      <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%',
      }}
      >
        <Box
          className='comment'
          dangerouslySetInnerHTML={{ __html: cleanBody }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.9rem' }}>
            Answered
            {' '}
            {DateTime.fromJSDate(new Date(comment.createdAt)).toLocaleString(DateTime.DATE_MED)}
          </Typography>
          {comment.createdAt !== comment.updatedAt && (
          <Typography sx={{ fontSize: '0.9rem' }}>
            Modified
            {' '}
            {DateTime.fromJSDate(new Date(comment.updatedAt)).toLocaleString(DateTime.DATE_MED)}
          </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar
              sx={{ height: '24px', width: '24px', borderRadius: '16px' }}
              alt='avatar'
              src='https://res.cloudinary.com/dqcnxy51g/image/upload/v1665038713/blog-api/y3cc4mknjxyhqa3pgggz.webp'
            />
            <Typography>
              @
              {comment.author?.username}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CommentsList() {
  const postid = useParams().id || '';
  const result = useQuery(GET_COMMENTS, {
    variables: { post: postid },
  });

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
          viewBox='0 0 545 512'
          backgroundColor='#262626'
          foregroundColor='#2a2a2a'
        >
          <rect
            x='0'
            y='0'
            rx='5'
            ry='5'
            width='545'
            height='160'
          />
          <rect
            x='0'
            y='176'
            rx='5'
            ry='5'
            width='545'
            height='160'
          />
          <rect
            x='0'
            y='352'
            rx='5'
            ry='5'
            width='545'
            height='160'
          />
        </ContentLoader>
      </Box>
    );
  }

  if (!(result?.data?.comments) || result.data.comments.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography>
          No solutions for this question. 😢
        </Typography>
        <Typography>
          Be the first to respond!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {result.data.comments.map((comment, i) => (
        <Fragment key={comment._id}>
          <FullComment
            comment={comment}
          />
          { result?.data?.comments?.length as number - 1 !== i && <Divider /> }
        </Fragment>
      ))}
    </Box>
  );
}

interface IError {
  message: string
}

function CommentEditor() {
  const postid = useParams().id || '';
  const [createComment, result] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS, variables: { post: postid } }],
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const token = useReactiveVar(tokenVar);
  const [decodedToken, setDecodedToken] = useState<IDecodedToken | null>(null);
  const [error, setError] = useState<IError | null >(null);

  useEffect(() => {
    setDecodedToken(decodeToken(token));
  }, [token]);

  useEffect(() => {
    setEditorState(EditorState.createEmpty());
    setError(null);
  }, [result.data]);

  useEffect(() => {
    if (result.error) {
      if (result.error.networkError) { // parse network error message
        const netError = result.error.networkError as ServerError;
        setError({ message: netError.result.errors[0].message });
      } else { // parse graphql error message
        setError({ message: result.error.message });
      }
    }
  }, [result.error]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleCommentSubmit = async () => {
    if (editorState.getCurrentContent().getPlainText().length <= 10) {
      setError({ message: 'Comment too short. Minimum length: 10' });
      return;
    }

    try {
      await createComment(
        {
          variables: {
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            post: postid,
          },
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (!token) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link
          component={RouterLink}
          to='/login'
        >
          <Button
            variant='contained'
            sx={{ textAlign: 'center', fontWeight: '700' }}
          >
            Login to Answer
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography
        variant='h6'
        sx={{ textAlign: 'center' }}
      >
        Your Answer
      </Typography>
      <DraftEditor
        name='comment'
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
      {error && <Notification message={error.message} />}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px',
      }}
      >
        <Button
          variant='contained'
          onClick={handleCommentSubmit}
        >
          Submit
        </Button>
        <Typography>
          author: @
          {decodedToken && decodedToken.username}
        </Typography>
      </Box>
    </Box>
  );
}

function CommentSection() {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', gap: '16px', padding: { xs: '8px', sm: '16px' }, boxSizing: 'border-box',
    }}
    >
      <Typography
        variant='h6'
        sx={{ textAlign: 'center' }}
      >
        Answers
      </Typography>
      <CommentsList />
      <Divider />
      <CommentEditor />
    </Box>
  );
}

function PostPage() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '32px', margin: { xs: '0 8px', sm: '0' }, padding: '16px 0', width: 'clamp(300px, 70%, 576px)',
      }}
      >
        <Paper>
          <FullPost />
          <Divider sx={{ margin: '0 16px' }} />
          <CommentSection />
        </Paper>
      </Box>
    </Container>
  );
}

export default PostPage;
