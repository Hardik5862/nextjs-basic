import { Fragment } from "react";
import { useRouter } from "next/router";

import EventList from "../../components/events/event-list";
import EventsSearch from "../../components/events/events-search";

import { getAllEvents } from "../../dummy-data";

const AllEventsPage = () => {
  const events = getAllEvents();
  const router = useRouter();

  const searchHandler = (year, month) => {
    router.push(`/events/${year}/${month}`);
  };

  return (
    <Fragment>
      <EventsSearch onSearch={searchHandler} />
      <EventList items={events} />
    </Fragment>
  );
};

export default AllEventsPage;
