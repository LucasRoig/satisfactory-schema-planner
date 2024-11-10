// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { ProfileSwitcher } from "./modules/profile/profile-switcher";

function App() {
  return (
    <div className={"flex flex-col h-screen"}>
      <div className="border-b bg-background">
        <div className="flex items-center h-16 px-4">
          <ProfileSwitcher />
        </div>
      </div>
      <main className="grow">

      </main>
    </div>
  );
}

export default App;
