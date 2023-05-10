import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function TaskDashboardStats(props) {
    return (
        <Card className="taskDashboardStats">
        <Card.Body>
            <Card.Title class={props.extraClass}>{props.title}</Card.Title>
            <Card.Text>{props.description}</Card.Text>
        </Card.Body>
        </Card>
    );
}

export default TaskDashboardStats;