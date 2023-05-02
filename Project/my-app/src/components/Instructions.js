import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Instructions(props) {
  return (
    <Card className="instruction-panel">
      <Card.Body>
        {props.children}
      </Card.Body>
    </Card>
  );
}

export default Instructions;