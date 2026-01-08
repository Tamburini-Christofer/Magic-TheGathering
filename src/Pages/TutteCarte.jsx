import Filter from "../Components/FIlter";
import Card from "../Components/Card";

const Carte = () => {
  return (
  <>
    <div className="contenitoreCard">
      <div className="contenitoreCardSx">
        <Filter />
      </div>
      <div className="contenitoreCardDx">
        <div className="cardsContainer">       
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
        
      </div>
    </div>
  </>
  )
};
export default Carte;