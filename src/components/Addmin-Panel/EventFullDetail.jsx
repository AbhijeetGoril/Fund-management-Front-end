import { useParams } from 'react-router-dom';

const EventFullDetail = () => {
  const { id } = useParams();
  console.log(id)
  return (
    <div>EventFullDetail</div>
  )
}

export default EventFullDetail