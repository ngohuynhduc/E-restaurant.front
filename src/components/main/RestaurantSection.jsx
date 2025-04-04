export const RestaurantSection = () => {
  return (
    <section className="container mx-auto py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative w-full h-[300px] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.8))] flex flex-col justify-center items-center p-[100px]">
            <h2 className="revolution text-white text-[72px] mb-4">Restaurant 1</h2>
            <p className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor, orci nec
              lacinia.
            </p>
          </div>
        </div>
        <div className="relative w-full h-[300px] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.8))] flex flex-col justify-center items-center p-[100px]">
            <h2 className="revolution text-white text-[72px] mb-4">Restaurant 2</h2>
            <p className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor, orci nec
              lacinia.
            </p>
          </div>
        </div>
        <div className="relative w-full h-[300px] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.8))] flex flex-col justify-center items-center p-[100px]">
            <h2 className="revolution text-white text-[72px] mb-4">Restaurant 3</h2>
            <p className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor, orci nec
              lacinia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
