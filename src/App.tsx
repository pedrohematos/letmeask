import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HomePage } from "./pages/home-page/home-page.component";
import { NewRoomPage } from "./pages/new-room-page/new-room-page";
import { RoomPage } from "./pages/room-page/room-page.component";

import { AuthContextProvider } from "./contexts/AuthContexts";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/rooms/new" component={NewRoomPage} />
          <Route path="/rooms/:id" component={RoomPage} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
