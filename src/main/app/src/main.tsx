import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { store } from './store/index.ts'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
              <ConfigProvider theme={{
                algorithm: theme.defaultAlgorithm,
                }}>
                <App />
              </ConfigProvider>
            </Provider>
        </HashRouter>
    </React.StrictMode>,
)
