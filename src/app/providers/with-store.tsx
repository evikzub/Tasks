import { Provider } from 'react-redux';
import { setupStore } from '../store';
//import { store } from '../store';

const store = setupStore();

export const withStore = (component: () => React.ReactNode) => () => (
	//console.log('withStore'),
	<Provider store={store}>
		{component()}
	</Provider>
);