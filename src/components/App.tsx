import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ConfigEditor from './ConfigEditor/ConfigEditor';
import ImportButton from './ImportButton/ImportButton';
import SaveButton from './SaveButton/SaveButton';
import CodeSamples from './CodeSamples/CodeSamples';
import Runner from './Runner/Runner';
import Display from './Display/Display';
import { DEMO } from '../demo';
import './App.css';

type Mode = 'light' | 'dark';
const MODE_KEY = 'theme-mode';

function initialMode(): Mode {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage unavailable */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [inputCode,setInputCode] = useState("");
  const [codeContent,setCodeContent] = useState("");
  const [runnerResult, setRunnerResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [runnerCounter, setRunnerCounter] = useState(0);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#818cf8' : '#4f46e5' },
      background: mode === 'dark'
        ? { default: '#0f1117', paper: '#181b24' }
        : { default: '#f4f5f9', paper: '#ffffff' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
  }), [mode]);

  const toggleMode = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    try { localStorage.setItem(MODE_KEY, next); } catch { /* storage unavailable */ }
  };

  const loadCode = (code: string) => { setCodeContent(code); setInputCode(code); };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app" style={{ ['--border' as string]: theme.palette.divider }}>
        <header className="app-header">
          <div>
            <Typography variant="h5" fontWeight={600}>Config Syntax Validator & Evaluator</Typography>
            <Typography variant="body2" color="text.secondary">
              Edit a configuration and dry-run it against a pull request.
            </Typography>
          </div>
          <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <IconButton onClick={toggleMode} aria-label="toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </header>

        {DEMO && (
          <Alert severity="info">
            Demo mode: no backend is connected. Run returns the actions found in your configuration
            as simulated results. Run the API locally for real evaluation.
          </Alert>
        )}

        <div className="workspace">
          <Paper variant="outlined" className="panel">
            <div className="toolbar">
              <CodeSamples getCodeFromFileCallback={loadCode} />
              <span className="spacer" />
              <ImportButton getTextFromFileCallback={loadCode} />
              <SaveButton className="save-file" textToDownload={inputCode} />
            </div>
            <ConfigEditor
              className="config-editor"
              defaultValue=""
              theme={mode === 'dark' ? 'vs-dark' : 'light'}
              readOnly={false}
              minimapEnabled={false}
              getValueCallback={setInputCode}
              customValue={codeContent}
            />
          </Paper>

          <Paper variant="outlined" className="panel">
            <Runner
              className="runner"
              textToRun={inputCode}
              getRunnerResultCallback={setRunnerResult}
              getRunnerErrosCallback={setError}
              currentCounter={runnerCounter}
              getRunnerCounterCallback={setRunnerCounter}
            />
          </Paper>
        </div>

        <Paper variant="outlined" className="panel">
          <Display counter={runnerCounter} runnerResult={runnerResult} error={error} />
        </Paper>
      </div>
    </ThemeProvider>
  );
}
