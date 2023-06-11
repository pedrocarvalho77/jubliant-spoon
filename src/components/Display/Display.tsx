import Box from '@mui/material/Box';

interface DisplayProps{
    counter: number,
    runnerResult: string[],
    error: string
  }

export default function Display(props: DisplayProps){

    const {
        counter,
        runnerResult,
        error
      } = props
    
    function displayResult(){
      var arrayTest = [];
      if (runnerResult.length > 9){
        for (var i = 0; i < runnerResult.length ; i++) {
          if(i <= 8){
            arrayTest[0] = runnerResult.map( (item, index) => {
              if(index < 9){
                return <p> {counter + ": "}{item} </p>
              }
              index = index + 1;
            });
          }
          else {
            arrayTest[1] = runnerResult.map( (item, index) => {
              if(index >= 9){
                return <p> {counter + ": "}{item} </p>
              }
              index = index + 1;
            });
          }
        }
        return ( 
          <div className='result-content-2cols'>
            <div className='left-side'>
              {arrayTest[0]}
            </div>
            <div className='right-side'>
              {arrayTest[1]}
            </div>
        </div> 
        )
      } else {
        return <div className='result-content-1col'> {runnerResult.map( item => <p> {counter+": "}{item} </p>)} </div>
      }
    }

    function displayError(){
      return <p>{counter+": "}{error}</p>
    }
    return(
      <Box className="bottom-box" component="span">
        {runnerResult.length != 0
          ? displayResult()
          : displayError()
        }
      </Box> 
    )
}