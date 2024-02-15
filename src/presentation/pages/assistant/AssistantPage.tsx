import { useEffect, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import {
  createThreadUseCase,
  postQuestionUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  // Obtener el thread, y si no existe, crearlo
  useEffect(() => {
    //leemos el localstorage y verificamos
    const threadId = localStorage.getItem("threadId");

    const doEffectCreateThread = async () => {
      const id = await createThreadUseCase();
      setThreadId(id);
      localStorage.setItem("threadId", id);
    };
    if (threadId) {
      //asignamos el thread id al state
      setThreadId(threadId);
    } else {
      // createThreadUseCase()
      //   .then( (id) => {
      //     setThreadId(id);
      //     localStorage.setItem('threadId', id)
      //   })
      doEffectCreateThread();
    }
  }, []);

  // useEffect(() => {
  //   if ( threadId ) {
  //     setMessages( (prev) => [ ...prev, { text: `Número de thread ${ threadId }`, isGpt: true }] )
  //   }
  // }, [threadId])

  const handlePost = async (text: string) => {
    //si el thread no existe salimos
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const replies = await postQuestionUseCase(threadId, text);

    setIsLoading(false);

    //iteramos los elementos de replies
    for (const reply of replies) {
      //iteramos los elementos de reply.content
      for (const message of reply.content) {
        setMessages((prev) => [
          ...prev,
          //reply.role === "assistant" va a devolver un boolean si es assitant devuelve true si es user devuelve false
          { text: message, isGpt: reply.role === "assistant", info: reply },
        ]);
      }
    }
  };

  console.log(threadId);
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Buen día, soy Sam,¿Cuál es tu nombre? y ¿en qué puedo ayudarte?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
