import { useState, useEffect } from 'react';
import RevyEditor from './ReviewpadEditor/ReviewpadEditor';
import ImportButton from './ImportButton/ImportButton';
import SaveButton from './SaveButton/SaveButton';
import CodeSamples from './CodeSamples/CodeSamples';
import Runner from './Runner/Runner';
import Display from './Display/Display';
import './App.css';

export default function App() {
  
  const [inputCode,setInputCode] = useState("");
  const [codeContent,setCodeContent] = useState("");
  const [runnerResult, setRunnerResult] = useState([]);
  const [error, setError] = useState("");
  const [runnerCounter, setRunnerCounter] = useState(0);
  
  useEffect( () => { setInputCode(codeContent) }, [codeContent]);

  return (
    <>
      <div className="top-pane">
        <div className="left-top-pane">
          <CodeSamples
            className="code-samples"
            getCodeFromFileCallback={setCodeContent}
          />
        </div>
        <div className="center-top-pane">
        <div className="buttons">
          <ImportButton
            name="import-file"
            getTextFromFileCallback={setCodeContent}
          />
          <SaveButton
            className='save-file'
            textToDownload={inputCode}
          />
        </div>
        <RevyEditor
          className="reviewpad-editor"
          defaultValue=""
          theme="vs-dark"
          readOnly={false}
          minimapEnabled={false}
          getValueCallback={setInputCode}
          customValue={codeContent}
        />
        </div>
        <div className="right-top-pane">
          <Runner
            className="runner"
            textToRun={inputCode}
            getRunnerResultCallback={setRunnerResult}
            getRunnerErrosCallback={setError}
            currentCounter={runnerCounter}
            getRunnerCounterCallback={setRunnerCounter}
          />
        </div>
      </div>
      
      <div className="bottom-pane">
      <Display
        counter={runnerCounter}
        runnerResult={runnerResult}
        error={error}
      />
      {
      //<Terminal/>
     }
      </div>
    </>
  );
}