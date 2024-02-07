import type { ProsConsResponse } from '../../interfaces';



export const prosConsUseCase = async( prompt: string ) => {

  try {
    //Para obtener la variable de entorno en el frontend: import.meta.env.VITE_GPT_API
    const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if ( !resp.ok ) throw new Error('No se pudo realizar la comparación');

    //Aqui usamos la interfaz ProsConsResponse para tipar la respuesta
    const data = await resp.json() as ProsConsResponse;


    return  {
      ok: true,
      ...data,
    }


  } catch (error) {
    console.log(error)
    return {
      ok: false,
      content: 'No se pudo realizar la comparación'
    }
  }


}