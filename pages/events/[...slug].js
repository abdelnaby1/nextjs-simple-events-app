import { useRouter } from "next/router";
import useSwr from "swr";
import { Fragment, useEffect, useState } from "react";
import EventList from "../../components/events/EventList";
import { getFilteredEvents } from "../../helper/api-util";
// import { getFilteredEvents } from "../../dummy-data";

import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/Button";
import ErrorAlert from "../../components/events/error-alert";
import Head from "next/head";
const FilteredEventsPage = (props) => {
  const [events, setEvents] = useState(props.events);
  const router = useRouter();
  const filterdData = router.query.slug;

  const { data, error } = useSwr(
    "https://nextjs-events-73d50-default-rtdb.firebaseio.com/events.json"
  );
  useEffect(() => {
    if (data) {
      const events = [];
      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }
      setEvents(events);
    }
  }, [data]);
  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`All events for filtered events`} />
    </Head>
  );
  if (!events) {
    return (
      <>
        {pageHeadData}
        <p className="center">Loading...</p>
      </>
    );
  }
  const [filterdYear, filterdMonth] = filterdData;
  const numYear = +filterdYear;
  const numMonth = +filterdMonth;
  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${numMonth}/${numYear}`}
      />
    </Head>
  );
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">show All Events</Button>
        </div>
      </Fragment>
    );
  }
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  // const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">show All Events</Button>
        </div>
      </Fragment>
    );
  }
  const date = new Date(props.date.year, props.date.month - 1);
  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const filterdData = params.slug;
  const [filterdYear, filterdMonth] = filterdData;
  const numYear = +filterdYear;
  const numMonth = +filterdMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return {
      props: { hasError: true },
      // notFound: true,
      // redicret: {
      //   destination: "/error",
      // },
    };
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
