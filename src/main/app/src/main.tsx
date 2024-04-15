import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { store, persistor } from './store/index.ts'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <ConfigProvider theme={{
                  algorithm: theme.defaultAlgorithm,
                  }}>
                  <App />
                </ConfigProvider>
              </PersistGate>
            </Provider>
        </HashRouter>
    </React.StrictMode>,
)
