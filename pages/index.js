import Head from "next/head";

import { getFeaturedEvents } from "../helpers/api-utils";
import EventList from "../components/events/event-list";

function Home({ featuredEvents }) {
  return (
    <div>
      <Head>
        <title>NextEvents</title>
        <meta
          name="description"
          content="Find about events that help you evolve..."
        />
      </Head>
      <EventList items={featuredEvents} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      featuredEvents: featuredEvents,
    },
    revalidate: 3600,
  };
}

export default Home;
