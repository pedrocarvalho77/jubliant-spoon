import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface DisplayProps {
  counter: number,
  runnerResult: string[],
  error: string
}

const ROWS_PER_COLUMN = 9;

export default function Display({ counter, runnerResult, error }: DisplayProps) {
  const [copied, setCopied] = useState(false);

  if (counter === 0) {
    return <Typography sx={{ color: "text.secondary" }}>Run the configuration to see results here.</Typography>;
  }
  // shortcut: keyed on the API's wording; the API reports "valid but nothing to run on" as a 400
  if (error) return <Alert severity={error.startsWith("Configuration is valid") ? "success" : "error"}>{error}</Alert>;
  if (runnerResult.length === 0) return <Alert severity="info">The runner returned no statements.</Alert>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(runnerResult.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const columns = Math.ceil(runnerResult.length / ROWS_PER_COLUMN);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Chip color="success" size="small" label={`${runnerResult.length} ${runnerResult.length === 1 ? "statement" : "statements"}`} />
        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="result-content" style={{ columnCount: columns }}>
        {runnerResult.map((item, index) => <p key={index}>{item}</p>)}
      </div>
    </>
  );
}
