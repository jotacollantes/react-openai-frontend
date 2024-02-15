
export const createThreadUseCase = async () => {
  
  try {
    //!Con el prefixe VITE_ la variable de entorno es publica
    const resp = await fetch(`${ import.meta.env.VITE_ASSISTANT_API }/create-thread`,{
      method: 'POST'
    });
    //! Como no se el tipo de dato de la respuesta en el json la especificamos como de tipo {id:string}
    const { id } = await resp.json() as { id: string };

    return id;

  } catch (error) {

    throw new Error('Error creating thread');
  }


}


