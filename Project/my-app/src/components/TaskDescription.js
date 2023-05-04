import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function TaskDescription(props) {

    const [locked, setLocked] = useState(props.isLocked);

    function taskLocked (){
        if (locked){
            return (
                <>
                    <Card.Img className="taskDescription__img" src={props.img}/>
                    <Button>Go</Button>
                </>
            )
        }
        else {
            return (
                <>
                    <Button>Go</Button>
                </>
            )
        }
    }

    return (
        <Card className="taskDescription">
        <Card.Body>
            <div class="grid-container">
                <div class="grid-item__title">
                    <Card.Title className="taskDescription__title">{props.title}</Card.Title>
                </div>
                <div class="grid-item__description">
                    <Card.Text className="taskDescription__description">{props.description}</Card.Text>
                </div>
                <div class="grid-item__language">
                    <Card.Text className="taskDescription__languages">{props.languages}</Card.Text>
                </div>
                <div class="grid-item__button">
                    {taskLocked()}
                </div>  
           </div>
        </Card.Body>
        </Card>
    );
}

export default TaskDescription;