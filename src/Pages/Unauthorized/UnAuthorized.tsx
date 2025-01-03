import { useAppSelector } from "../../Redux/hooks/hooks"


export default function UnAuthorized() {
         useAppSelector((state) => state.auth);
    // console.log(appSeleted)
  return (
    <div>UnAuthorized</div>
  )
}
