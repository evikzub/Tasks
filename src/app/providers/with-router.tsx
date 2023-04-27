import { Spin } from "antd";
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

export const withRouter = (component: () => React.ReactNode) => () => (
	//console.log('withRouter'),
	<BrowserRouter>
		<Suspense fallback={<Spin delay={300} className='overlay' size='large' />} >
			{component()}
		</Suspense>
	</BrowserRouter>
)