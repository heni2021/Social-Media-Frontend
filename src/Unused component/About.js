import { Box, Divider } from '@mui/material'
import PhotoItem from './PhotoItem'

const About = () => {
  return (
    <>
      <div className="container text-center">
        <Box
          className='text-center'
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            border: '1px solid #000', // Add border styling
            borderRadius: '10px',     // Add border radius for rounded corners
            padding: '20px',          // Add padding for space inside the box
          }}
          noValidate
          autoComplete="off"
        >
        <h1 style={{fontSize: 50}}> Our Team </h1>
        </Box>
        <br />
        <Divider></Divider>
        <br />
        <h2>Our Mentors</h2>
        <PhotoItem altText=""
          imgLink={""}
          linkedInLink=""
          githubLink=""
          leetcodeLink=""
        /> &nbsp;
        <PhotoItem altText=""
          imgLink={""}
          linkedInLink=""
          githubLink=""
          leetcodeLink=""
        /> &nbsp;
        <PhotoItem altText=""
          imgLink={""}
          linkedInLink=""
          githubLink=""
          leetcodeLink=""
        /> &nbsp;
        <br />
        <Divider />
        <br></br>
        <h2> Our Developers</h2>
        <PhotoItem altText=""
          imgLink={""}
          linkedInLink=""
          githubLink=""
          leetcodeLink="" 
        /> &nbsp;
        <PhotoItem altText=""
          imgLink={""}
          linkedInLink=""
          githubLink=""
          leetcodeLink="" 
        /> &nbsp;
        <PhotoItem altText=""
          imgLink={""}
          linkedInLink=""
          githubLink=""
          leetcodeLink="" 
        /> &nbsp;
      </div>
    </>
  )
}

export default About
