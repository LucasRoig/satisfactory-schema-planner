// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { Graph } from "./modules/graph/graph";
import { ProfileContextProvider } from "./modules/profile/profile-context";
import { ProfileSwitcher } from "./modules/profile/profile-switcher";
import { queryClient } from "./query-client";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ProfileContextProvider>
        <Toaster />
        <div className={"flex flex-col h-screen"}>
          <div className="border-b bg-background">
            <div className="flex items-center h-16 px-4">
              <ProfileSwitcher />
            </div>
          </div>
          <main className="grow">
            <Graph />
          </main>
        </div>
      </ProfileContextProvider>
    </QueryClientProvider>
  );
}

export default App;
