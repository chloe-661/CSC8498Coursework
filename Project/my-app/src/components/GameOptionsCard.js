import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function GameOptionsCard(props) {
  return (
    <Card className={props.className}>
      <Card.Img variant="top" src={props.img}/>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Title className="bigNumber">{props.number}</Card.Title>
        <Card.Title className="bigSessionKey">{props.sessKey}</Card.Title>
        <Card.Text className="tinyText">{props.tinyText}</Card.Text>
        <Card.Text>
          {props.text}
        </Card.Text>
        {props.children}
      </Card.Body>
    </Card>
  );
}

export default GameOptionsCard;