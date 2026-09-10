// This player accepts only already-saved audio. It cannot request speech generation.
export const createAttendanceVoicePlayer = (onError: () => void) => {
  let audio: HTMLAudioElement | undefined;
  let objectUrl: string | undefined;
  let requestId = 0;

  const stop = () => {
    requestId++;
    if (audio) {
      audio.onerror = null;
      audio.onended = null;
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {
        // Audio failures must not interrupt attendance or navigation.
      }
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  };

  const play = (clip: Blob) => {
    stop();
    const activeRequestId = requestId;
    const fail = () => {
      if (activeRequestId !== requestId) return;
      stop();
      onError();
    };
    try {
      audio ??= new Audio();
      const player = audio;
      objectUrl = URL.createObjectURL(clip);
      player.onerror = () => {
        if (player.error) fail();
      };
      player.onended = () => {
        if (activeRequestId === requestId) stop();
      };
      player.src = objectUrl;
      void player.play().catch(fail);
    } catch {
      fail();
    }
  };

  return { play, stop };
};
