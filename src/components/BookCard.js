import { Card, Button } from 'react-bootstrap';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

function BookCard(props) {

  console.log(props.isFavorite);
  return (
    <Card className="custom-card">
      <div className="heart-container" onClick={() => props.setFavouriteItem(props.card.id)}>
        <div className="heart-icon" style={{ color: props.isFavorite ? 'red' : 'gray' }} >
          {props.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
        </div>
      </div>

      <Card.Img variant="top" src={`${process.env.REACT_APP_IMAGES}${props.card.imgurl}`} className="book-img" />

      <Card.Body>
        <Card.Title>{props.card.title}</Card.Title>
        <Card.Text>{props.card.text}</Card.Text>
        <h4 className="mb-3">{props.card.price} грн</h4>
        <div className="d-grid gap-2">
          <Button 
            variant="outline-dark" 
            onClick={() => props.onShowDetails(props.card.title)}
            style={{ borderRadius: '8px', borderWidth: '1.5px' }}
          >
            Деталі
          </Button>
          <Button 
            variant="dark" 
            onClick={() => props.onAddToBusket(props.card)}
            style={{ borderRadius: '8px', backgroundColor: '#212529' }}
          >
            До кошика
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default BookCard;