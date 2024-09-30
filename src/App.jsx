import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import Category from './Componenets/Category/Category'
// import City from './Componenets/City/City'
import Cars from './Componenets/Services/Services'
// import Location from './Componenets/Location/Location'
import Model from './Componenets/Faq/Faq'
import Brand from './Componenets/News/News'
import Dashboard from './Componenets/Dashboard/Dashboard'
import Sources from './Componenets/Sources/Sources'
import Services from './Componenets/Services/Services'
import Blog from './Componenets/Blog/Blog'
import News from './Componenets/News/News'


function App() {


  return (
    <>
      <Routes path='/'>
        <Route index element={<Login />} />
        <Route path="home" element={<Home />}>
          <Route index element={<Dashboard/>}/>
          <Route path='category' element={<Category/>}/>
          <Route path='city' element={<Sources/>}/>
          <Route path='cars' element={<Services/>}/>
          <Route path='loc' element={<Blog/>}/>
          <Route path='model' element={<Model/>}/>
          <Route path='brand' element={<News/>}/>
          
        </Route>
      </Routes>
    </>
  )
}

export default App
