import { Fragment } from "react";
import Head from "next/head";

import ResultsTitle from "../../components/events/results-title";
import EventList from "../../components/events/event-list";
import ErrorAlert from "../../components/ui/error-alert";
import Button from "../../components/ui/button";

import { getFilteredEvents } from "../../helpers/api-utils";

const FilteredEventsPage = (props) => {
  if (props.hasError) {
    return (
      <Fragment>
        <ErrorAlert>Invalid filter values! Please re-adjust them.</ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          No events found for chosen year or month values!
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>
      <Head>
        <title>Filtered Events | NextEvents</title>
        <meta
          name="description"
          content={`All events for ${props.date.month}/${props.date.year}`}
        />
      </Head>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const filterData = params.slug;

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];
  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear < 2021 ||
    numYear > 2030 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return { props: { hasError: true } };
  }

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  return {
    props: {
      events: filteredEvents,
      date: {
        year: numYear,
        month: numMonth,
      },
    },
  };
}

export default FilteredEventsPage;
