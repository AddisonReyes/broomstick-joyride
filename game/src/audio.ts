import "kaplay/global";

const gameplayMusicTrackNames = [
  "music-loop-6",
  "music-loop-9",
  "music-loop-12",
  "music-loop-14",
  "music-loop-15",
] as const;

const buttonClickVolume = 0.55;
const gameOverVolume = 0.8;
const gameplayMusicVolume = 0.5;

let currentGameplayMusic: ReturnType<typeof play> | null = null;

export function loadGameAudio(): void {
  loadSound("button-click", "audio/button-click.wav");
  loadSound("game-over", "audio/game-over.wav");

  for (const trackName of gameplayMusicTrackNames) {
    loadMusic(trackName, `music/${trackName}.wav`);
  }
}

export function playButtonClickSound(): void {
  play("button-click", { volume: buttonClickVolume });
}

export function startGameplayMusic(): void {
  stopGameplayMusic();

  const trackName = choose([...gameplayMusicTrackNames]);

  currentGameplayMusic = play(trackName, {
    loop: true,
    volume: gameplayMusicVolume,
  });
}

export function pauseGameplayMusic(): void {
  if (!currentGameplayMusic) {
    return;
  }

  currentGameplayMusic.paused = true;
}

export function stopGameplayMusic(): void {
  currentGameplayMusic?.stop();
  currentGameplayMusic = null;
}

export function playGameOverSound(): void {
  play("game-over", { volume: gameOverVolume });
}
