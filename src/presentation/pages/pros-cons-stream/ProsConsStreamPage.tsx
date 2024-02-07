import { useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}




export const ProsConsStreamPage = () => {

  //Creamos el hool abortController del tipo AbortController
  const abortController = useRef( new AbortController() );
  //Creamos el hook isRunning que sirva como bandera y que el componente no sea renderizado
  const isRunning = useRef(false)

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])


  const handlePost = async( text: string ) => {

    if ( isRunning.current ) {
      //Si esta corriendo el stream y hay un nueva entrada en el chat, enviamos una senal de abort a la funcion controladora que a su vez ejecutara un abort signal en el fetch request para abortar el stream y hacer un nuevo fetch request que generara un nuevo stream
      abortController.current.abort();
      //Es necesario crear un nuevo objeto abortController
      abortController.current = new AbortController();
    }



    setIsLoading(true);
    isRunning.current = true;
    //setMessages( (prev) => [...prev, { text: text, isGpt: false }] );
    setMessages( [...messages, { text: text, isGpt: false }] );

    //TODO: UseCase
    //El current manda la propiedad signal del objeto abortController
    const stream = prosConsStreamGeneratorUseCase( text, abortController.current.signal );
    setIsLoading(false);

    //setMessages( (messages) => [ ...messages, { text: '', isGpt: true  } ] );
    setMessages( [ ...messages, { text: '', isGpt: true  } ] );

    for await (const text of stream) {
      setMessages( (messages) => {
        const newMessages = [...messages];
        //Actualizamos el ultimo mensaje
        newMessages[ newMessages.length - 1 ].text = text;
        return newMessages;
      });
    }

    isRunning.current = false;

  }



  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

          {
            messages.map( (message, index) => (
              message.isGpt
                ? (
                  <GptMessage key={ index } text={ message.text } />
                )
                : (
                  <MyMessage key={ index } text={ message.text } />
                )
                
            ))
          }

          
          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }
          

        </div>
      </div>


      <TextMessageBox 
        onSendMessage={ handlePost }
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
      />

    </div>
  );
};
