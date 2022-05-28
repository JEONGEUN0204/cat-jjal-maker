import logo from './logo.svg';
import React from "react";
import './App.css';
import Title from "./components/Title";
import CatItem from "./components/CatItem";
import Favorites from "./components/Favorites";
import MainCard from "./components/MainCard";



const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
  };

  const Form=({updateMainCat})=>{
    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
    const [value,setValue]=React.useState('');
    const [errorMessage,setErrorMessage]=React.useState('');
    
    function handleInputChange(e){
      const userValue=e.target.value;
      setErrorMessage("");
      if(includesHangul(userValue)){
        setErrorMessage("한글은 입력할 수 없습니다.");
      }
      setValue(userValue.toUpperCase());
    }
    function handleFormSubmit(e){
      e.preventDefault();
      setErrorMessage("");
      if(value===''){
        setErrorMessage("빈 값으로 만들 수 없습니다.");
        return;
      }
      updateMainCat(value);
    }
    return(
      <form  onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요" value={value} onChange={handleInputChange}/>
      <button type="submit">생성</button>
      <p style={{color:"red"}}>{errorMessage}</p>
    </form>
    );
};

const App = () => {
const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";
const [counter, setCounter] = React.useState(() => { return jsonLocalStorage.getItem('counter') });
const [mainImage, setImage] = React.useState(CAT1);
//const [favorites,setFavorites]=React.useState(jsonLocalStorage.getItem("favorites") || []);
const [favorites, setFavorites] = React.useState(() => { return jsonLocalStorage.getItem("favorites") || [] }); //app이 실행될 때 처음 한번만 locarstorage에 접근하도록, 성능 향상
  
  const alredayFavorite = favorites.includes(mainImage);

  async function setInitialCat(){
    const newCat=await fetchCat('First cat');
    setImage(newCat);
    
  }
  
  React.useEffect(()=>{
    setInitialCat();
  },[]);

  async function updateMainCat(value) {
    const newCat=await fetchCat(value);

    setImage(newCat);
    setCounter((prev)=>{
      const nextCounter=prev+1;
      jsonLocalStorage.setItem("counter",nextCounter);
      return nextCounter;
    })
  }

  function handleHeartClick(){
    const nextFavorites=[...favorites,mainImage];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites",nextFavorites);
  }
  
  const title=counter===null ? "고양이 가라사대" : counter+"번째 고양이 가라사대";

  return (
    <div>
      <Title>{title}</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainImage} onHeartClick={handleHeartClick} alredayFavorite={alredayFavorite}/>
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
