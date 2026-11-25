import { Button } from "@mui/material";

interface CodeSamplesProps {
  className?: string,
  getCodeFromFileCallback: (value: string) => void
}

// YAMLs live in public/samples
const SAMPLES = [
  { file: "pr-size-labelling", label: "PR size labelling" },
  { file: "hello-world", label: "Hello world" },
  { file: "lint-commits", label: "Lint commits" },
  { file: "empty-description", label: "Empty description" },
  { file: "assign-author", label: "Assign author" },
];

export default function CodeSamples({ className, getCodeFromFileCallback }: CodeSamplesProps) {
  async function fetchCode(file: string) {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}samples/${file}.yml`);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      getCodeFromFileCallback(await response.text());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={className} role="group" aria-label="Samples" style={{ display: "contents" }}>
      {SAMPLES.map(({ file, label }) => (
        <Button key={file} size="small" variant="outlined" onClick={() => fetchCode(file)}>{label}</Button>
      ))}
    </div>
  );
}
