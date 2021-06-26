import { Link, useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";

//import { useAuth } from "../hooks/useAuth";
import { Button } from "../../components/button/button.component";

import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

import "./new-room-page.styles.scss";

export function NewRoomPage() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Illustration symbolizing questions and answers"
        />
        <strong>Create live Q&amp;A rooms</strong>
        <p>Ask your audience's questions in real time.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Create a new room</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              required
              type="text"
              placeholder="Room name"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Create room</Button>
          </form>

          <p>
            Join an existing room? <Link to="/">Click here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
