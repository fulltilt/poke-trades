import { Card, getCardsFromSet } from "~/server/queries";

export default function CardList({ params }: { params: { id: string } }) {
  async function Cards() {
    const cards = await getCardsFromSet(params.id);
    console.log(cards);
    return (
      <div className="m-12 flex justify-center">
        {/* <div className="text-lg">{params.name}</div> */}
        <div className="grid max-w-[1200px] gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cards?.data.map((card: Card) => (
            <div key={card.id}>
              <img
                src={card.images.small}
                alt={`${card.name}`}
                className="cursor-pointer transition-all duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Cards />
    </div>
  );
}
