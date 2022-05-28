import './App.css';
import Routes from './router/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import AuthStorage from './helper/AuthStorage';
import { getUserData } from './redux/action/userDataAction';
import { changeLoginState } from './redux/action/loginAction';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    if (AuthStorage.getToken()) {
      dispatch(changeLoginState(true))
      dispatch(getUserData())
    } else {
      dispatch(changeLoginState(false))
    }
  }, [window?.location])

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
