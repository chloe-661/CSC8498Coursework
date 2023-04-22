import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MiniGameDisplayCard(props) {

  const cardStyles = {
    width: '18rem', 
    color: 'black', 
    display: 'inline-block', 
    margin: '1rem',
  }

  return (
    <Card style={cardStyles}>
      <Card.Img variant="top" src={props.src} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.text}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default MiniGameDisplayCard;