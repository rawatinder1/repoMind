import {string, z} from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
import { sendMail } from "@/lib/mailer";
const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ctx, input}) => {
        if (!ctx.user.userId) {
            throw new Error("User ID is required");
        }

       
        const dbUser = await ctx.db.user.findUnique({
            where: {
                clerkId: ctx.user.userId 
            }
        });

        if (!dbUser) {
            throw new Error("User not found in database");
        }

        const project = await ctx.db.project.create({
            data: {
                githubUrl: input.githubUrl,
                name: input.name,
                userProjects: {
                    create: {
                        userId: dbUser.id 
                    }
                }
            }
        });
        
        await pollCommits(project.id,input.githubToken);
        await indexGithubRepo(project.id,input.githubUrl,input.githubToken);
        
        return project;
    }),
    getProjects:protectedProcedure.query(async ({ctx}) => {
        if (!ctx.user.userId) {
            throw new Error("User ID is required");
        }

        
        const dbUser = await ctx.db.user.findUnique({
            where: {
                clerkId: ctx.user.userId 
            }
        });

        if (!dbUser) {
            throw new Error("User not found in database");
        }
        return await ctx.db.project.findMany({
            where : {
                userProjects:{
                    some: {
                        userId: dbUser.id
                    }
                },
                deletedAt:null
            },
            
        })
    }),
        getCommits:protectedProcedure.input(z.object({
            projectId:z.string()
        })).query(async ({ctx,input}) => {
            pollCommits(input.projectId).then().catch(console.error);
            return await ctx.db.commit.findMany({
                where:{projectId:input.projectId}
            })
        }),

        saveAnswer: protectedProcedure.input(
            z.object({
                projectId: z.string(),
                question: z.string(),
                answer: z.string(),
                fileReferences: z.any()
            })
            ).mutation(async ({ctx, input}) => {
                if (!ctx.user.userId) {
                    throw new Error("User ID is required");
                }

                
                const dbUser = await ctx.db.user.findUnique({
                    where: {
                        clerkId: ctx.user.userId 
                    }
                });
                console.log("Saving answer for user:", dbUser);

                if (!dbUser) {
                    throw new Error("User not found in database");
                }

                return await ctx.db.question.create({
                    data: {
                        answer: input.answer,
                        fileReference: input.fileReferences,
                        projectId: input.projectId,
                        question: input.question,
                        userId: dbUser.id 
                    }
                }).catch((err) => {
                    console.error("Error saving answer:", err);
                    throw err;
                });
        }),
        getQuestions:protectedProcedure.input(z.object({
            projectId:z.string()
        })).query(async ({ctx,input}) => {
            return await ctx.db.question.findMany({
                where:{
                    projectId:input.projectId
                },
                include:{
                    user:true
                },
                orderBy:{
                    createdAt:'desc'
                }
            })
        }),
        deleteQuestion:protectedProcedure.input(z.object({
            questionId:z.string()
        })).mutation(async ({ctx,input}) => {
            return await ctx.db.question.delete({
                where:{
                    id:input.questionId
                }
            })
        }),
        archiveProject:protectedProcedure.input(z.object({projectId:z.string()})).mutation(async ({ctx,input})=>{
            return await ctx.db.project.update({where:{id:input.projectId},data:{deletedAt:new Date()}});
        }),
        getTeamMembers:protectedProcedure.input(z.object({projectId:z.string()})).query(async ({ctx,input})=>{
            return await ctx.db.userToProject.findMany({where:{projectId:input.projectId},include:{user:true}})
        }),
       sendEmail: protectedProcedure
  .input(z.object({
    to: z.string(),
    projectId: z.string(),
    projectLink: z.string()
  }))
  .mutation(async ({ ctx, input }) => {
    if (!ctx.user.userId) {
      throw new Error("User ID is required");
    }

    try {
      // Single query to get both user and project
      const [dbUser, project] = await Promise.all([
        ctx.db.user.findUnique({
          where: {
            clerkId: ctx.user.userId
          }
        }),
        ctx.db.project.findUnique({
          where: {
            id: input.projectId,
          }
        })
      ]);

      if (!dbUser) {
        throw new Error("User not found");
      }

      if (!project) {
        throw new Error("Project not found");
      }

      const senderName = `${dbUser.firstName || ""} ${dbUser.lastName || ""}`.trim() || "A colleague";

      await sendMail({
        to: input.to,
        senderName,
        projectName: project.name || "Untitled Project",
        projectlink: input.projectLink,
      });

      return { success: true };

    } catch (error) {
      console.error("Send email error:", error);
      throw new Error("Failed to send invitation email");
    }
  })

    });
    
export {projectRouter}