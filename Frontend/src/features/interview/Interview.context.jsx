import { createContext,useState } from "react";

export const InterviewContext=createContext()

export const InterviewProvider=({children})=>{
    const [loading,setLoading]=useState(false)
    const [report,setReport]=useState(null)
    const [reports,setReports]=useState(null)
    const [error,setError]=useState(null)
    return (
        <InterviewContext.Provider value={{loading,setLoading,report,setReport,error,setError,reports,setReports}}>
            {children}
        </InterviewContext.Provider>
    )
}