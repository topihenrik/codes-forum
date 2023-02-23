import { Editor, EditorState } from 'react-draft-wysiwyg';

const options = [
  'inline',
  'blockType',
  'fontSize',
  'fontFamily',
  'list',
  'textAlign',
  'colorPicker',
  'link',
  'remove',
  'history',
];

interface IDraftEditorProps {
  editorState: EditorState,
  onEditorStateChange: (newEditorState: EditorState) => void,
}

function DraftEditor({ editorState, onEditorStateChange }: IDraftEditorProps) {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName='draftjs-wrapper'
      editorClassName='draftjs-editor'
      toolbarClassName='draftjs-toolbar'
      toolbar={{ options }}
    />
  );
}

export default DraftEditor;
