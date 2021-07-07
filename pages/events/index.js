import { Fragment } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import EventList from "../../components/events/event-list";
import EventsSearch from "../../components/events/events-search";

import { getAllEvents } from "../../helpers/api-utils";

const AllEventsPage = ({ events }) => {
  const router = useRouter();

  const searchHandler = (year, month) => {
    router.push(`/events/${year}/${month}`);
  };

  return (
    <Fragment>
      <Head>
        <title>NextEvents | All events</title>
        <meta
          name="description"
          content="Find about all events that help you evolve..."
        />
      </Head>
      <EventsSearch onSearch={searchHandler} />
      <EventList items={events} />
    </Fragment>
  );
};

export async function getStaticProps() {
  const events = await getAllEvents();

  return {
    props: {
      events: events,
    },
    revalidate: 600,
  };
}

export default AllEventsPage;
