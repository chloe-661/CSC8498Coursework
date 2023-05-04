import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function SessionStats(props) {
    return (
        <Card className="sessionStats">
        <Card.Body>
            <Card.Title className="sessionStats__title">{props.title}</Card.Title>
            <Card.Text className="sessionStats__description">{props.description}</Card.Text>
        </Card.Body>
        </Card>
    );
}

export default SessionStats;