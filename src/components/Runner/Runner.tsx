import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import { useEffect, useState, type MutableRefObject } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DEMO, demoFetch } from '../../demo';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Monaco maps CtrlCmd to the Command key on macOS
const SHORTCUT = /Mac|iPhone|iPad/.test(navigator.platform) ? "Meta+Enter" : "Control+Enter";
const SHORTCUT_LABEL = SHORTCUT === "Meta+Enter" ? "\u2318+Enter" : "Ctrl+Enter";

// Override with VITE_RUNNER_URL when the runner is not on localhost
const RUNNER_URL = import.meta.env.VITE_RUNNER_URL ?? "http://localhost:8080/dry-run";

interface RunnerProps{
  className: string,
  textToRun: string,
  getRunnerResultCallback: (value:any) => void,
  getRunnerErrosCallback: (value:string) => void,
  currentCounter: number,
  getRunnerCounterCallback: (value:any) => void,
  running: boolean,
  setRunning: (value: boolean) => void,
  runRef: MutableRefObject<(() => void) | null>
}
export default function Runner(props: RunnerProps) {

  const {
    className,
    textToRun,
    getRunnerResultCallback,
    getRunnerErrosCallback,
    currentCounter,
    getRunnerCounterCallback,
    running,
    setRunning,
    runRef
  } = props

  const [prUrl, setPrUrl] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const handleMouseDownToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  async function handleOnClick(){
    if (running) return;
    if (!textToRun.trim()) {
      getRunnerResultCallback([]);
      getRunnerErrosCallback("Add a configuration or pick a sample before running.");
      getRunnerCounterCallback(currentCounter+1);
      return;
    }
    setRunning(true);
    await fetchRunner();
    setRunning(false);
    getRunnerCounterCallback(currentCounter+1);
  }
  // Lets the editor trigger the same action with Ctrl/Cmd+Enter
  useEffect(() => { runRef.current = handleOnClick; });
  async function fetchRunner(){
    try {
      const response = await (DEMO ? demoFetch : fetch)(RUNNER_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          gitHubToken: token,
          pullRequestUrl: prUrl,
          configuration: textToRun
        })
      });
      if (!response.ok) {
        getRunnerResultCallback([]);
        const detail = (await response.text()).trim() || response.statusText;
        // shortcut: matches the API's wording for "valid, but no PR to run it on"; a status field in the API would be cleaner
        getRunnerErrosCallback(detail.startsWith("Configuration is valid") ? detail : `${detail} (HTTP ${response.status})`);
        return;
      }
      const body = await response.json();
      // Statements is undefined when the runner has nothing to report
      const statements: { Code: unknown }[] = body.Statements ?? [];
      getRunnerErrosCallback("");
      getRunnerResultCallback(statements.map(s => JSON.stringify(s.Code)));
    } catch (error) {
      getRunnerResultCallback([]);
      getRunnerErrosCallback(`Could not reach the runner at ${RUNNER_URL}. Is the API running?`);
    }
  }
  return(
    <form className={className} noValidate onSubmit={(e) => { e.preventDefault(); handleOnClick(); }}>
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="outlined-url">Pull Request URL</InputLabel>
      <OutlinedInput
        id="outlined-url"
        type="url"
        value={prUrl}
        onChange={(event) => setPrUrl(event.target.value)}
        label="Pull Request URL"
        placeholder="https://github.com/google/guava/pull/6059"
      />
    </FormControl>
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="outlined-adornment-token">GitHub token</InputLabel>
        <OutlinedInput
          id="outlined-adornment-token"
          type={showToken ? 'text' : 'password'}
          autoComplete="off"
          inputProps={{ 'aria-describedby': 'token-help' }}
          value={token}
          onChange={(event) => setToken(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle token visibility"
                onClick={() => setShowToken(!showToken)}
                onMouseDown={handleMouseDownToken}
                edge="end"
              >
                {showToken ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="GitHub token"
       />
        <FormHelperText id="token-help">Only sent to the runner you configured.</FormHelperText>
      </FormControl>
    <Button
      fullWidth
      disableElevation
      type="submit"
      variant="contained"
      size="large"
      disabled={running}
      aria-keyshortcuts={SHORTCUT}
      startIcon={running ? <CircularProgress size={18} color="inherit" sx={{ "@media (prefers-reduced-motion: reduce)": { animationDuration: "8s", "& .MuiCircularProgress-circle": { animationDuration: "8s" } } }}/> : <PlayArrowIcon/>}
    >
      Run
    </Button>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      Tip: press {SHORTCUT_LABEL} in the editor to run.
    </Typography>
    </form>
  )
}
