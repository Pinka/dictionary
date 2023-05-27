/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type RecordAudio, type Record, type Tag } from "@prisma/client";
import React from "react";
import { Tags } from "./Tags";
import { type LongPressCallback, useLongPress } from "use-long-press";
import { RecordAnimation } from "./RecordAnimation";
import { api } from "~/utils/api";
import { v4 as guid } from "uuid";
import { DeleteIcon } from "./DeleteIcon";
import LoadingIcon from "./LoadingIcon";
import { MicIcon } from "./MicIcon";
import clsx from "clsx";

export type FullRecord = Record & { tags: Tag[]; recordAudio: RecordAudio[] };

export const Word: React.FC<{
  word: FullRecord;
  onChange: (word: FullRecord) => void;
}> = ({ word, onChange }) => {
  const apiContext = api.useContext();

  const [isRecording, setIsRecording] = React.useState(false);

  // state for showing the audio save progress while saving
  const [savingAudioForWordId, setSavingAudioForWordId] = React.useState(0);

  const mediaRecorder = React.useRef<MediaRecorder>();
  const chunks = React.useRef<Blob[]>([]);

  const saveAudio = api.words.saveAudio.useMutation();
  const deleteAudio = api.words.deleteAudio.useMutation();
  const hasAudio = word.recordAudio.length > 0;

  const onStartRecord: LongPressCallback<HTMLButtonElement, unknown> = () => {
    setIsRecording(true);
    chunks.current = [];
    console.log("start recording");

    // record audio from microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // init media recorder if not already initialized
        if (!mediaRecorder.current) {
          mediaRecorder.current = new MediaRecorder(stream);

          // stop recording if already recording
          if (mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
          }

          mediaRecorder.current.addEventListener("dataavailable", (e) => {
            chunks.current.push(e.data);
          });

          mediaRecorder.current.addEventListener("stop", () => {
            stream.getTracks().forEach((track) => track.stop());
            mediaRecorder.current = undefined;

            setSavingAudioForWordId(word.id);

            const blob = new Blob(chunks.current, {
              type: "audio/webm; codecs=opus",
            });

            chunks.current = [];

            const audio = blob.size === 0 ? undefined : blob;

            if (!audio) {
              alert("No audio recorded");
              return;
            }

            const fileName = `audio-${
              word.contentMu?.toLowerCase() ?? ""
            }-${guid()}.webm`;

            apiContext.words.getS3UploadUrl
              .fetch({
                fileName,
                fileType: "audio/webm; codecs=opus",
              })
              .then((response) => {
                if (!response) {
                  return;
                }

                return fetch(response, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "audio/webm; codecs=opus",
                  },
                  body: audio,
                });
              })
              .then((response) => {
                if (!response || !response.ok) {
                  throw new Error("Failed to upload audio");
                }

                return saveAudio.mutateAsync({
                  wordId: word.id,
                  url: response.url,
                  fileName,
                });
              })
              .then((record) => {
                if (!record) {
                  throw new Error("Failed to save audio");
                }

                onChange(record);
              })
              .catch((e) => {
                console.error(e);
              })
              .finally(() => {
                setIsRecording(false);
                setSavingAudioForWordId(0);
              });
          });
        }

        mediaRecorder.current.start();
      })
      .catch((e) => {
        console.error(e);
        setSavingAudioForWordId(0);
      });
  };

  const onStopRecord: LongPressCallback<HTMLButtonElement, unknown> = () => {
    setIsRecording(false);

    if (!mediaRecorder.current) {
      return;
    }

    mediaRecorder.current.stop();
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const bindLongPress = useLongPress(onStartRecord, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    onFinish: onStopRecord,
  });

  const onDeleteAudio = (audio: RecordAudio) => {
    if (!window.confirm("Are you sure you want to delete this audio?")) {
      return;
    }

    const updatedRecord = {
      ...word,
      recordAudio: word.recordAudio.filter((a) => a.id !== audio.id),
    };

    onChange(updatedRecord);

    deleteAudio
      .mutateAsync({ wordId: audio.recordId, audioId: audio.id })
      .catch((e) => {
        onChange(word);
        console.error(e);
      });
  };

  // const onPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();

  //   if (!word.audioMuUrl) {
  //     return;
  //   }

  //   console.log("play audio", word.audioMuUrl);

  //   const audio = new Audio(word.audioMuUrl);
  //   audio
  //     .play()
  //     .then(() => {
  //       console.log("playing");
  //       setIsPlaying(true);
  //     })
  //     .finally(() => {
  //       console.log("finished playing");
  //       audio.remove();
  //       setIsPlaying(false);
  //     })
  //     .catch((e) => {
  //       console.error("Play error", e);
  //     });
  // };

  return (
    <>
      <div
        className={clsx("flex w-full flex-col bg-base-200 px-2", {
          "pb-2": !hasAudio,
        })}
      >
        <div className="flex w-full flex-row justify-between">
          <div className="fkex flex-1 flex-col">
            <p>
              <span className="text-xs font-bold">{word.contentMu}</span>
              <br />
              <span className="text-xs">{word.contentEn}</span>
            </p>
            <Tags className="pt-4" tags={word.tags} />
          </div>
          {isRecording && <RecordAnimation title={word.contentMu} />}
          {/* {showPlayButton && <PlayButton isPlaying={isPlaying} onPlay={onPlay} />} */}
          <button
            type="button"
            title={isRecording ? "Recording..." : "Record"}
            className="mr-3 flex flex-none flex-col justify-center align-middle"
            {...bindLongPress()}
          >
            {savingAudioForWordId === word.id ? <LoadingIcon /> : <MicIcon />}
          </button>
        </div>
        {hasAudio && (
          <div className="my-2 flex w-full flex-col gap-2">
            <hr />
            {word.recordAudio.map((audio) => (
              <div key={audio.url} className="flex flex-row">
                <audio
                  controls
                  src={audio.url}
                  className="h-8 w-full"
                  preload="metadata"
                />
                <button
                  type="button"
                  title="Delete"
                  className="mr-3 flex flex-none flex-col justify-center align-middle disabled:text-zinc-400"
                  onClick={() => onDeleteAudio(audio)}
                  disabled={word.recordAudio.length === 1}
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// const PlayButton: React.FC<{
//   isPlaying: boolean;
//   onPlay: (e: React.MouseEvent<HTMLButtonElement>) => void;
// }> = ({ isPlaying, onPlay }) => {
//   if (isPlaying) {
//     return (
//       <button
//         type="button"
//         className="mr-3 flex flex-none flex-col justify-center align-middle"
//         title="Pause"
//         onClick={onPlay}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           height="24"
//           viewBox="0 0 24 24"
//           width="24"
//         >
//           <path d="M0 0h24v24H0z" fill="none" />
//           <path d="M6 6h12v12H6z" />
//         </svg>
//       </button>
//     );
//   }

//   return (
//     <button
//       type="button"
//       className="mr-3 flex flex-none flex-col justify-center align-middle"
//       title="Play"
//       onClick={onPlay}
//     >
//       {isPlaying ? (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="h-6 w-6"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
//           />
//         </svg>
//       ) : (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="h-6 w-6"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M5 3l14 9-14 9V3z"
//           />
//         </svg>
//       )}
//     </button>
//   );
// };
