import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Card, CardActions, Typography, CardContent } from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TextField from '@mui/material/TextField';
import createCache from '@emotion/cache';
import Cookie from "js-cookie";
import { parseCookies } from "../src/components/lib/parseCookies";
//import { parseCookies } from "../../../src/components/lib/parseCookies";

const cache = createCache({
  key: 'css',
  prepend: true,
});


const Home = (props) => {

  const urlProducction = "https://backend-aprendreingles.vercel.app/api";
  //const urlProducction ="http://localhost:4000/api";
  // "https://backend-aprendreingles.vercel.app/api";
  //"
  // 
  //http://localhost:3000";
  const urlDev = "https://aprendeingles.vercel.app/";

  console.log("props ", props)
  const [message, setMessage] = useState(props.initialRememberValue);
  const [textoIngles, setTextoIngles] = useState('');
  const [textoEspanol, setTextoEspanol] = useState('');

  const [wordEspanol, setWordEspanol] = useState('');
  const [wordIngles, setWordIngles] = useState('');
  //var for api dbone.json
  const [dbTextOne, setDbTextoOne] = useState('');

  const inputProps = {
    step: 300,
    width: "700px"
  };


  useEffect(() => {
    if (message) {
      Cookie.set("rememberMe", message.toString());
    }

  }, [message]);

  useEffect(() => {
    //lamar api get dbtext

    apiGETdbOne()
  }, []);

  const handleChange = event => {
    setMessage(event.target.value);

    console.log('value is:', event.target.value);
  };

  const btnApiSETdbone = async () => {
    apiSETdbOne();
  }
  const handleChangeDbone = event => {
    setDbTextoOne(event.target.value);

    console.log('value is:', event.target.value);
  };

  const btnUpdateMessage = async () => {
    console.log("update message")
    setMessage(dbTextOne)

    reproducirAudioInlgesEspanol();
  }
  const apiEnviandoTexto = async () => {

    try {
      const result = await axios.post(`${urlProducction}/recibo-texto`, {
        "texto": message,

      })
      console.log("Data ClientConect  ", result.data)

    } catch (error) {

      console.log(error)
    }
  }

  const apiGETdbOne = async () => {

    try {
      const result = await axios.get(`${urlProducction}/get-textdbone`)
      console.log("datos del db.json ", result.data)
      setDbTextoOne(result.data.texto)

    } catch (error) {

      console.log(error)
    }
  }

  const apiSETdbOne = async () => {

    try {
      const result = await axios.post(`${urlProducction}/set-textdbone`, {
        "texto": dbTextOne
      })
      //  console.log("Data ClientConect  ", result.data)

    } catch (error) {

      console.log(error)
    }
  }
  const apiTextoAlIngles = async () => {

    try {
      const result = await axios.get(`${urlProducction}/texto-traducido-ingles`)
      //  console.log("Data ClientConect  ", result.data)
      setTextoIngles(result.data);

    } catch (error) {

      console.log(error)
    }
  }

  const apiTextoAlEspanol = async () => {

    try {
      const result = await axios.get(`${urlProducction}/texto-traducido-espanol`)
      //  console.log("Data ClientConect  ", result.data)
      setTextoEspanol(result.data);

    } catch (error) {

      console.log(error)
    }
  }
  /*
    const enviandoTexto = () => {
      apiDataClientConect();
    }*/

  const verTraduccionAlIngles = async () => {
    //wrapper();
    await apiEnviandoTexto();
    apiTextoAlIngles();
  }

  const verTraduccionAlEspanol = async () => {
    //wrapper();
    await apiEnviandoTexto();
    apiTextoAlEspanol();
  }
  const reproducirAudioInlgesEspanol = async () => {
    wrapper();


  }


  async function wrapper() {
    //var text = "sen ten ce one. sen ten ce two. sen ten ce three.";
    // var text = "sen ten ce one. hello how are you. sen ten ce three.";
    // var result = text.match( /[^\.!\?]+[\.!\?]+/g );
    // var result = ["hello","how","are","you"]
    //var text = "hello how are you"
    var text = message;
    var result = text.split(" ");

    var ssu = new SpeechSynthesisUtterance();
    ssu.lang = 'en-US';
    var palabra = new SpeechSynthesisUtterance();
    palabra.lang = 'es-ES';
    for (var i = 0; i < result.length; i++) {
      var sentence = result[i];
      console.log("sentence ", sentence);/* */
      ssu.text = sentence;
      /*actual estado word ingles */
      setWordIngles(sentence);

      await new Promise(function (resolve) {
        ssu.onend = resolve;
        window.speechSynthesis.speak(ssu);
      });

      try {
        const result = await axios.post(`${urlProducction}/recibo-texto`, {
          "texto": sentence,

        })


      } catch (error) {

        console.log(error)
      }


      const palEspanol = await axios.get(`${urlProducction}/texto-traducido-espanol`)


      var word = palEspanol.data;
      /*actula estado español */
      setWordEspanol(word);
      console.log("frond end ", word)

      palabra.text = word;
      await new Promise(function (resolve) {
        palabra.onend = resolve;
        window.speechSynthesis.speak(palabra);
      });
    }
  }





  return (
    <div className={styles.container}>
      <Head>
        <title>Learn English</title>
        <meta name="description" content="objetivo de la app ayudar en el enzeñanza de ingles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div >

          <h5>Traductor de palabras ingles-esañol + audio repetido</h5>
          <TextField sx={{ width: '80%' }} type="text" label="Escriba palabras en ingles"
            id="message"
            name="message"
            value={message}
            onChange={handleChange}
            inputProps={inputProps} />

          <Button variant="outlined" onClick={verTraduccionAlIngles}>Traduccion al Ingles</Button>
          <Button variant="outlined" onClick={verTraduccionAlEspanol}>Traduccion al Español</Button>
          <Button onClick={reproducirAudioInlgesEspanol}>
            Reproducir Audio intercalado ingles-español
            <RecordVoiceOverIcon />
          </Button>
          <h1>
            {textoIngles}
          </h1>
          <h1>
            {textoEspanol}
          </h1>
        </div>
        <Card sx={{ minWidth: 275, backgroundColor: 'black' }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, color: 'white' }} color="text.secondary" gutterBottom>
              {wordIngles}
            </Typography>

            <Typography sx={{ mb: 1.5, color: 'white' }} color="text.secondary">
              {wordEspanol}
            </Typography>

          </CardContent>

        </Card>
        <br />
        {/*texto de la base de datos */}
        <TextField sx={{ width: '100%' }} type="text" label="save in db(Base de datos)"
          id="message"
          name="message"
          value={dbTextOne}
          onChange={handleChangeDbone}
        />
        <Button variant="contained" onClick={btnApiSETdbone}>update text in db</Button>
        <Button onClick={btnUpdateMessage}>
          <RecordVoiceOverIcon />
        </Button>

      </main>

      <footer className={styles.footer}>
        <a

        >
          Powered by{' '}

        </a>
      </footer>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  const cookies = parseCookies(req);

  return {
    initialRememberValue: cookies.rememberMe,
  };
};


export default Home;