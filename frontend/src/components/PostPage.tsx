import { Fragment, useEffect, useState } from 'react';
import {
  ServerError, useMutation, useQuery, useReactiveVar,
} from '@apollo/client';
import {
  Container, Box, Typography, Paper, Link, Button, Divider, Avatar, ButtonBase, Chip,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { DateTime } from 'luxon';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import ContentLoader from 'react-content-loader';
import draftToHtml from 'draftjs-to-html';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_COMMENT, GET_COMMENTS, GET_POST } from '../graphql/queries';
import { Vote, type Comment } from '../__generated__/graphql';
import { decodedTokenVar } from '../config/cache';
import DraftEditor from './DraftEditor';
import {
  CREATE_COMMENT, DELETE_COMMENT, DELETE_POST, EDIT_COMMENT, VOTE_COMMENT, VOTE_POST,
} from '../graphql/mutations';
import Notification from './Notification';
import Voting from './Voting';

function FullPost() {
  const decodedToken = useReactiveVar(decodedTokenVar);
  const navigate = useNavigate();
  const postId = useParams().id || '';
  const result = useQuery(GET_POST, {
    variables: {
      _id: postId,
    },
  });
  const [votePost] = useMutation(VOTE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  const handlePostDelete = async () => {
    try {
      await deletePost({ variables: { _id: postId || '' } });
      navigate('/', { replace: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  // Loading is complete and a post was not found -> Post 404
  if (!result.loading && (!(result?.data?.post))) {
    navigate('/error/Post not found', { replace: true });
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

  if (result.error || (!(result?.data?.post))) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography>
          Errors
        </Typography>
      </Box>
    );
  }

  const { post } = result.data;
  const cleanBody = post.body ? DOMPurify.sanitize(draftToHtml(JSON.parse((post.body)))) : '';

  const handleVoteSubmit = async (voteStatus: Vote) => {
    try {
      await votePost({ variables: { _id: post._id || '', voteStatus } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Box
      className='post-full'
    >
      <Paper sx={{
        backgroundColor: 'primary.dark', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', padding: { xs: '8px', sm: '16px' }, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8px',
      }}
      >
        <Typography
          sx={{ wordBreak: 'break-word' }}
          variant='h4'
        >
          {post.title}
        </Typography>
      </Paper>
      <Box sx={{
        display: 'flex', gap: { xs: '4px', sm: '8px' }, padding: { xs: '8px', sm: '16px' }, boxSizing: 'border-box',
      }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content',
        }}
        >
          <Voting
            voteCount={post.voteCount || 0}
            voteStatus={post.voteStatus || Vote.None}
            handleVoteSubmit={handleVoteSubmit}
          />
        </Box>
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: '16px', width: '100%',
        }}
        >
          <Box
            sx={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: cleanBody }}
          />
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {post.tags?.map((tag) => (
              <Chip
                key={crypto.randomUUID()}
                label={tag}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {(decodedToken?._id === post.author?._id) && (
              <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  id='link-edit-post'
                  sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
                  component={RouterLink}
                  to={`/post/edit/${postId}`}
                >
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Edit
                    {' '}
                  </Typography>
                  <EditIcon sx={{ width: '24px', height: '24px' }} />
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ButtonBase
                    onClick={handlePostDelete}
                  >
                    <Typography sx={{ fontSize: '0.8rem' }}>
                      Delete
                      {' '}
                    </Typography>
                  </ButtonBase>
                  <DeleteIcon sx={{ width: '24px', height: '24px' }} />
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.8rem' }}>
                  Asked&nbsp;
                </Typography>
                <Typography sx={{ fontSize: '0.8rem' }}>
                  {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATE_MED)}
                </Typography>
              </Box>
              {post.createdAt !== post.updatedAt && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.8rem' }}>
                  Modified&nbsp;
                </Typography>
                <Typography sx={{ fontSize: '0.8rem' }}>
                  {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATE_MED)}
                </Typography>
              </Box>
              )}
            </Box>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
            }}
            >
              <Avatar
                sx={{ height: '24px', width: '24px', borderRadius: '16px' }}
                alt='avatar'
                src={post.author?.avatar?.url || ''}
              />
              <Link
                sx={{ color: 'inherit' }}
                component={RouterLink}
                to={`/profile/${post.author?._id}`}
              >
                <Typography sx={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                  @
                  {post.author?.username}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface INotification {
  message: string,
  type: 'success' | 'error'
}

interface ICommentEditProps {
  commentId: string
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
}

function CommentEdit({ commentId, setEditing }: ICommentEditProps) {
  const postid = useParams().id || '';
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const decodedToken = useReactiveVar(decodedTokenVar);
  const [notification, setNotification] = useState<INotification | null>(null);

  const oldCommentResult = useQuery(GET_COMMENT, {
    variables: {
      _id: commentId,
    },
  });

  const [editComment, editResult] = useMutation(
    EDIT_COMMENT,
    {
      refetchQueries: [
        { query: GET_COMMENTS, variables: { post: postid } },
      ],
    },
  );

  // Handle notification change
  useEffect(() => {
    const timeid = setTimeout(() => { setNotification(null); }, 5000);
    return () => { clearTimeout(timeid); };
  }, [notification]);

  // After fetching data from the backend -> Set Editor content state.
  useEffect(() => {
    if (oldCommentResult?.data?.comment?.body) {
      const oldContentState = convertFromRaw(JSON.parse(oldCommentResult.data.comment.body));
      setEditorState(EditorState.createWithContent(oldContentState));
    }
  }, [oldCommentResult.data, setEditorState]);

  // After succesful edit -> Close Editor
  useEffect(() => {
    if (editResult.data) {
      setEditing(false);
    }
  }, [editResult.data, setEditing]);

  // Failed comment update -> Inform user about issues
  useEffect(() => {
    if (editResult.error) {
      if (editResult.error.networkError) { // parse network error message
        const netError = editResult.error.networkError as ServerError;
        setNotification({ message: netError.result.errors[0].message, type: 'error' });
      } else { // parse graphql error message
        setNotification({ message: editResult.error.message, type: 'error' });
      }
    }
  }, [editResult.error]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleCommentSubmit = async () => {
    try {
      if (editorState.getCurrentContent().getPlainText().length <= 10) {
        setNotification({ message: 'Comment too short. Minimum length: 10', type: 'error' });
        return;
      }

      await editComment(
        {
          variables: {
            _id: commentId,
            body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          },
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Box
      className='comment-edit'
      sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <Typography
        variant='h6'
        sx={{ textAlign: 'center' }}
      >
        Edit Your Answer
      </Typography>
      <DraftEditor
        name='comment'
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
      {notification && (
      <Notification
        message={notification.message}
        type={notification.type}
      />
      )}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
      }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Button
            variant='contained'
            onClick={handleCommentSubmit}
            disabled={editResult.loading}
          >
            Update
          </Button>
          <Button
            variant='outlined'
            onClick={() => { setEditing(false); }}
          >
            Cancel
          </Button>
        </Box>
        <Typography>
          author: @
          {decodedToken && decodedToken.username}
        </Typography>
      </Box>
    </Box>
  );
}

interface IFullCommentProps {
  comment: Comment
}

function FullComment({ comment }: IFullCommentProps) {
  const postid = useParams().id || '';
  const [editing, setEditing] = useState(false);
  const decodedToken = useReactiveVar(decodedTokenVar);
  const cleanBody = comment.body ? DOMPurify.sanitize(draftToHtml(JSON.parse(comment.body))) : '';

  const [voteComment] = useMutation(VOTE_COMMENT);
  const [deleteComment] = useMutation(
    DELETE_COMMENT,
    {
      refetchQueries: [
        { query: GET_COMMENTS, variables: { post: postid } },
      ],
    },
  );

  const handleVoteSubmit = async (voteStatus: Vote) => {
    try {
      await voteComment({ variables: { _id: comment._id || '', voteStatus } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleCommentDelete = async () => {
    try {
      await deleteComment({ variables: { _id: comment._id || '' } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (editing) {
    return (
      <CommentEdit
        commentId={comment._id || ''}
        setEditing={setEditing}
      />
    );
  }

  return (
    <Box
      className='comment-full'
      sx={{ display: 'flex', gap: { xs: '4px', sm: '8px' }, padding: '8px 0' }}
    >
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '32px',
      }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content',
        }}
        >
          <Voting
            voteCount={comment.voteCount || 0}
            voteStatus={comment.voteStatus || Vote.None}
            handleVoteSubmit={handleVoteSubmit}
          />
        </Box>
      </Box>
      <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%',
      }}
      >
        <Box
          sx={{ wordBreak: 'break-word' }}
          className='comment'
          dangerouslySetInnerHTML={{ __html: cleanBody }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {(decodedToken?._id === comment.author?._id) && (
            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonBase
                  onClick={() => { setEditing(true); }}
                >
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Edit
                    {' '}
                  </Typography>
                  <EditIcon sx={{ width: '24px', height: '24px' }} />
                </ButtonBase>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonBase
                  onClick={handleCommentDelete}
                >
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Delete
                    {' '}
                  </Typography>
                  <DeleteIcon sx={{ width: '24px', height: '24px' }} />
                </ButtonBase>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.8rem' }}>
                Answered&nbsp;
              </Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>
                {DateTime.fromJSDate(new Date(comment.createdAt)).toLocaleString(DateTime.DATE_MED)}
              </Typography>
            </Box>
            {comment.createdAt !== comment.updatedAt && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.8rem' }}>
                Modified&nbsp;
              </Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>
                {DateTime.fromJSDate(new Date(comment.updatedAt)).toLocaleString(DateTime.DATE_MED)}
              </Typography>
            </Box>
            )}
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
          }}
          >
            <Avatar
              sx={{ height: '24px', width: '24px', borderRadius: '16px' }}
              alt='avatar'
              src={comment.author?.avatar?.url || ''}
            />
            <Link
              sx={{ color: 'inherit' }}
              component={RouterLink}
              to={`/profile/${comment.author?._id}`}
            >
              <Typography sx={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                @
                {comment.author?.username}
              </Typography>
            </Link>
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

  if (result.error || !(result?.data?.comments)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography>
          Errors
        </Typography>
      </Box>
    );
  }

  if (result.data.comments.length === 0) {
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

function CommentCreate() {
  const postid = useParams().id || '';
  const [createComment, result] = useMutation(
    CREATE_COMMENT,
    {
      refetchQueries: [
        { query: GET_COMMENTS, variables: { post: postid } },
      ],
    },
  );
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const decodedToken = useReactiveVar(decodedTokenVar);
  const [notification, setNotification] = useState<INotification | null>(null);

  // Handle notification change
  useEffect(() => {
    const timeid = setTimeout(() => { setNotification(null); }, 5000);
    return () => { clearTimeout(timeid); };
  }, [notification]);

  // After succesful comment creation -> Empty Editor content and Error messages
  useEffect(() => {
    setEditorState(EditorState.createEmpty());
    setNotification(null);
  }, [result.data]);

  // Failed comment creation -> Inform user about issues
  useEffect(() => {
    if (result.error) {
      if (result.error.networkError) { // parse network error message
        const netError = result.error.networkError as ServerError;
        setNotification({ message: netError.result.errors[0].message, type: 'error' });
      } else { // parse graphql error message
        setNotification({ message: result.error.message, type: 'error' });
      }
    }
  }, [result.error]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleCommentSubmit = async () => {
    try {
      if (editorState.getCurrentContent().getPlainText().length <= 10) {
        setNotification({ message: 'Comment too short. Minimum length: 10', type: 'error' });
        return;
      }

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

  if (!decodedToken) {
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
    <Box
      className='comment-create'
      sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
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
      {notification && (
      <Notification
        message={notification.message}
        type={notification.type}
      />
      )}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
      }}
      >
        <Button
          variant='contained'
          onClick={handleCommentSubmit}
          disabled={result.loading}
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
      <CommentCreate />
    </Box>
  );
}

function PostPage() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'column', gap: '32px', margin: { xs: '0 8px', sm: '0' }, padding: '16px 0', width: 'clamp(300px, 85%, 640px)',
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
