import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardActions, Typography, CardContent,
  Switch, LinearProgress, CardMedia
} from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TextField from '@mui/material/TextField';
import createCache from '@emotion/cache';
import Cookie from "js-cookie";
import { parseCookies } from "../src/components/lib/parseCookies";
//import { parseCookies } from "../../../src/components/lib/parseCookies";
import firebaseApp from '../firebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { async } from '@firebase/util';
import useInterval from "use-interval";

const db = getFirestore(firebaseApp);
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

  //console.log("props ", props)
  const [message, setMessage] = useState(props.initialRememberValue);
  const [textoIngles, setTextoIngles] = useState('');
  const [textoEspanol, setTextoEspanol] = useState('');

  const [wordEspanol, setWordEspanol] = useState('');
  const [wordIngles, setWordIngles] = useState('');
  //var for api dbone.json
  const [dbTextOne, setDbTextoOne] = useState('');
  const [dbTextTwo, setDbTextoTwo] = useState('');
  const [dbTextThree, setDbTextoThree] = useState('');
  //var repticion
  const [activeRep, setActivateRep] = useState(false)
  const [vozHablando, setVozHablando] = useState(false)

  const [progress, setProgress] = React.useState(0);
  //onst [tamanioTexto,setTamanioTexto]=useState(0);

  var tamnioTexto = 0;
  var divisionAvanzar = 0;
  var suma = 0;

  useEffect(() => {
    if (message) {
      Cookie.set("rememberMe", message.toString());
    }

  }, [message]);

  useEffect(() => {
    //lamar api get dbtext

    apiGetCitaTxtOne();
    apiGetCitaTxtTwo();
    apiGetCitaTxtThree();
  }, []);





  useInterval(
    () => {
      // Your custom logic here
      console.log("calling metod weapper every minute")
      if (activeRep && vozHablando == false) {
        wrapper();
      }

    },


    // Delay in milliseconds or null to stop it
    activeRep ? 10000 : null,
  )

  const handleChange = event => {
    setMessage(event.target.value);

    console.log('value is:', event.target.value);
  };

  const btnApiSETdbone = async () => {
    apiSETdbOne();
  }

  const btnApiSETdbTwo = async () => {
    apiSETdbTwo();
  }

  const btnApiSETdbThree = async () => {
    apiSETdbThree();
  }

  const handleChangeDbone = event => {
    setDbTextoOne(event.target.value);

    console.log('value is:', event.target.value);
  };

  const handleChangeDbtwo = event => {
    setDbTextoTwo(event.target.value);

    console.log('value is:', event.target.value);
  };

  const handleChangeDbthree = event => {
    setDbTextoThree(event.target.value);

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


    } catch (error) {

      console.log(error)
    }
  }

  const codIDone = "axjiZ2ZVpObICIvhou0r";
  const codIDtwo = "CfyoyPLe4DOThYxSZh6t";
  const codIDthree = "uuqu3alRdYgwXcXbTF9l";

  const apiGetCitaTxtOne = async () => {
    const getCitaTxtID = await getDoc(doc(db, 'cita', 'axjiZ2ZVpObICIvhou0r'));
    setDbTextoOne(getCitaTxtID.data().texto)
    //console.log("cita recuperado ", getCitaTxtID.data().texto)
    //  console.log("cita recuperado ", getCitaTxtID.data().valor.texto)
  }

  const apiGetCitaTxtTwo = async () => {
    const getCitaTxtID = await getDoc(doc(db, 'cita', codIDtwo));
    setDbTextoTwo(getCitaTxtID.data().texto)

  }
  const apiGetCitaTxtThree = async () => {
    const getCitaTxtID = await getDoc(doc(db, 'cita', codIDthree));
    setDbTextoThree(getCitaTxtID.data().texto)

  }

  const apiSETdbOne = async () => {
    const valor = {
      texto: dbTextOne
    }
    try {

      await updateDoc(doc(db, 'cita', 'axjiZ2ZVpObICIvhou0r'), valor);
      console.log("guardado")

    } catch (error) {
      console.log(error)
    }
  }

  const apiSETdbTwo = async () => {
    const valor = {
      texto: dbTextTwo
    }
    try {

      await updateDoc(doc(db, 'cita', codIDtwo), valor);
      console.log("guardado")

    } catch (error) {
      console.log(error)
    }
  }

  const apiSETdbThree = async () => {
    const valor = {
      texto: dbTextThree
    }
    try {

      await updateDoc(doc(db, 'cita', codIDthree), valor);
      console.log("guardado")

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
    setVozHablando(true);
    //var text = "sen ten ce one. sen ten ce two. sen ten ce three.";
    // var text = "sen ten ce one. hello how are you. sen ten ce three.";
    // var result = text.match( /[^\.!\?]+[\.!\?]+/g );
    // var result = ["hello","how","are","you"]
    //var text = "hello how are you"
    var text = message;
    var result = text.split(" ");
    var i;
    var ssu = new SpeechSynthesisUtterance();
    ssu.lang = 'en-US';
    var palabra = new SpeechSynthesisUtterance();
    palabra.lang = 'es-ES';
    //variables barra lineal progress
    tamnioTexto = result.length;
    divisionAvanzar = 100 / tamnioTexto;
    //fin variables barra lineal progress
    for (i = 0; i < result.length; i++) {

      //logica barra lienal progress
      suma = suma + divisionAvanzar;
      console.log("suma ", suma)
      setProgress(suma)
      //fin logica barra lineal progress
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
    if (i == result.length) {
      setVozHablando(false);
      console.log("termine de repetir el texto");
    }
  }



  //control checked
  const handleChangeActivate = (event) => {
    console.log("check ", event.target.checked)
    setActivateRep(event.target.checked);
  };



  return (
    <div className={styles.container}>
      <Head>
        <title>Learn English</title>
        <meta name="description" content="objetivo de la app ayudar en el enzeñanza de ingles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>


        <h5>Traductor de palabras  + reporductor de audio repetido intercalando ingles-esañol</h5>
        <TextField sx={{ width: '80%' }} InputProps={{ sx: { height: 200 } }} type="text" label="Escriba palabras en ingles"
          id="message"
          name="message"
          value={message}
          onChange={handleChange}
          multiline
          rows={8}
        />

        <CardActions sx={{ display: 'flex' }}>
          <Button variant="outlined" onClick={verTraduccionAlIngles}>Traduccion al Ingles</Button>
          <Button variant="outlined" onClick={verTraduccionAlEspanol}>Traduccion al Español</Button>
        </CardActions>


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

        <CardContent sx={{ display: 'flex' }}>
          <Card sx={{ minWidth: 275, backgroundColor: 'black' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14, color: 'white' }} color="text.secondary" gutterBottom>
                {wordIngles}
              </Typography>

              <Typography sx={{ mb: 1.5, color: 'white' }} color="text.secondary">
                {wordEspanol}
              </Typography>


            </CardContent>
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          </Card>

          <CardContent>
            <h4>activar repeticion</h4>
            <Switch
              checked={activeRep}
              onChange={handleChangeActivate}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </CardContent>
        </CardContent>
        <br />
        {/*texto de la base de datos       width: "100%", whiteSpace: 'normal',wordBreak:"break-word" */}
        <TextField sx={{
          width: "100%"
        }}
          InputProps={{ sx: { height: 300 } }} type="text" label="save in db(Base de datos)"
          id="message"
          name="message"
          value={dbTextOne}
          onChange={handleChangeDbone}
          multiline
          rows={10}
        />
        <Button variant="contained" onClick={btnApiSETdbone}>update text in db</Button>

        <TextField sx={{
          width: "100%"
        }}
          InputProps={{ sx: { height: 300 } }} type="text" label="save in db(Base de datos)"
          id="message"
          name="message"
          value={dbTextTwo}
          onChange={handleChangeDbtwo}
          multiline
          rows={10}
        />
        <Button variant="contained" onClick={btnApiSETdbTwo}>update text in db</Button>

        <TextField sx={{
          width: "100%"
        }}
          InputProps={{ sx: { height: 300 } }} type="text" label="save in db(Base de datos)"
          id="message"
          name="message"
          value={dbTextThree}
          onChange={handleChangeDbthree}
          multiline
          rows={10}
        />
        <Button variant="contained" onClick={btnApiSETdbThree}>update text in db</Button>


      </main>

      <div style={{ }}>


      

        <CardMedia
          component="img"
          /*height="140"*/
          image={"/1.jpeg"}
          alt="image"
          className={styles.img2}
        />

<CardMedia
          component="img"
          /*height="140"*/
          image={"/2.jpeg"}
          alt="image"
          className={styles.img2}
        />
      </div>
      <footer className={styles.footer}>
        <a

        >
          aprende ingles

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