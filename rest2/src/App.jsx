import { useState, useEffect } from "react";
import "./App.css";
const api = "https://pokeapi.co/api/v2";

///docs mai doc https://academind.com/tutorials/reactjs-pagination
function App() {
  //fetch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //data
  const [pokemons, setPokemons] = useState(null);
  // const [pokemonInfo, setPokemonInfo] = useState(null);

  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  //pagination
  const [sum, setSum] = useState(null);
  const [limit, setLimit] = useState(0);
  const [offset, setOffSet] = useState(0);//so dl bo qua trong db
  const [currentPage, setCurrentPage] = useState(1);

  const getPokemons = async (config) => {
    try {
      const response = await fetch(
        (config === 'normal')
          ? `${api}/pokemon`
          : (config === 'next')
            ? next
            : (config === 'prev')
              ? prev
              : config,
        {
          method: "GET",
          mode: "cors",
        });

      if (!response.ok) {
        throw new Error(`http error ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      // setPokemons(data.results);
      setNext(data.next);
      setPrev(data.previous);
      setSum(data.count);
      setLimit(data.results.length);
      setOffSet(data.offset);
      setError(null);
      setLoading(true);

      Promise.all(data.results.map(async (item) => {
        return (await fetch(item.url)).json();
      })
      ).then((result) => {
        setPokemons(result);
        setLoading(false);
        console.log(result);
      });

    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setNext(null);
      setPrev(null);
      setSum(null);
      setLimit(0);
      setOffSet(0);
    }
  };


  useEffect(() => {
    getPokemons('normal')

  }, []);




  const handleNext = async () => {
    if (next) {
      getPokemons('next');
      setCurrentPage(currentPage + 1);
    }
  }

  const handlePrev = async () => {
    if (prev) {
      setCurrentPage(currentPage - 1);
      getPokemons('prev');
    }
  }
  const handleChangePage = (e) => {
    const query = `${api}/pokemon?offset=${(Number(e.target.textContent) - 1) * limit}&limit=${limit}`
    setCurrentPage(Number(e.target.textContent))
    getPokemons(query)
  }

  const createPagination = (pageLimit, start) => {
    return new Array(pageLimit).fill().map((_, idx) => start + idx)
  }
  return (
    <div className="App">
      <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
      {
        createPagination(5, currentPage).map((item, idx) => <span className={(item === currentPage) ? 'active page' : 'normal page'} onClick={handleChangePage} key={idx}>{item}</span>)
      }
      <button onClick={handleNext} disabled={currentPage === sum}>&gt;</button>
      {loading && <h1>loading...</h1>}
      {error && <h1>{`has a problem :${error}`}</h1>}
      <ul id="pokemon-container">
        {pokemons && pokemons.map((pokemon, i) => {
          return (
            <div key={pokemon.id} id="pokemon-item">
              <h3 id="pokemon-name">{pokemon.name}</h3>
              <img src={pokemon.sprites.front_default} id="pokemon-image" alt={pokemon.name} />
              <ul id="pokemon-stat">
                {pokemon.stats.map((stat, i) => {
                  // console.log(stat)
                  return (
                    <li className={`stat-line ${stat.stat.name}`} key={i}>{stat.stat.name}
                      <span className="stat-number">{stat.base_stat}</span>
                    </li>
                  )
                })}
              </ul>
              <ul id="pokemon-type">
                {pokemon.types.map((type, i) => <li key={i}>{type.type.name}</li>)}
              </ul>
            </div>
          )
        })}
      </ul>

    </div>
  );
}

export default App;
