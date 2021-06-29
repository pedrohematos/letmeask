import { useHistory, useParams } from "react-router-dom";

import { Button } from "../../components/button/button.component";
import { RoomCode } from "../../components/room-code/room-code.component";
import { Question } from "../../components/question/question.component";

//import { useAuth } from "../../hooks/useAuth";

import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";

import "./admin-room-page.styles.scss";

type RoomsParams = {
  id: string;
};

export function AdminRoomPage() {
  //const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomsParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleCloseRoom() {
    if (window.confirm("Are you sure that you would like to close the room?")) {
      await database.ref(`rooms/${roomId}`).update({
        closedAt: new Date(),
      });

      history.push("/");
    }
  }

  async function handleQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (
      window.confirm(
        "Are you sure that you would like to delete this question?"
      )
    ) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="admin-room-page">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeaks" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleCloseRoom}>
              Close room
            </Button>
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
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Mark question as answered." />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Highlight question" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Delete question" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
