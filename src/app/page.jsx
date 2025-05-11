import Contract from "@/components/main/Contact";
import SuggestRestaurants from "@/components/main/SuggestRestaurants";
import { TopBanner } from "@/components/main/TopBanner";

export default async function Home() {
  return (
    <main>
      <TopBanner />
      <SuggestRestaurants title="Nhà hàng gần bạn" />
      <SuggestRestaurants title="Mới nhất" />
      <SuggestRestaurants title="Nhà hàng hot!" />
      <Contract />
    </main>
  );
}
