import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function UserRole(props) {
    return (
        <Card className="userRole">
        <Card.Body>
            <Card.Title className="userRole__title">{props.title}</Card.Title>
            {props.role.map((role, index) => (
                <Card.Text key={index} className="userRole__description">{role}</Card.Text>
            ))}
        </Card.Body>
        </Card>
    );
}

export default UserRole;