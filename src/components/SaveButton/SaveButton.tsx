import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
interface SaveButtonProps {
    className: string,
    textToDownload: string
}

export default function SaveButton(props: SaveButtonProps) {
  
    const {
        className,
        textToDownload,
    } = props

    const downloadFile = () => {
        const element = document.createElement("a");
        const file = new Blob([textToDownload],{type:"text/plain"});
        element.href = URL.createObjectURL(file);
        element.download = "myrevy.yml";
        document.body.appendChild(element);
        element.click()
    }
    
    return (
    <Button className={className} size="small" variant="contained" component="span" startIcon={<SaveIcon/>} onClick={downloadFile}>
        Save
    </Button>
  )
}
