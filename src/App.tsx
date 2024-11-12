// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { ExportProfileButton } from "./modules/profile/export-profile-button";
import { ProfileContextProvider } from "./modules/profile/profile-context";
import { ProfileSwitcher } from "./modules/profile/profile-switcher";
import { SchemaDrawer } from "./modules/schema-drawer/schema-drawer";
import { SchemaDrawerContextProvider } from "./modules/schema-drawer/schema-drawer-context";
import { SettingsContextProvider } from "./modules/settings/settings-context";
import { queryClient } from "./query-client";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ProfileContextProvider>
        <SettingsContextProvider>
          <Toaster />
          <div className={"flex flex-col h-screen"}>
            <div className="border-b bg-background">
              <div className="flex items-center h-16 px-4">
                <ProfileSwitcher />
                <div className="ml-4 text-2xl grow">Satisfactory Schema Planner</div>
                <ExportProfileButton />
              </div>
            </div>
            <main className="grow">
              <SchemaDrawerContextProvider>
                <SchemaDrawer />
              </SchemaDrawerContextProvider>
            </main>
          </div>
        </SettingsContextProvider>
      </ProfileContextProvider>
    </QueryClientProvider>
  );
}

export default App;
