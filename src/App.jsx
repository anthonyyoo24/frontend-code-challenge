import React, { useState } from 'react';
import './App.css';

const URL_PATH = "https://gist.githubusercontent.com/bar0191/fae6084225b608f25e98b733864a102b/raw/dea83ea9cf4a8a6022bfc89a8ae8df5ab05b6dcc/pokemon.json";

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [toggleMaxCP, setToggleMaxCP] = useState(false);
    const [initialFetch, setInitialFetch] = useState(false);

    const onChange = (e) => {
        e.persist();
        setSearchTerm(e.target.value);
        setFetching(true);
        setInitialFetch(true);
        fetch(URL_PATH).then(res => res.json()).then(data => {
            setFetching(false);
            let results;

            if (toggleMaxCP) {
                results = data.sort((a, b) => a.MaxCP - b.MaxCP );
            } else {
                results = data;
            }

            const filteredByName = results.filter(pokemon => pokemon.Name.toLowerCase().includes(e.target.value.toLowerCase())).slice(0, 4);
            let filteredByType;

            if (filteredByName.length < 4) {
                filteredByType = results.filter(pokemon => {
                    const matchSearch = [];
    
                    pokemon.Types.forEach(type => {
                        if (type.toLowerCase().includes(e.target.value.toLowerCase())) {
                            matchSearch.push(true);
                        } else {
                            matchSearch.push(false);
                        }
                    });
    
                    if (matchSearch.includes(true)) {
                        return true;
                    } else {
                        return false;
                    }
                }).slice(0, 4 - filteredByName.length);
            
                const nameAndType = filteredByName.concat(filteredByType);
                setPokemonList(nameAndType);
            } else {
                setPokemonList(filteredByName);
            }
        });
    }

    const renderTypes = (pokemon) => {
        return pokemon.Types.map((type, i) => {
            return (
                <span key={i} className={`type ${type.toLowerCase()}`}>{type}</span>
            );
        });
    }

    const renderName = name => {
        let highlightedName = name.replace(new RegExp(searchTerm, "gi"), match => `<span class="hl">${match}</span>`);

        const createMarkup = (html) => {
            return { __html: html };
        }

        return <h1 dangerouslySetInnerHTML={createMarkup(highlightedName)} />;
    }

    const renderList = () => {
        if (searchTerm !== '') {
            return pokemonList.map(pokemon => {
                return (
                    <li key={pokemon.Name}>
                        <img src={pokemon.img} alt="" />
                        <div className="info">
                            {renderName(pokemon.Name)}
                            {renderTypes(pokemon)}
                        </div>
                    </li>
                );
            });
        }
    }

    const renderNoResults = () => {
        if (pokemonList.length === 0 && initialFetch) {
            return (
                <li>
                    <img src="https://cyndiquil721.files.wordpress.com/2014/02/missingno.png" alt="" />
                    <div className="info">
                        <h1 className="no-results">
                            No results
                        </h1>
                    </div>
                </li>
            );
        }
    }

    return (<>
        <label onClick={() => setToggleMaxCP(!toggleMaxCP)} htmlFor="maxCP" className="max-cp">
            <input type="checkbox" id="maxCP" />
            <small>
                Maximum Combat Points
            </small>
        </label>
        <input onChange={(e) => onChange(e)} value={searchTerm} type="text" className="input" placeholder="Pokemon or type" />
        {fetching ? <div className="loader"></div> : null}
        <ul className="suggestions">
            {renderList()}
            {renderNoResults()}
        </ul>
    </>);
};

export default App;