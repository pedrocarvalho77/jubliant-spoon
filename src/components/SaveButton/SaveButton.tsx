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
        const url = URL.createObjectURL(file);
        element.href = url;
        element.download = "config.yml";
        document.body.appendChild(element);
        element.click();
        element.remove();
        URL.revokeObjectURL(url);
    }
    
    return (
    <Button className={className} size="small" variant="outlined" startIcon={<SaveIcon/>} onClick={downloadFile}>
        Save
    </Button>
  )
}
