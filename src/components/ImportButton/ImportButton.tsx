import { SyntheticEvent } from "react";
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface ImportButtonProps{
  name: string,
  getTextFromFileCallback: (value:any) => void
}

const Input = styled('input')({
  display: 'none',
});

export default function ImportButton(props: ImportButtonProps) {

    let fileReader: FileReader; 
    const {
      name,
      getTextFromFileCallback,
    } = props

    const onChange = (e : SyntheticEvent ) => {
      const file = (e.target as HTMLInputElement).files![0];
      fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onloadend = () => { getTextFromFileCallback(fileReader.result) }
    }

    return (
      <label>
        <Input accept="yml/*" id="contained-button-file" multiple type="file" onChange={onChange}/>
        <Button className="upload-button" size="small" variant="contained" component="span" startIcon={<UploadFileIcon/>}>
          Upload
        </Button>
      </label>
    ) 
}