//React hooks/functions
import React from 'react'
import { useEffect, useState, useMemo } from 'react'
//Components
import DonutChart from '../misc/visuals/DonutChart'
import Card from '../misc/MiniCard';
//Modules
import Cookies from 'universal-cookie';
import { useParams } from 'react-router-dom';
import axios from 'axios';



let cookies = new Cookies();

export default function TrackPage({ api }) {

    let spotifyApi = api;
    let { trackId } = useParams();
    let defaultTrackId = trackId
    if (!trackId) defaultTrackId = '3Qm86XLflmIXVm1wcwkgDK'

    const [track, setTrack] = useState({})
    const [audioFeatures, setAudioFeatures] = useState({})
    const [lyrics, setLyrics] = useState('not found')
    const [rhymes, setRhymes] = useState('not found')
    const memoizedLyrics = useMemo(() => highlightRhymes(lyrics, rhymes), [lyrics, rhymes])
    const [highLight, setHighlight] = useState(false)
    const [red, setRed] = useState(false);

    useEffect(() => {
        const abortCont = new AbortController();

        if (!spotifyApi._credentials.accessToken) {
            if (cookies.get('token')) {
                spotifyApi.setAccessToken(cookies.get('token'))
            } else {
                console.log("CODE 'leaf 1' : Failed to get cookie");
                return
            }
        };


        spotifyApi.getTrack(defaultTrackId, { signal: abortCont }).then(res => {
            setTrack(res.body);
            spotifyApi.getAudioFeaturesForTrack(res.body.id).then(response => {
                console.log("REQUEST: Get Track");
                setAudioFeatures(response.body)
            })

        }, error => console.log(error))
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log("fetch abborded");
                }
            })

        return () => abortCont.abort()
    }, [spotifyApi, defaultTrackId])

    useEffect(() => {
        if ([track.name, track.artists].includes(undefined)) return
        if (lyrics !== 'not found') return;
        axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/lyrics', {
            title: track.name,
            artist: track.artists[0].name
        }).then(res => {
            setLyrics(res.data.lyrics)
            setRhymes(res.data.rhymes)
        }).catch((e) => {//redirect user to back to login page when token expires
            console.log("Login error: " + e);
        })
        return
    }, [setTrack, track, lyrics])

    useEffect(() => {
        let tempo = audioFeatures.tempo
        if (!tempo) return

        const intervalID = setInterval(() => {
            setRed(red => !red);
        }, (Math.round(60000 / (tempo))) + 1);
        return () => clearInterval(intervalID);
    }, [audioFeatures]);

    return (
        <div>
            <div className="bg-dark text-center py-2 mt-1">
                <h6>Lower your volume!</h6>
                <h6>Audio control is not available for Embeded Players</h6>
            </div>
            <div className="my-3">
                {(track.id) ? <iframe title={track.name} key={track.id} id="iframe" src={"https://open.spotify.com/embed/track/" + track.id}
                    width="100%" height="80px" frameBorder="0" allow="encrypted-media"></iframe> : ""}
            </div>
            <div>

            </div>
            <div className="d-flex justify-content-around flex-wrap">
                <Card title="Title" value={track.name} />
                <Card title="Tempo" red={red} value={audioFeatures.tempo} />
                <Card title="Key" value={getKey(audioFeatures.key, audioFeatures.mode)} />
                <Card title="Duration" value={getDuration(track.duration_ms)} />
            </div>

            <div className="d-flex justify-content-center align-content-center flex-wrap mt-4">
                <DonutChart chartTitle={"Speech"} chartValue={(Math.round(audioFeatures.speechiness * 1000) / 10)} />
                <DonutChart chartTitle={"Dance"} chartValue={(Math.round(audioFeatures.danceability * 1000) / 10)} />
                <DonutChart chartTitle={"Liveness"} chartValue={(Math.round(audioFeatures.liveness * 1000) / 10)} />
                <DonutChart chartTitle={"Acoustic"} chartValue={(Math.round(audioFeatures.acousticness * 1000) / 10)} />
                <DonutChart chartTitle={"Energy"} chartValue={(Math.round(audioFeatures.energy * 1000) / 10)} />
                <DonutChart chartTitle={"Valence"} chartValue={(Math.round(audioFeatures.valence * 1000) / 10)} />
            </div>
            {(lyrics !== 'not found') ?

                <div className="text-center mb-4">
                    <h2 className=" mt-2">Lyrics</h2>
                    <button className="btn btn-success my-4" onClick={() => setHighlight(prevHighlight => !prevHighlight)}>Toggle Highlight</button>
                    <div className="lyrics-container  m-1">
                        {(highLight) ? <div className="h5" dangerouslySetInnerHTML={{ __html: memoizedLyrics }} /> : <h3 className="white-space-pre">{lyrics} </h3>}
                    </div>
                </div>
                : <div className="text-center my-5">
                    <h5 className="">No Lyrics Found</h5>
                    <h5 className="">or</h5>
                    <h5 className="">The Service Is Down</h5>
                </div>}

        </div >
    )
}

function getKey(key, mode) {
    if (key === undefined || mode === undefined) {
        return
    }

    const NumberSys = [
        ['C', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
        ['C#/Db', 'C#/Db', 'D#/Eb', 'F', 'F#/Gb', 'G#/Ab', 'A#/Bb', 'C'],
        ['D', 'D', 'E', 'F#/Gb', 'G', 'A', 'B', 'C#/Db'],
        ['D#/Eb', 'D#/Eb', 'F', 'G', 'G#/Ab', 'A#/Bb', 'C', 'D'],
        ['E', 'E', 'F#/Gb', 'G#/Ab', 'A', 'B', 'C#/Db', 'D#/Eb'],
        ['F', 'F', 'G', 'A', 'A#/Bd', 'C', 'D', 'E'],
        ['F#/Gb', 'F#/Gb', 'G#/Ab', 'A#/Bp', 'B', 'C#/Db', 'D#/Eb', 'F'],
        ['G', 'G', 'A', 'B', 'C', 'D', 'E', 'F#/Gb'],
        ['G#/Ab', 'G#/Ab', 'A#/Bp', 'C', 'C#/Db', 'D#/Eb', 'F', 'G'],
        ['A', 'A', 'B', 'C#/Db', 'D', 'E', 'F#/Gb', 'G#/Ab'],
        ['A#/Bp', 'A#/Bp', 'C', 'D', 'D#/Eb', 'F', 'G', 'A'],
        ['B', 'B', 'C#/Db', 'D#/Eb', 'E', 'F#/Gb', 'G#/Ab', 'A#/Bp']
    ]

    return NumberSys[key][mode]
}

function highlightRhymes(lyrics, rhymes) {
    if (lyrics.lenght < 0 || lyrics === 'not found') return lyrics
    if (rhymes.lenght < 0 || rhymes === 'not found') return lyrics

    for (let i = 0; i < rhymes.length; i++) {
        let rhyme = rhymes[i];
        let color = "hsl(" + Math.random() * 360 + ", 100%, 65%)";
        for (let j = 0; j < rhyme.length; j++) {
            if (rhyme[j].length > 3) {
                lyrics = replaceAlls(lyrics, " " + rhyme[j], ' <mark style="background-color:' + color + '"' + color + ">" + rhyme[j] + "</mark> ")
            }
        }
    }

    lyrics = lyrics.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    return lyrics
}


function replaceAlls(str, term, replacement) {
    return str.replace(new RegExp((term), 'g'), replacement);
}

function getDuration(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    return mins + ":" + secs.toString().padEnd(2, '0');
}



//Wait so spotify embed doesn't get ddosed
//TODO: Make Recently Played dynamic
//TODO: Search Songs
//TODO: Recently Played Artists
//TODO: Finish Track Page
//TODO: Set timeouts for requests, and abondents, also check pre loads