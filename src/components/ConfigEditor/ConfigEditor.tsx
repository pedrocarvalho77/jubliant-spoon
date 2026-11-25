import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface EditorProps{
  className: string,
  defaultValue: string,
  theme: string,
  readOnly: boolean,
  minimapEnabled: boolean,
  getValueCallback?: (value:any) => void,
  onRun?: () => void,
  customValue?: string
}

export default function ConfigEditor(props: EditorProps) {
  
  const {
    className,
    defaultValue,
    theme,
    readOnly,
    minimapEnabled,
    getValueCallback = () => {},
    onRun,
    customValue,
  } = props
  
  // onMount runs once, so it reads the latest callback through a ref
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

    return (
    <div className = {className}>
      <Editor
          height="60vh"
          defaultLanguage="yaml"
          defaultValue={defaultValue}
          theme={theme}
          onMount={(editor, monaco) => {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
          }}
          options={{
            ariaLabel: "Configuration editor",
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