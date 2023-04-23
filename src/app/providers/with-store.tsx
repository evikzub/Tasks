import { Provider } from 'react-redux';
import { store } from '../store';

export const withStore = (component: () => React.ReactNode) => () => (
    //console.log('withStore'),
    <Provider store={store}>
        {component()}
    </Provider>
);