import * as React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import './style/index.scss';

type AppProps = React.PropsWithChildren<React.ReactElement>;

const App:React.FC<AppProps> = props => {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}

export default App
