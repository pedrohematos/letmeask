import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import logoImg from "../assets/images/logo.svg";

import "../styles/room.scss";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

type RoomsParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomsParams>();
  const [newQuestion, setNewQuestion] = useState("");

  const roomId = params.id;

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeaks" />
          <RoomCode code={params.id} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>React Room</h1>
          <span>4 questions</span>
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="What do you want to ask?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            <span>
              To submit a question <button>please login.</button>
            </span>
            <Button type="submit" disabled={!newQuestion || !user}>
              Send question
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
