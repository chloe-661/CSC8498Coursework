import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function TaskDescription(props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        checkRole();
    })

    function checkRole() {
        let show = false;
        props.userDetails.role.forEach(r => {
            if (r == props.role){
                show = true;
            }
        });

        if (show){
            setVisible(true);
        }
        else {
            setVisible(false);
        }
    }

    const getTaskDependanciesNames = async () => {
        
    }

    function taskLocked (){
        if (props.completed){
            return (
                <>
                    <Button disabled={true} className="taskDone__btn">Done</Button>
                </>
            )
        }
        else if (props.inUse){
            return (
                <>
                    <Button className="locked-btn" onClick={() => props.onShow("use", [])}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-lock-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                    </Button>
                </>
            )
        }
        else if (props.isLockedByDependancies){
            return (
                <>
                    <Button className="locked-btn" onClick={() => props.onShow("dep", props.taskDependancies)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-lock-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                    </Button>
                </>
            )
        }
        else {
            return (
                <>
                    <Button onClick={() => props.onOpenTask(props.taskId)}>Go</Button>
                </>
            )
        }
    }

    return (
        <>
            <Card className= {"taskDescription " + (visible ? 'visible' : 'd-none')}>
            <Card.Body>
                <div className="grid-container">
                    <div className="grid-item__title">
                        <Card.Title className="taskDescription__title">{props.title}</Card.Title>
                    </div>
                    <div className="grid-item__description">
                        <Card.Text className="taskDescription__description">{props.description}</Card.Text>
                    </div>
                    <div className="grid-item__language">
                        <Card.Text className="taskDescription__languages">{props.languages}</Card.Text>
                    </div>
                    <div className="grid-item__button">
                        {taskLocked()}
                    </div>  
            </div>
            </Card.Body>
            </Card>
        </>
        
    );
}

export default TaskDescription;