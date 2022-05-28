import React, { useEffect } from 'react'
import { Route, Switch, useHistory, Redirect } from 'react-router'
import Dashboard from './dashboard/Dashboard'
import Layout from '../layout/Layout'
import Event from './singleEvent/Event'
import HostMyOwn from './hostmyown/HostMyOwn'
import ViewHost from './viewhost/ViewHost'
import ItineraryDetails from './singleEvent/ItineraryDetails'
import MyWishListPage from './user/MyWishlistPage'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
import MyHostingPage from './user/MyHostingPage'
import AppliedHostingPage from './user/AppliedHostingPage'
import InquirtPage from './inquiry/InquirtPage'
import CustomerService from './customer-service/CustomerService'

const Index = () => {

    return (
        <>
            <Switch>
                {/* <RouteWrapper exact={true} path="/" component={Login} layout={Layout} isPrivateRoute={false} /> */}
                <RouteWrapper
                    exact={true}
                    path="/"
                    component={Dashboard}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                {/* <RouteWrapper exact={true} path="/event" component={Event} layout={Layout} isPrivateRoute={true} /> */}
                <RouteWrapper
                    exact={true}
                    path="/itinerary"
                    component={ItineraryDetails}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/hostitinerary"
                    component={HostMyOwn} layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/viewhost"
                    component={ViewHost}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/wishlist"
                    component={MyWishListPage}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/profile"
                    component={Profile}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/edit-profile"
                    component={EditProfile}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/myhosting"
                    component={MyHostingPage}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/appliedhosting"
                    component={AppliedHostingPage}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/inquirtPage"
                    component={InquirtPage}
                    layout={Layout}
                    isPrivateRoute={true}
                />
                <RouteWrapper
                    exact={true}
                    path="/customerService"
                    component={CustomerService}
                    layout={Layout}
                    isPrivateRoute={true}
                />
            </Switch>
        </>
    )
}

export default Index


interface RouteWrapperProps {
    component: any;
    layout: any;
    exact: boolean;
    path: string;
    isPrivateRoute: boolean;
}

function RouteWrapper({
    component: Component,
    layout: Layout,
    isPrivateRoute,
    ...rest
}: RouteWrapperProps) {


    return (
        <>
            <Route {...rest} render={(props) =>
                <Layout>

                    <Component {...props} />

                </Layout>
            } />
        </>
    );
}
