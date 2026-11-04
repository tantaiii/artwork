import React from 'react'
import {Link} from 'react-router-dom'
import '../../css/AppLogo.css'
export default function AppLogo() {
  return (
    <Link to={'/characters'}>
      <img style={{cursor:'pointer'}} className='app-logo' src = "/sliderImages/icon_demo.png" alt="App Icon" />
    </Link>
    
  )
}
export function Watermark(){
  return(
  <img className='watermark' src = "/sliderImages/icon_demo.png" alt="App Icon" />
  )
}
