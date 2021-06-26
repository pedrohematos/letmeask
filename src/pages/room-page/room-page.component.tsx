import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "../../components/button/button.component";
import { RoomCode } from "../../components/room-code/room-code.component";
import { Question } from "../../components/question/question.component";

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { useRoom } from "../../hooks/useRoom";

import logoImg from "../../assets/images/logo.svg";
import "./room-page.styles.scss";

type RoomsParams = {
  id: string;
};

export function RoomPage() {
  const { user } = useAuth();
  const params = useParams<RoomsParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const [newQuestion, setNewQuestion] = useState("");

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
    <div id="room-page">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeaks" />
          <RoomCode code={params.id} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Room {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"}
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="What do you want to ask?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                To submit a question <button>please login.</button>
              </span>
            )}
            <Button type="submit" disabled={!newQuestion || !user}>
              Send question
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
