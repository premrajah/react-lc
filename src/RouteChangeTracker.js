import React from 'react'
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

const RouteChangeTracker = ({ history }) => {
    console.log("Tracker: Route Change : " + history);

    history.listen((location, action) => {
        console.log("Tracker: Route Change : " + location.pathname);
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });

    return <div></div>;
};

export default withRouter(RouteChangeTracker);