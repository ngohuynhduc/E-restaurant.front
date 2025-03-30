import { RestaurantSection } from "@/components/main/RestaurantSection";
import { TopBanner } from "@/components/main/TopBanner";

export default async function Home() {
  return (
    <main>
      <TopBanner />
      <RestaurantSection />
    </main>
  );
}
