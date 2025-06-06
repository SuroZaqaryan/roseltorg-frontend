import { Layout } from 'antd';
import HomePage from '@pages/HomePage.tsx';
import cl from './App.module.scss';

const { Content } = Layout;

function App() {
  return (
    <Layout className={cl.appLayout}>
      <Content>
        <HomePage />
      </Content>
    </Layout>
  )
}

export default App
