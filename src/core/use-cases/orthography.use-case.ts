import type { OrthographyResponse } from '../../interfaces';



export const orthographyUseCase = async( prompt: string ) => {

  try {
    //Variables de entorno para frontend en react import.meta.env
    //fetch por defecto es get
    const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/orthography-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if ( !resp.ok ) throw new Error('No se pudo realizar la corrección');
    //Tipamos la respuesta del json as OrthographyResponse
    const data = await resp.json() as OrthographyResponse;
   
    return  {
      ok: true,
      ...data,
    }


  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'No se pudo realizar la corrección'
    }
  }


}