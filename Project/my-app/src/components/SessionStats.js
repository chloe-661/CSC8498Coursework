import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { 
    getTaskSet, //Gets the info for a task set but NOT the tasks within it
} from "../firebase";

function SessionStats(props) {
    
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [tasksLeft, setTasksLeft] = useState(0);

    useEffect(() => {
        getTasksLeft();
        getTasksCompleted();
    })

    function getTasksLeft(){
        let left = 0;
        props.taskDetails.forEach(t => {
            if (!t.completed){
                left++;
            }
        });
        setTasksLeft(left);
    }

    function getTasksCompleted(){
        let completed = 0;
        props.taskDetails.forEach(t => {
            if (t.completed){
                completed++;
            }
        });
        setTasksCompleted(completed);
    }


    return (
        <>
            <Card className="sessionStats">
            <Card.Body>
                <Card.Title className="sessionStats__title">{props.title}</Card.Title>
                <p className="sessionStats__description">Aim: &nbsp;
                    <span class="greenText">{props.senario}</span>
                </p>
                
                <p className="sessionStats__description">Tasks Completed: &nbsp;
                    <span class="greenText">{tasksCompleted}</span>
                </p>

                <p className="sessionStats__description">Tasks Left To Do: &nbsp;
                    <span class="greenText">{tasksLeft}</span>
                </p>    

                <p className="sessionStats__description">Total Tasks: &nbsp;
                    <span class="greenText">{props.taskDetails.length}</span>
                </p>    

                <p className="sessionStats__description">People in the session: &nbsp;
                    <span class="greenText">{props.sessionPeople}</span>
                </p>                
            </Card.Body>
            </Card>
        </>
        
    );
}

export default SessionStats;