import { FofanPortfolio } from "@/components/FofanPortfolio";
import { getPublishedWorks } from "@/lib/works";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const works = await getPublishedWorks();

  return <FofanPortfolio initialWorks={works} />;
}
