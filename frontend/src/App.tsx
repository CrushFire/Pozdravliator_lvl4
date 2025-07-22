import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { Main } from './pages/Main'; // например, главная после входа
import { Layout } from './components/Layot'
import { ProtectedLayout} from './components/ProtectedLayout';
import { Create }  from './pages/Create';
import { Update } from './pages/Update';
import { Calendar } from './pages/Calendar';
import { Search } from './pages/Search';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Защищённый роут */}
        {/* <Route element={token ? <Layout /> : <Navigate to="/login" replace />}></Route> */}
        <Route element={<ProtectedLayout />}>
            <Route path="/main" element={<Main />} />
            <Route path="/search" element={<Search />} />
            <Route path="/calendar/:month" element={<Calendar />} />
            <Route path="/create" element={<Create />} />
            <Route path="/update/:id" element={<Update />} />
            {/* сюда можно добавить остальные защищённые роуты */}
          </Route>

        {/* По умолчанию редиректим на login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
        </Routes>
    </Router>
  );
};

export default App;