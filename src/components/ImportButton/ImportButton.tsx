import { SyntheticEvent } from "react";
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface ImportButtonProps{
  name?: string,
  getTextFromFileCallback: (value:any) => void
}

const Input = styled('input')({
  display: 'none',
});

export default function ImportButton(props: ImportButtonProps) {

    const {
      getTextFromFileCallback,
    } = props

    const onChange = (e : SyntheticEvent ) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      file.text().then(getTextFromFileCallback);
      input.value = ""; // allow re-importing the same file
    }

    return (
      <label>
        <Input accept=".yml,.yaml" id="contained-button-file" type="file" onChange={onChange}/>
        <Button className="upload-button" size="small" variant="outlined" component="span" startIcon={<UploadFileIcon/>}>
          Upload
        </Button>
      </label>
    ) 
}