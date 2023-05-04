import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';

function SessionDurationStats(props) {
    return (
        <div className="sessionDurationStats">
            <p className="sessionKey">{props.sessionKey}</p>
            <p className="sessionDuration">{props.sessionDuration}</p>
        </div>
    );
}

export default SessionDurationStats;