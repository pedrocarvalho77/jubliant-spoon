import { Button, ButtonGroup } from "@mui/material";

interface CodeSamplesProps{
  className:string,
  getCodeFromFileCallback: (value:any) => void
}

export default function CodeSamples(props: CodeSamplesProps) {
    
    const {
        className,
        getCodeFromFileCallback,
    } = props

    const map = new Map();
    map.set("pr-size-labelling","https://raw.githubusercontent.com/reviewpad/catalog/main/pr-size-labelling.yml")
    map.set("file-path-labelling","https://raw.githubusercontent.com/reviewpad/catalog/main/file-path-labelling.yml")
    map.set("assign-review-to-3-developers","https://raw.githubusercontent.com/reviewpad/catalog/main/assign-review-to-3-developers.yml")
    map.set("label-file-pattern","https://raw.githubusercontent.com/reviewpad/catalog/main/label-file-pattern.yml")
    map.set("hello-world","https://raw.githubusercontent.com/reviewpad/catalog/main/hello-world.yml")

    const handleOnClick = (fileName : string) => fetchCode(fileName);
    
    async function fetchCode(fileName : string){
      try{
        let response = await fetch(map.get(fileName));
        const test = await response.text();
        getCodeFromFileCallback(test);
      } catch(error){
        console.log(error);
      }
    }

    return (
    <ButtonGroup
      className={className}
      variant="contained"
      aria-label="vertical contained button group"
      orientation="vertical"
      size="small"
    >
      <Button
       onClick={() => handleOnClick("pr-size-labelling")}
      >
        PR size labelling
      </Button>
      
      <Button
        onClick={() => handleOnClick("file-path-labelling")}
      >
        File path labelling
      </Button>
      
      <Button
        onClick={() => handleOnClick("assign-review-to-3-developers")}
      >
        Assign review to 3  developers
      </Button>
        
      <Button
        onClick={() => handleOnClick("label-file-pattern")}
      >
        Label file pattern
      </Button>
        <Button
          onClick={() => handleOnClick("hello-world")}
        >
        Hello world
        </Button>
    </ButtonGroup>
  )
}
