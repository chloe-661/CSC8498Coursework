import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { 
    getTaskSet, //Gets the info for a task set but NOT the tasks within it
} from "../firebase";

function SessionStats(props) {

    useEffect(() => {
        tasksLeft();
        tasksCompleted();
    })

    function tasksLeft(){
        let tasksLeft;
        props.taskDetails.forEach(t => {
            if (!t.completed){
                tasksLeft++;
            }
        });
        return tasksLeft;
    }

    function tasksCompleted(){
        console.log("tasksCompleted");
        let tasksCompleted;
        props.taskDetails.forEach(t => {
            if (t.completed){
                tasksCompleted++;
            }
        });
        return tasksCompleted;
    }

    function getSenarioDescription(){
        // const request = getTaskSet(props.sessionDetails.taskSetId);
        // return request.senarioDescription;
    }

    return (
        <Card className="sessionStats">
        <Card.Body>
            <Card.Title className="sessionStats__title">{props.title}</Card.Title>
            <p className="sessionStats__description">Aim: &nbsp;
                <span class="greenText">{getSenarioDescription()}</span>
            </p>
            
            <p className="sessionStats__description">Tasks Completed: &nbsp;
                <span class="greenText"></span>
            </p>

            <p className="sessionStats__description">Tasks Left To Do: &nbsp;
                <span class="greenText"></span>
            </p>    

            <p className="sessionStats__description">Total Tasks: &nbsp;
                <span class="greenText">{props.taskDetails.length}</span>
            </p>    

            <p className="sessionStats__description">People in the session: &nbsp;
                <span class="greenText">{props.sessionPeople}</span>
            </p>                
        </Card.Body>
        </Card>
    );
}

export default SessionStats;