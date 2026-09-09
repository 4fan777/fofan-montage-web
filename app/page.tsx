import { FofanPortfolio } from "@/components/FofanPortfolio";
import { getPublishedWorks } from "@/lib/works";

export const revalidate = 60;

export default async function Home() {
  const works = await getPublishedWorks();

  return <FofanPortfolio initialWorks={works} />;
}
