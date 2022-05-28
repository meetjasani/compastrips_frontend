import { Switch } from 'react-router'
import Pages from "../pages";

const Routes = () => {

  return (
    <Switch>
      {/* <Route path="/error" component={Error} /> */}
      {/* <Layout> */}
      <Pages />
      {/* </Layout> */}
    </Switch>
  )
}

export default Routes

