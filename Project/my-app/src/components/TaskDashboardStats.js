import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { 
    getTaskLongDescription
  } from "../taskLongDescriptions";

function TaskDashboardStats(props) {
    let description = [""];


    function splitDescription(){
        console.log(props.originalTaskId);
        if (props.originalTaskId != null){
            const test = getTaskLongDescription(props.originalTaskId);
            // description = props.description.toString().split(/\n/);
            if (test != null){
                description = test.toString().split(/\n/);
            }
            console.log(description);
        }
    }

    return (
        <Card className="taskDashboardStats">
        <Card.Body>
            <Card.Title class={props.extraClass}>{props.title}</Card.Title>
            <Card.Text>
                {splitDescription()}
                {description.map(line => (<p>{line}</p>))}
                {props.description}
            </Card.Text>
        </Card.Body>
        </Card>
    );
}

export default TaskDashboardStats;