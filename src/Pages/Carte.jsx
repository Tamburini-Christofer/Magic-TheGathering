import Filter from "../Components/FIlter";
import Cards from "../Components/Cards";

const Carte = () => {
  return (
  <>
    <div className="contenitoreCard">
      <div className="contenitoreCardSx">
        <Filter />
      </div>
      <div className="contenitoreCardDx">
        <div className="cardsContainer">       
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
        </div>
        
      </div>
    </div>
  </>
  )
};
export default Carte;