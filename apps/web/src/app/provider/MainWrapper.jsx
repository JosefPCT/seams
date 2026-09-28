import { Outlet } from "react-router";

export default function MainWrapper(){
  return(
    <div>
        <span>Main Wrapper</span>
        <Outlet />
    </div>
  )
}