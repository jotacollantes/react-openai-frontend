

export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok)
      throw new Error("No se pudo realizar la generación del audio");
    //Como recibimos un archivo y no un json debemos de usar el resp.blob   
    const audioFile = await resp.blob();
    //Creamos el audio URL
    const audioUrl = URL.createObjectURL(audioFile);
    
    console.log({audioUrl});
    //blob:http://localhost:5173/f86bfad1-7442-4ea0-86c4-5505596ca4fd
    return { ok: true, message: prompt, audioUrl: audioUrl };

  } catch (error) {
    return {
      ok: false,
      message: "No se pudo realizar la generación del audio",
    };
  }
};
