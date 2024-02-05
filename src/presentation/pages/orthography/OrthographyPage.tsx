import { useState } from 'react';
import { GptMessage, MyMessage, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect, TypingLoader } from "../../components";

interface Message {
  text: string;
  isGpt: boolean;
}




export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])


  const handlePost = async( text: string ) => {

    setIsLoading(true);
    //Tomamos y propagamos los mensajes anteriores y anadimos uno nuevo
    setMessages( (prev) => [...prev, { text: text, isGpt: false }] );

    //TODO: UseCase
    
    setIsLoading(false);

    // Todo: Añadir el mensaje de isGPT en true


  }



  return (
    <div className="chat-container borderReference">
      <div className="chat-messages borderReference">
        <div className="grid grid-cols-12 gap-y-2 borderReference">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones" />

          {
            messages.map( (message, index) => (
              message.isGpt
                ? (
                  <GptMessage key={ index } text="Esto es de OpenAI" />
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


      {/* <TextMessageBox 
        //onSendMessage={ handlePost }
        onSendMessage={ (msg)=>handlePost(msg) }
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
      /> */}
      {/* <TextMessageBoxFile 
        //onSendMessage={ handlePost }
        onSendMessage={ (msg)=>handlePost(msg) }
        placeholder='Escribe aquí lo que deseas'
      /> */}
      <TextMessageBoxSelect 
        //onSendMessage={ handlePost }
        onSendMessage={(msg) => handlePost(msg)}
        placeholder='Escribe aquí lo que deseas'
        options={[{id:"1",text:"Hola"},{id:"2",text:"Mundo"}]}      />

    </div>
  );
};
