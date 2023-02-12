import { useQuery } from '@apollo/client';
import { gql } from './__generated__/gql';

const GET_BOOKS = gql(/* GraphQL */`
    query GetBooks{
        books {
            _id
            title
            author
        }
    }
`);

function App() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <p>
        Error:
        {error.message}
      </p>
    );
  }

  return (
    <div className="App">
      {data && data.books.map((book/* : Book */) => (
        <p key={crypto.randomUUID()}>
          {book.title}
          {' '}
          by
          {' '}
          {book.author}
        </p>
      ))}
    </div>
  );
}

export default App;
