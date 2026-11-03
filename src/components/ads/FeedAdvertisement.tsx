import Ad from "@/components/common/Ad";
import type { Advertisement } from "@/types/ad";

interface FeedAdvertisementProps {
  advertisement: Advertisement;
}

const FeedAdvertisement = ({
  advertisement,
}: FeedAdvertisementProps) => {
  return (
    <div className="block lg:hidden">
      <Ad
        ad={advertisement}
        size="lg"
      />
    </div>
  );
};

export default FeedAdvertisement;