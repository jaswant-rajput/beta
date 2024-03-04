
import { useNavigate,useLocation } from "react-router-dom"
import { useEffect,useState } from "react"
import { getLesson } from "../actions/lessonAction"
import { Button } from "@mui/material"
import { userCompleteLesson } from "../actions/userActions"
import { useAuthStore } from "../store/store"
const LessonPage = () => {

    const user = useAuthStore.getState().user
    const navigate = useNavigate()
    const location = useLocation().state
    const [lessonData,setLessonData] = useState(null)
    const setStateUser = useAuthStore(state=>state.setUser)
    const isLessonCompleted = user?.data?.lessonsCompleted.some((lessonData)=>
    lessonData.lessonName === location.lesson
    )
    
    useEffect(()=>{
        const fetchLesson = async() => {
            const response = await getLesson(location.lesson)
            console.log(response)
            setLessonData(response.lessonPost)
        }
        fetchLesson()
    },[])
    
    const lessonComplete = async () => {
        const response = await userCompleteLesson({lessonName : lessonData.lesson, id : user.token, lessonId:lessonData._id})
        localStorage.setItem("userData", JSON.stringify( {...user, data: response.userObject } ));
        setStateUser( {...user, data: response.userObject })
        navigate(`/courses/${location.course}`)
    }

    return (
        <>
            <Button variant="contained" onClick={lessonComplete} disabled={isLessonCompleted}> Lesson Completed </Button>
            <div dangerouslySetInnerHTML={{ __html: lessonData?.htmlContent }} />
        </>
    )
}

export default LessonPage