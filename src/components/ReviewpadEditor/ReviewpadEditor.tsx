import Editor from "@monaco-editor/react";

interface EditorProps{
  className: string,
  defaultValue: string,
  theme: string,
  readOnly: boolean,
  minimapEnabled: boolean,
  getValueCallback?: (value:any) => void,
  customValue?: string
}

export default function ReviewpadEditor(props: EditorProps) {
  
  const {
    className,
    defaultValue,
    theme,
    readOnly,
    minimapEnabled,
    getValueCallback = () => {},
    customValue,
  } = props
  
    return (
    <div className = {className}>
      <Editor
          height="50vh"
          defaultLanguage="yaml"
          defaultValue={defaultValue}
          theme={theme}
          options={{
            minimap:{
              enabled:minimapEnabled
            },
            readOnly
          }}
          onChange={getValueCallback}
          value={customValue}
        />
    </div>
  );
}