import next from "next";
import {SignUp} from '@clerk/nextjs';
export default function Page(){
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <SignUp />
        </div>
    )
 
}