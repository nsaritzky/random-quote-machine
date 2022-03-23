/* import logo from './logo.svg'; */
import './App.scss';
import React, { useState, useEffect, useReducer } from 'react';
import 'bootstrap';

const DUMMY_QUOTE = {
    text: "It is said that one man is not two, but three out of five is more than most.",
    author: "Tommy Smith"
}

const EMPTY_QUOTE = {
    text: "",
    author: ""
}

type QuoteObj = { text: string; author: string };
type StateType = {
    quotes: QuoteObj[]  /* A list of quotes */
    order: number[];    /* The random drawing order */
    index: number       /* The current place in the drawing order */
}


const quoteRequest = async function(): Promise<QuoteObj[]> {
    const response = await fetch("https://type.fit/api/quotes")
    return (response.json());
}

const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const twitterURL = new URL("https://www.twitter.com/intent/tweet");

const makeTweetLink = (quote: QuoteObj): URL => {
    let url = twitterURL;
    let tweet = `${quote.text}
- ${quote.author}`;
    url.searchParams.set('text', tweet);
    return (url);
}

function App() {

    const [quotes, setQuotes] = useState([EMPTY_QUOTE])
    const [order, setOrder] = useState([0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const quotes = await quoteRequest();
            setQuotes(quotes);
            setOrder(shuffleArray([...Array(quotes.length).keys()]))
        }
        fetchData();
    }, [quoteRequest]);

    const quote = quotes[order[index]];

    const handleNewQuote = () => {
        if (index === quotes.length - 1) {
            setOrder(shuffleArray(order));
            setIndex(-1);   /* This becoms the desired 0 after the next line */
        }
        setIndex(index + 1);
    }

    return (
        <div className="QuoteMachine container">
            <div className="card w-50 position-absolute start-50 top-50 translate-middle shadow-sm bg-white m-auto" id='quote-box'>
                <div className="card-body">
                    <figure>
                        <blockquote className="card-text blockquote" id="text">
                            {quote.text}
                        </blockquote>
                        {quote.author && <figcaption className="blockquote-footer text-end" id="author">
                            {quote.author}
                        </figcaption>}
                    </figure>
                    <div className="row">
                        <div className="col-3">
                            <a href={makeTweetLink(quote).toString()} id="tweet-quote">
                                <button className="btn btn-light">
                                    <i className="fa-brands fa-twitter" />
                                </button>
                            </a>
                        </div>
                        <div className="col-6" />
                        <div className="col-3">
                            <button className="btn btn-primary" id="new-quote" onClick={handleNewQuote}>New Quote</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
