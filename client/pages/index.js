import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Hi</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    const { data } = await axios.get(
      'http://ingress-nginx-load.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev',
        },
      }
    );

    return data;
  } else {
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }

  return {};
};

export default LandingPage;
