import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';

function Answers(props) {
    return (
        <>
            <Card className="answers">
            <Card.Body>
                <Card.Title>Put your answers here:</Card.Title>
            </Card.Body>
            </Card>
        </>

    );
}

export default Answers;