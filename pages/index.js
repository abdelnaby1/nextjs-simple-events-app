import Head from "next/head";
import Link from "next/link";
import EventList from "../components/events/EventList";
import { getFeaturedEvents } from "../helper/api-util";
// import { getFeaturedEvents } from "../dummy-data";
import NewsletterRegistration from "../components/input/newsletter-registration";

const HomePage = (props) => {
  return (
    <div>
      <Head>
        <title>NextJs events</title>
        <meta
          name="description"
          content="find a lot of great events that allow you to evolov...."
        />
      </Head>
      <NewsletterRegistration />
      <EventList items={props.events} />
    </div>
  );
};

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();
  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 30,
  };
}
export default HomePage;
