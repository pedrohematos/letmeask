import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "../../components/button/button.component";
import { RoomCode } from "../../components/room-code/room-code.component";
import { Question } from "../../components/question/question.component";

import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { useRoom } from "../../hooks/useRoom";

import logoImg from "../../assets/images/logo.svg";
import "./admin-room-page.styles.scss";

type RoomsParams = {
  id: string;
};

export function AdminRoomPage() {
  const { user } = useAuth();
  const params = useParams<RoomsParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const [newQuestion, setNewQuestion] = useState("");

  return (
    <div id="admin-room-page">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeaks" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined>Close room</Button>
          </div>
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
