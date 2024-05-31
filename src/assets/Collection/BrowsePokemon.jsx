import React, {useEffect, useReducer, useState} from "react";
import { HomeContainer, Title } from "../Home/Home.styled";
import {BrowseContainer, OuterContainer} from "./Browse.styled"
import { LoadMore } from "../Pokemon/Pokemon.styled";
import {fetchPokeList,  fetchEvolutionData, fetchSinglePokemon } from "../Reducers/pokeAPI";
import {pokeListReducer, initialPokeList} from "../Reducers/pokemonListReducer"
import {initialPokeDetails, pokemonReducer} from "../Reducers/pokemonReducer";
import SinglePokeCard from "./SinglePokeCard"


function BrowsePokemon() {


    const [ disableButton, setDisablebutton ] = useState(false)

const [pokemonDetails, pokemonDetailDispatch] = useReducer(pokemonReducer, initialPokeDetails);

const [pokemonList, pokeListDispatch] = useReducer(pokeListReducer, initialPokeList);


const fetchData = async (url) => {
    pokeListDispatch({ type: 'setLoading' });
    try {

        const { data } = await fetchPokeList(url);
        pokeListDispatch({
            type: 'setPokeList',
            payload: data
        });

    } catch (error) {
        pokeListDispatch({
            type: 'setError',
            payload: error.message
        });
    }
}


async function handleLoadMore() {
    pokeListDispatch({ type: 'setLoading' });
    
    try {
        if (pokemonList.list.length >= 151) {
            setDisablebutton(true);
            return;
        }
        await fetchData(pokemonList.nextUrl);

    } catch (error) {
        pokeListDispatch({
            type: 'setError',
            payload: error.message
        });
    }
}


useEffect(() => {
    // Use the initialUrl for the first fetch


    fetchData(pokemonList.initialUrl);
    setDisablebutton(false);
}, []);

    return (

        <OuterContainer>

            <BrowseContainer>
               {pokemonList && pokemonList?.list?.map((poke, index) => {
                return (
                    <div key={index}>
                        
                        <SinglePokeCard index={index + 1} poke={poke}/>
                    </div>
                )
               })}
            </BrowseContainer>
            
               {!pokemonList.loading && pokemonList?.list.length < 151 && 
               <LoadMore disabled={disableButton} onClick={handleLoadMore}>
               Load more Pokemon
             </LoadMore>
            
             }

             {pokemonList?.list.length > 151 ? <h1>I only like the first 250ish Pokemon</h1> : null}


      
   
            
        </OuterContainer>
    )
}

export default BrowsePokemon;