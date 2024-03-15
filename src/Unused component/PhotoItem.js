import { Avatar } from '@mui/material'
import React from 'react'
import linkedin from '../Photos/linkedin.png'
import github from '../Photos/github.png'
import leetcode from '../Photos/leetcode.jpeg'

const DeveloperPhotos = (props) => {
    return (
        <div className="developer-photo-container">
            <div className='developer-photo'>
                <Avatar
                    alt={props.altText}
                    src={props.imgLink}
                    style={{ width: '300px', height: '300px' }}
                />
                
                <div className="developer-links">
                    <a href={props.linkedInLink} target="_blank" rel="noreferrer noopener" >
                        <img src={linkedin} alt="LinkedIn" style={{width: "30px" ,height: "30px"}} /> LinkedIn
                    </a>
                    <a href={props.githubLink} target="_blank" rel="noreferrer noopener">
                        <img src={github} alt="Github" style={{ width: "30px", height: "30px" }} />&nbsp;  GitHub
                    </a>
                    <a href={props.leetcodeLink} target="_blank" rel="noreferrer noopener">
                        <img src={leetcode} alt="LeetCode" style={{ width: "30px", height: "30px" }} /> LeetCode
                    </a>
                </div>
            </div>
        </div>
    )
}

export default DeveloperPhotos
