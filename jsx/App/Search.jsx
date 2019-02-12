import React from 'react';
import Fuse from 'fuse.js';
import { SearchSentence } from './Stories/Story/Display/Sentence.jsx';


export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { "searchResults": [] };
        this.list = this.props.search_index;
        this.runSearch = this.throttle(this.search, 500, this);
    }

    throttle(fn, threshhold, scope) {
        /*
        Takes in a function, threshold, and scope and returns a new
        function which will apply fn, at max, once per threshold
        credit: https://remysharp.com/2010/07/21/throttling-function-calls
        */
        var deferTimer;
        return function () {
            var context = scope || this;
            
            if (deferTimer) clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                return fn.apply(context);
            }, threshhold);
        };
    }

    search() {
        let query = document.getElementById("searchInput").value;
        let fields = [];
        document.getElementsByName("fields").forEach(function (e) {
            if (e.checked) fields.push(`dependents.${e.id}.value`);
        });

        var options = {
            shouldSort: true,
            findAllMatches: true,
            tokenize: true,
            matchAllTokens: true,
            threshold: 0,
            location: 0,
            distance: 0,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: fields
        };
        
        console.log("running search over: " + fields);
        let fuse = new Fuse(this.list, options); // "list" is the item array
        console.log("Made a fuse...");
        let searchResult = fuse.search(query).slice(0, 25);

        console.log("Search result:");
        console.log(searchResult);
        // const displayTable = document.getElementById("searchResults");
        // displayTable.innerHTML = ""; (DON'T DO THIS)
        let searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
            if ('speaker' in searchResult[i]) {
                let component = (<SearchSentence sentence={searchResult[i]} true />);
                searchResults.push(component);
            } else {
                let component = (<SearchSentence sentence={searchResult[i]} false />);
                searchResults.push(component);
            }
        }
        this.setState({ "searchResults": searchResults });
    }

    render() {
        console.log("rendering...");
        let results = this.state.searchResults;
        return (
            <div>
                <label for="searchInput">Search database:</label> <input id="searchInput" onInput={this.runSearch} type="text" />
                <br />
                <label>Select Fields:   </label>
                <label>Tier 1</label>
                <input id="T1" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 2</label>
                <input id="T2" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 3</label>
                <input id="T3" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 4</label>
                <input id="T4" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 5</label>
                <input id="T5" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 6</label>
                <input id="T6" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>English</label>
                <input id="T7" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 8</label>
                <input id="T8" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 9</label>
                <input id="T9" name="fields" type="checkbox" onInput={this.runSearch} />
                <label>Tier 10</label>
                <input id="T10" name="fields" type="checkbox" onInput={this.runSearch} />
                <br />
                <div id="searchResults">{results}</div>
            </div>
        )
    };
}