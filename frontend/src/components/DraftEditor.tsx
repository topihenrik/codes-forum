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
  name: string,
  editorState: EditorState,
  onEditorStateChange: (newEditorState: EditorState) => void,
}

function DraftEditor({ name, editorState, onEditorStateChange }: IDraftEditorProps) {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName={`draftjs-wrapper draftjs-wrapper-${name}`}
      editorClassName={`draftjs-editor draftjs-editor-${name}`}
      toolbarClassName={`draftjs-toolbar draftjs-toolbar-${name}`}
      toolbar={{ options }}
    />
  );
}

export default DraftEditor;
