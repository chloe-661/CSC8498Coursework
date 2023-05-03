import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function GameOptionsCard(props) {
  return (
    <Card className={props.className}>
      <Card.Img variant="top" src={props.img}/>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.topLine}</Card.Text>
        <Card.Text className="bigNumber">{props.bigNumber}</Card.Text>
        <Card.Text className="bigText bigSessionKey">{props.bigText}</Card.Text>
        <Card.Text className="tinyText">{props.tinyText}</Card.Text>
        <Card.Text>{props.bottomLine}</Card.Text>
        <Card.Text>{props.text}</Card.Text>
        {props.children}
      </Card.Body>
    </Card>
  );
}

export default GameOptionsCard;