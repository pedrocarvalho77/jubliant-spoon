import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { DEMO, demoFetch } from '../../demo';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Override with REACT_APP_RUNNER_URL when the runner is not on localhost
const RUNNER_URL = process.env.REACT_APP_RUNNER_URL ?? "http://localhost:8080/dry-run";

interface RunnerProps{
  className: string,
  textToRun: string,
  getRunnerResultCallback: (value:any) => void,
  getRunnerErrosCallback: (value:string) => void,
  currentCounter: number,
  getRunnerCounterCallback: (value:any) => void
}
export default function Runner(props: RunnerProps) {

  const {
    className,
    textToRun,
    getRunnerResultCallback,
    getRunnerErrosCallback,
    currentCounter,
    getRunnerCounterCallback
  } = props

  const [prUrl, setPrUrl] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMouseDownToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  async function handleOnClick(){
    setLoading(true);
    await fetchRunner();
    setLoading(false);
    getRunnerCounterCallback(currentCounter+1);
  }
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
        getRunnerErrosCallback(`Error ${response.status}: ${detail}`);
        return;
      }
      const body = await response.json();
      // Statements is undefined when the runner has nothing to report
      const statements: { Code: unknown }[] = body.Statements ?? [];
      getRunnerErrosCallback("");
      getRunnerResultCallback(statements.map(s => JSON.stringify(s.Code)));
    } catch (error) {
      getRunnerResultCallback([]);
      getRunnerErrosCallback("Error: ERR_EMPTY_RESPONSE");
    }
  }
  return(
    <div className={className}>
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
      disabled={loading}
      onClick={handleOnClick}
      startIcon={loading ? <CircularProgress size={18} color="inherit" sx={{ "@media (prefers-reduced-motion: reduce)": { animationDuration: "8s", "& .MuiCircularProgress-circle": { animationDuration: "8s" } } }}/> : <PlayArrowIcon/>}
    >
      Run
    </Button>
    </div>
  )
}
