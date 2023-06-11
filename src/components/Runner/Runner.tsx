import Button from '@mui/material/Button';
import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface RunnerProps{
  className: string,
  textToRun: string,
  getRunnerResultCallback: (value:any) => void,
  getRunnerErrosCallback: (value:string) => void,
  currentCounter: number,
  getRunnerCounterCallback: (value:any) => void
}
interface State {
  amount: string;
  token: string;
  weight: string;
  weightRange: string;
  showToken: boolean;
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
  const [tokenValues, setTokenValues] = useState<State>({
    amount: '',
    token: '',
    weight: '',
    weightRange: '',
    showToken: false,
  });

  var arrayRunnerResult: string[] = [];

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenValues({ ...tokenValues, [prop]: event.target.value });
  };
  
  const handleClickShowToken = () => {
    setTokenValues({
      ...tokenValues,
      showToken: !tokenValues.showToken,
    });
  };
  
  const handleMouseDownToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function handleOnClick(){
    fetchRunner();
    getRunnerCounterCallback(currentCounter+1);
  }
  async function fetchRunner(){

    const requestContent = {
      "gitHubToken": tokenValues.token,
      "pullRequestUrl": prUrl,
      "reviewpadConfiguration": textToRun
    }
    try {
      let response = await fetch("http://localhost:8080/dry-run", {
        method: "post",
        mode: "cors",
        body: JSON.stringify(requestContent)
      });
      if(response.status >= 200 && response.status <= 299){
        //console.log("entrou com status entre 200 e 299");

        //deal with response fetch
        const responseJSON = await response.json();
        const responseStringified = JSON.stringify(responseJSON);
        const respondeParsed = JSON.parse(responseStringified);
        const responseStatementsList = respondeParsed.Statements;

        //its undefined when the reponse is undefined, this occurs when no requests are being made
        if(responseStatementsList !== undefined){
          for (var i = 0, l = responseStatementsList.length; i < l; i++) {
            var listLiteral = responseStatementsList[i];
            var codeValue = JSON.stringify(listLiteral.Code);
            //console.log(codeValue);

            arrayRunnerResult.push(codeValue);
          }
        }
        getRunnerResultCallback(arrayRunnerResult);
      } else {
        //console.log("entrou com status diferente 200 e 299");
        const error = "Error: " + response.status.toString() + " - " + response.statusText;
        getRunnerResultCallback([])
        getRunnerErrosCallback(error);
      }
    } catch (error) {
      //console.log("error");
      getRunnerErrosCallback("Error: ERR_EMPTY_RESPONSE");
    }
  }
  return(
    <div className={className}>
    <FormControl variant="outlined" fullWidth required>
      <InputLabel htmlFor="outlined-url">Pull Request URL</InputLabel>
      <OutlinedInput
        id="outlined"
        type="url"
        onChange={(event) => setPrUrl(event.target.value)}
        label="Pull Request URL"
        placeholder="https://github.com/google/guava/pull/6059"
      />
    </FormControl>
    <FormControl variant="outlined" fullWidth required>
      <InputLabel htmlFor="outlined-adornment-token">GitHub token</InputLabel>
        <OutlinedInput
          id="outlined-adornment-token"
          type={tokenValues.showToken ? 'text' : 'password'}
          value={tokenValues.token}
          onChange={handleChange('token')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle token visibility"
                onClick={handleClickShowToken}
                onMouseDown={handleMouseDownToken}
                edge="end"
              >
                {tokenValues.showToken ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="GitHub Token"
       />
      </FormControl>
    <Button
      fullWidth
      disableElevation
      type="submit"
      variant="contained"
      size="large"
      onClick={handleOnClick}
    >
    <PlayArrowIcon/>
      Run
    </Button>
    </div>
  )
}
