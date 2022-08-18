import EventList from "../../components/events/EventList";
import EventSearch from "../../components/events/EventSearch";
import { getAllEvents } from "../../helper/api-util";
// import { getAllEvents } from "../../dummy-data";

import { useRouter } from "next/router";
import Head from "next/head";
const EventsPage = (props) => {
  const events = props.events;
  const router = useRouter();
  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }
  return (
    <>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="find a lot of great events that allow you to evolov...."
        />
      </Head>
      <EventSearch onSearch={findEventsHandler} />
      <EventList items={events} />;
    </>
  );
};

export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: {
      events: events,
    },
    revalidate: 60,
  };
}
export default EventsPage;
