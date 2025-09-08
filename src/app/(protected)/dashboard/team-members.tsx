'use-client'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
const TeamMember=()=>{
    const {projectId}=useProject()
    const {data:members}=api.project.getTeamMembers.useQuery({projectId})
    return (
        <div className='flex items-center gap-2'>
            {members?.map((m)=>(
                <img key={m.id} src={m.user.imageUrl || ''} alt={m.user.firstName || ''} className="rounded-full"height={30} width={30}></img>
            ))}
        </div>
    )
}
export default TeamMember