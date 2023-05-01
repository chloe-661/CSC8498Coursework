import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function GameOptionsCard(props) {
  return (
    <Card>
      <Card.Img variant="top" src={props.img} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.text}
        </Card.Text>
        {props.children}
      </Card.Body>
    </Card>
  );
}

export default GameOptionsCard;