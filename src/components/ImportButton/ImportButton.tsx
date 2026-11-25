import { SyntheticEvent, useRef } from "react";
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

    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = (e : SyntheticEvent ) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      file.text().then(getTextFromFileCallback);
      input.value = ""; // allow re-importing the same file
    }

    return (
      <>
        <Input ref={inputRef} accept=".yml,.yaml" type="file" tabIndex={-1} aria-hidden="true" onChange={onChange}/>
        <Button className="upload-button" size="small" variant="outlined" startIcon={<UploadFileIcon/>} onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
      </>
    )
}
